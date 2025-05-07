
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

export interface Filters {
  colors: string[];
  sizes: string[];
  designs: string[];
}

// New types for Bracelets and Charms
export interface Charm {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export interface Bracelet {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  images: string[]; // URLs to images, first image is primary
  materials: string; // e.g., "Sterling Silver, Leather"
  availableCharms: Charm[]; // Array of available charms for this bracelet
  // Optional: Add other relevant properties like clasp type, length options, etc.
}
