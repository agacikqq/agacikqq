
import type { Sweatpants } from '@/types';

export const mockSweatpants: Sweatpants[] = [
  {
    id: 'sp1',
    name: 'Urban Comfort Joggers',
    slug: 'urban-comfort-joggers',
    description: 'Relax in style with these ultra-comfortable joggers, perfect for everyday wear or lounging.',
    price: 34.99,
    originalPrice: 44.99, // On sale
    images: [
      'https://picsum.photos/seed/jogger1/600/800',
      'https://picsum.photos/seed/jogger2/600/800',
    ],
    colors: [
      { name: 'Heather Grey', value: 'heather-grey', hex: '#B2BEB5', image: 'https://picsum.photos/seed/jogger1/600/800' },
      { name: 'Classic Black', value: 'classic-black', hex: '#000000', image: 'https://picsum.photos/seed/jogger2/600/800' },
      { name: 'Olive Green', value: 'olive-green', hex: '#808000' },
    ],
    availableSizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
    ],
    designs: [{ name: 'Cuffed Ankle', value: 'cuffed-ankle' }, { name: 'Drawstring Waist', value: 'drawstring-waist' }],
    materials: '85% Cotton, 15% Polyester Fleece',
    careInstructions: 'Machine wash cold with like colors, tumble dry low. Do not bleach.',
    origin: 'Ethically Sourced & Made',
  },
  {
    id: 'sp2',
    name: 'Street Smart Cargo Sweatpants',
    slug: 'street-smart-cargo-sweatpants',
    description: 'Functional and fashionable, these cargo sweatpants offer ample storage and a modern look.',
    price: 49.99,
    images: [
      'https://picsum.photos/seed/cargoPants1/600/800',
      'https://picsum.photos/seed/cargoPants2/600/800',
    ],
    colors: [
      { name: 'Khaki Beige', value: 'khaki-beige', hex: '#C3B091', image: 'https://picsum.photos/seed/cargoPants1/600/800' },
      { name: 'Charcoal', value: 'charcoal', hex: '#36454F', image: 'https://picsum.photos/seed/cargoPants2/600/800' },
    ],
    availableSizes: [
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'X-Large', value: 'XL' },
    ],
    designs: [{ name: 'Multi-Pocket Cargo', value: 'multi-pocket-cargo' }, { name: 'Relaxed Fit', value: 'relaxed-fit' }],
    materials: '70% Cotton, 30% Recycled Polyester Twill',
    careInstructions: 'Machine wash warm, inside out. Tumble dry medium. Iron low if needed.',
    origin: 'Urban Factory Certified',
  },
  {
    id: 'sp3',
    name: 'Performance Tech Sweatpants',
    slug: 'performance-tech-sweatpants',
    description: 'Engineered for activity, these tech sweatpants are breathable, flexible, and quick-drying.',
    price: 55.00,
    images: [
      'https://picsum.photos/seed/techPants1/600/800',
    ],
    colors: [
      { name: 'Deep Navy', value: 'deep-navy', hex: '#000080', image: 'https://picsum.photos/seed/techPants1/600/800' },
      { name: 'Graphite', value: 'graphite', hex: '#383838' },
    ],
    availableSizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'X-Large', value: 'XL' },
    ],
    designs: [{ name: 'Tapered Leg', value: 'tapered-leg' }, { name: 'Zippered Pockets', value: 'zippered-pockets' }],
    materials: '90% Polyester, 10% Spandex Performance Blend',
    careInstructions: 'Machine wash cold, do not use fabric softeners. Tumble dry low or hang dry.',
    origin: 'Performance Lab Tested',
  },
];
