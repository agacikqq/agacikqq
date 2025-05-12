
import type { Hoodie, Sweatpants, Bracelet, MatchingBraceletSet } from '@/types';
import { mockHoodies } from '@/data/mock-hoodies';
import { mockSweatpants } from '@/data/mock-sweatpants';
import { mockBracelets } from '@/data/mock-bracelets';
import { mockMatchingBracelets } from '@/data/mock-matching-bracelets';

export type ProductType = 'hoodie' | 'sweatpants' | 'bracelet' | 'matchingSet';

export function getFullProductDetails(productId: string, productType: ProductType): Hoodie | Sweatpants | Bracelet | MatchingBraceletSet | undefined {
    switch (productType) {
        case 'hoodie':
            return mockHoodies.find(p => p.id === productId);
        case 'sweatpants':
            return mockSweatpants.find(p => p.id === productId);
        case 'bracelet':
            return mockBracelets.find(p => p.id === productId);
        case 'matchingSet':
            return mockMatchingBracelets.find(p => p.id === productId);
        default:
            // Should not happen with type safety, but good to have a default
            console.warn(`Unknown product type encountered in getFullProductDetails: ${productType}`);
            return undefined;
    }
}
