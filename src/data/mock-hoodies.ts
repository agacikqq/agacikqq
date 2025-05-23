import type { Hoodie } from '@/types';

export const mockHoodies: Hoodie[] = [
  {
    id: '1',
    name: 'Cosmic Dreamer Hoodie',
    slug: 'cosmic-dreamer-hoodie',
    description: 'Float away in this super-soft hoodie featuring a dreamy cosmic print. Perfect for stargazers and daydreamers.',
    price: 39.99, // Sale price
    originalPrice: 49.99, // Original price
    images: [
      'https://picsum.photos/seed/cosmic1/600/800',
      'https://picsum.photos/seed/cosmic2/600/800',
      'https://picsum.photos/seed/cosmic3/600/800',
    ],
    colors: [
      { name: 'Galaxy Purple', value: 'galaxy-purple', hex: '#5A4A9F', image: 'https://picsum.photos/seed/cosmic1/600/800' },
      { name: 'Midnight Blue', value: 'midnight-blue', hex: '#003366', image: 'https://picsum.photos/seed/cosmic2/600/800' },
    ],
    availableSizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
    ],
    designs: [{ name: 'Cosmic Print', value: 'cosmic-print' }],
    materials: '80% Cotton, 20% Polyester',
    careInstructions: 'Machine wash cold, tumble dry low. Do not bleach. Iron on low heat if necessary.',
    origin: 'Made with love in Planet Earth',
  },
  {
    id: '2',
    name: 'Skater Vibe Hoodie',
    slug: 'skater-vibe-hoodie',
    description: 'Nail that kickflip in style with this comfy and durable skater hoodie. Bold graphics for a bold attitude.',
    price: 54.99, // No sale
    images: [
      'https://picsum.photos/seed/skater1/600/800',
      'https://picsum.photos/seed/skater2/600/800',
    ],
    colors: [
      { name: 'Graphite Gray', value: 'graphite-gray', hex: '#555555', image: 'https://picsum.photos/seed/skater1/600/800' },
      { name: 'Cherry Red', value: 'cherry-red', hex: '#D2042D', image: 'https://picsum.photos/seed/skater2/600/800'},
      { name: 'Electric Blue', value: 'electric-blue', hex: '#007FFF' }, // No specific image, will default
    ],
    availableSizes: [
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'X-Large', value: 'XL' },
    ],
    designs: [{ name: 'Skate Graphic', value: 'skate-graphic' }],
    materials: '70% Cotton, 30% Polyester',
    careInstructions: 'Machine wash warm with like colors. Tumble dry medium. Do not iron decoration.',
    origin: 'Designed in California',
  },
  {
    id: '3',
    name: 'Pastel Cloud Hoodie',
    slug: 'pastel-cloud-hoodie',
    description: 'Soft as a cloud, cute as a button! This pastel hoodie is perfect for a gentle, dreamy look.',
    price: 35.00, // Sale price
    originalPrice: 45.00, // Original price
    images: [
      'https://picsum.photos/seed/pastel1/600/800',
      'https://picsum.photos/seed/pastel2/600/800',
    ],
    colors: [
      { name: 'Baby Pink', value: 'baby-pink', hex: '#FFB6C1', image: 'https://picsum.photos/seed/pastel1/600/800' },
      { name: 'Sky Blue', value: 'sky-blue', hex: '#ADD8E6', image: 'https://picsum.photos/seed/pastel2/600/800' },
      { name: 'Mint Green', value: 'mint-green', hex: '#98FF98' },
    ],
    availableSizes: [
      { name: 'X-Small', value: 'XS' },
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
    ],
    designs: [{ name: 'Minimal Cloud Embroidery', value: 'cloud-embroidery' }],
    materials: '90% Cotton, 10% Spandex for a little stretch',
    careInstructions: 'Gentle machine wash. Lay flat to dry or tumble dry low. Cool iron if needed.',
    origin: 'Woven in Dreamland',
  },
  {
    id: '4',
    name: 'Gamer Fuel Hoodie',
    slug: 'gamer-fuel-hoodie',
    description: 'Level up your comfort and style. This hoodie is designed for marathon gaming sessions and everyday epicness.',
    price: 59.99, // No sale
    images: [
      'https://picsum.photos/seed/gamer1/600/800',
    ],
    colors: [
      { name: 'Stealth Black', value: 'stealth-black', hex: '#1C1C1C', image: 'https://picsum.photos/seed/gamer1/600/800' },
      { name: 'Neon Green', value: 'neon-green', hex: '#39FF14' },
    ],
    availableSizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'X-Large', value: 'XL' },
    ],
    designs: [{ name: 'Pixel Power', value: 'pixel-power' }, { name: 'Controller Icon', value: 'controller-icon'}],
    materials: '60% Cotton, 40% Performance Polyester',
    careInstructions: 'Wash inside out. Machine wash cold. Do not use fabric softener. Tumble dry low.',
    origin: 'Forged in the Game World',
  },
  {
    id: '5',
    name: 'Art Club Abstract Hoodie',
    slug: 'art-club-abstract-hoodie',
    description: 'Express your inner artist with this unique abstract design hoodie. A wearable masterpiece!',
    price: 42.00, // Sale price
    originalPrice: 52.50, // Original price
    images: [
      'https://picsum.photos/seed/art1/600/800',
      'https://picsum.photos/seed/art2/600/800',
    ],
    colors: [
      { name: 'Canvas White', value: 'canvas-white', hex: '#F5F5F5', image: 'https://picsum.photos/seed/art1/600/800' },
      { name: 'Ink Black', value: 'ink-black', hex: '#000000', image: 'https://picsum.photos/seed/art2/600/800' },
    ],
    availableSizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
    ],
    designs: [{ name: 'Abstract Splash', value: 'abstract-splash' }],
    materials: '100% Organic Cotton',
    careInstructions: 'Hand wash or machine wash delicate. Hang to dry to preserve print. Iron reverse.',
    origin: 'Studio Crafted',
  },
];
