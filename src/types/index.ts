
import type { SendOrderConfirmationEmailInput } from '@/ai/flows/send-order-confirmation-email-flow';

export interface ProductColor {
  name: string; // e.g., "Ocean Blue"
  value: string; // e.g., "ocean-blue"
  hex: string;   // e.g., "#0077BE"
  image?: string; // Optional: URL to image specific to this color variant
}

export interface ProductSize {
  name: string; // e.g., "Small"
  value: string; // e.g., "S"
}

export interface ProductDesign {
  name: string; // e.g., "Classic Logo"
  value: string; // e.g., "classic-logo"
}

export interface Hoodie {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Added for sale price functionality
  images: string[]; // URLs to images, first image is primary
  colors: ProductColor[];
  availableSizes: ProductSize[];
  designs: ProductDesign[]; // Could be tags or specific design variants
  materials: string;
  careInstructions: string;
  origin: string;
  slug: string;
}

export interface Sweatpants {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  colors: ProductColor[];
  availableSizes: ProductSize[];
  designs: ProductDesign[]; // e.g., "Cuffed", "Straight Leg", "With Stripes"
  materials: string;
  careInstructions: string;
  origin: string;
  slug: string;
}

export interface Filters {
  colors: string[];
  sizes: string[];
  designs: string[];
}

// Charm type
export interface Charm {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

// Individual Bracelet type (customizable with charms)
export interface Bracelet {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  images: string[]; // URLs to images, first image is primary
  materials: string; // e.g., "Sterling Silver, Leather"
  availableCharms: Charm[]; // Array of available charms for this bracelet
}

// Matching Bracelet Set type
export interface MatchingBraceletSet {
  id: string;
  name: string; // e.g., "Sun & Moon Lovers Set"
  slug: string;
  description: string; // Description of the entire set
  setPrice: number; // Price for the whole set
  originalSetPrice?: number; // For sales
  images: string[]; // Images showcasing the set (e.g., both bracelets worn together)
  bracelets: Bracelet[]; // Each bracelet in the set is a full Bracelet object, allowing for individual customization
}


// Cart Item Types
export interface CartItemBase {
  cartItemId: string; // Unique ID for this specific instance in the cart
  productId: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number; // Price of a single unit with its current configuration
}

export interface HoodieCartItem extends CartItemBase {
  productType: 'hoodie'; 
  selectedColor: ProductColor;
  selectedSize: ProductSize;
}

export interface SweatpantsCartItem extends CartItemBase {
  productType: 'sweatpants'; 
  selectedColor: ProductColor;
  selectedSize: ProductSize;
}

export interface BraceletCustomization {
  braceletId: string;
  braceletName: string;
  selectedCharms: Charm[];
}
export interface BraceletCartItem extends CartItemBase {
  productType: 'bracelet'; 
  baseBraceletPrice: number;
  selectedCharms: Charm[];
}

export interface MatchingSetCartItem extends CartItemBase {
  productType: 'matchingSet';
  setBasePrice: number;
  braceletsCustomization: BraceletCustomization[];
}

export type CartItem = HoodieCartItem | BraceletCartItem | MatchingSetCartItem | SweatpantsCartItem;

// For re-opening modals for editing
export type EditingItemState = 
  | { type: 'hoodie'; item: HoodieCartItem; cartItemId: string; productId: string } // Added productId
  | { type: 'sweatpants'; item: SweatpantsCartItem; cartItemId: string; productId: string } // Added productId
  | { type: 'bracelet'; item: BraceletCartItem; originalBracelet: Bracelet; cartItemId: string; productId: string } // Added productId
  | { type: 'matchingSet'; item: MatchingSetCartItem; originalSet: MatchingBraceletSet; cartItemId: string; productId: string } // Added productId
  | null;

// Order History
// The ShippingAddress type within SendOrderConfirmationEmailInput will be updated
// when the flow file changes, so PastOrder will inherit this change.
export interface PastOrder extends SendOrderConfirmationEmailInput {
  orderId: string;
  orderDate: string; // ISO string date for easy sorting and display
}

// For AI Flow - Product Recommendation
export interface SummarizedProduct {
  id: string;
  name: string;
  productType: 'hoodie' | 'sweatpants' | 'bracelet' | 'matchingSet';
  description: string;
}

export interface RecommendedProduct {
  productId: string;
  productType: 'hoodie' | 'sweatpants' | 'bracelet' | 'matchingSet';
  name: string;
  reason: string;
}

