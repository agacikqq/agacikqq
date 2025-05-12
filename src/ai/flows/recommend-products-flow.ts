
'use server';
/**
 * @fileOverview Recommends products to the user.
 *
 * - recommendProducts - A function that recommends products.
 * - RecommendProductsInput - The input type for the recommendProducts function.
 * - RecommendedProduct - The type of a single recommended product.
 * - RecommendProductsOutput - The return type for the recommendProducts function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { mockHoodies } from '@/data/mock-hoodies';
import { mockSweatpants } from '@/data/mock-sweatpants';
import { mockBracelets } from '@/data/mock-bracelets';
import { mockMatchingBracelets } from '@/data/mock-matching-bracelets';


const SummarizedProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  productType: z.enum(['hoodie', 'sweatpants', 'bracelet', 'matchingSet']),
  description: z.string(),
});
export type SummarizedProduct = z.infer<typeof SummarizedProductSchema>;

const RecommendProductsInputSchema = z.object({
  currentCartItems: z.array(SummarizedProductSchema).optional().describe("Optional. A list of items currently in the user's cart, to help tailor recommendations."),
  numberOfRecommendations: z.number().int().positive().max(6).optional().default(4).describe("Number of recommendations to return (max 6)."),
});
export type RecommendProductsInput = z.infer<typeof RecommendProductsInputSchema>;

const RecommendedProductSchema = z.object({
  productId: z.string().describe("The ID of the recommended product."),
  productType: z.enum(['hoodie', 'sweatpants', 'bracelet', 'matchingSet']).describe("The type of the recommended product."),
  name: z.string().describe("The name of the recommended product."),
  reason: z.string().describe("A brief reason why this product is recommended (max 20 words)."),
});
export type RecommendedProduct = z.infer<typeof RecommendedProductSchema>;

const RecommendProductsOutputSchema = z.array(RecommendedProductSchema);
export type RecommendProductsOutput = z.infer<typeof RecommendProductsOutputSchema>;


function getAllSummarizedProducts(): SummarizedProduct[] {
  const allProducts: SummarizedProduct[] = [];
  mockHoodies.forEach(p => allProducts.push({ id: p.id, name: p.name, productType: 'hoodie', description: p.description.substring(0, 150) + (p.description.length > 150 ? '...' : '') }));
  mockSweatpants.forEach(p => allProducts.push({ id: p.id, name: p.name, productType: 'sweatpants', description: p.description.substring(0, 150) + (p.description.length > 150 ? '...' : '') }));
  mockBracelets.forEach(p => allProducts.push({ id: p.id, name: p.name, productType: 'bracelet', description: p.description.substring(0, 150) + (p.description.length > 150 ? '...' : '') }));
  mockMatchingBracelets.forEach(p => allProducts.push({ id: p.id, name: p.name, productType: 'matchingSet', description: p.description.substring(0, 150) + (p.description.length > 150 ? '...' : '') }));
  return allProducts;
}

export async function recommendProducts(input: RecommendProductsInput): Promise<RecommendProductsOutput> {
  return recommendProductsFlow(input);
}

const recommendationPrompt = ai.definePrompt({
  name: 'recommendProductsPrompt',
  input: { schema: z.object({ allProducts: z.array(SummarizedProductSchema), currentCartItems: z.array(SummarizedProductSchema).optional(), numberOfRecommendations: z.number() }) },
  output: { schema: RecommendProductsOutputSchema },
  prompt: `You are a friendly and helpful fashion advisor for "cœzii", a trendy clothing and accessories brand for teens.
Your goal is to recommend {{numberOfRecommendations}} products from our catalog that the user might like.

Here is our full product catalog:
{{#each allProducts}}
- Product ID: {{this.id}}, Type: {{this.productType}}, Name: "{{this.name}}", Description: "{{this.description}}"
{{/each}}

{{#if currentCartItems.length}}
The user currently has the following items in their cart:
{{#each currentCartItems}}
- Type: {{this.productType}}, Name: "{{this.name}}", Description: "{{this.description}}"
{{/each}}
Please recommend {{numberOfRecommendations}} OTHER products from the catalog that would complement these items or that they might also enjoy. Do NOT recommend items already in their cart.
Prioritize items that are different from what's in the cart to offer variety.
{{else}}
Please recommend {{numberOfRecommendations}} diverse and popular products from our catalog that a teen would love. Choose a mix of product types if possible.
{{/if}}

For each recommendation, provide the productId, productType (must be one of: hoodie, sweatpants, bracelet, matchingSet), name, and a short, engaging reason (max 15-20 words) why they might like it.
Ensure your recommendations are distinct and offer variety.
Return your recommendations in the specified JSON array format. Ensure productId, productType, and name exactly match an item from the catalog.
If you cannot find enough distinct recommendations, return fewer than requested.
Example of a single recommendation object:
{ "productId": "example-id", "productType": "hoodie", "name": "Example Hoodie", "reason": "This cozy hoodie is perfect for cool evenings." }
Make sure the 'name' field in your output exactly matches the name of the product from the catalog for the given 'productId'.
`,
});

const recommendProductsFlow = ai.defineFlow(
  {
    name: 'recommendProductsFlow',
    inputSchema: RecommendProductsInputSchema,
    outputSchema: RecommendProductsOutputSchema,
  },
  async (input) => {
    const allProducts = getAllSummarizedProducts();
    const cartProductIds = input.currentCartItems?.map(item => item.id) || [];

    const promptInput = {
      allProducts: allProducts.filter(p => !cartProductIds.includes(p.id)), // Exclude cart items from catalog sent to LLM
      currentCartItems: input.currentCartItems,
      numberOfRecommendations: input.numberOfRecommendations || 4,
    };

    // If allProducts is empty after filtering (e.g. all products are in cart),
    // then send the unfiltered list to at least get some general recommendations.
    if (promptInput.allProducts.length === 0 && allProducts.length > 0) {
      promptInput.allProducts = allProducts;
    }
    
    const { output } = await recommendationPrompt(promptInput);
    
    if (!output) {
        console.error("Genkit prompt 'recommendProductsPrompt' did not return the expected output format.");
        return [];
    }

    // Further validation: ensure recommended products actually exist in our catalog
    // and are not items that were in the cart (if any were provided).
    const validatedOutput = output.filter(rec => {
        const productExists = allProducts.some(p => p.id === rec.productId && p.productType === rec.productType && p.name === rec.name);
        const notInCart = !cartProductIds.includes(rec.productId);
        if (!productExists) {
            console.warn(`Recommendation for non-existent/mismatched product: ID ${rec.productId}, Type ${rec.productType}, Name "${rec.name}"`);
        }
        return productExists && (input.currentCartItems ? notInCart : true);
    });

    if (validatedOutput.length !== output.length) {
        const diff = output.length - validatedOutput.length;
        console.warn(`${diff} recommendation(s) were filtered out due to mismatch with catalog or being in cart.`);
    }
    
    // Ensure we don't exceed the requested number of recommendations
    return validatedOutput.slice(0, input.numberOfRecommendations || 4);
  }
);

