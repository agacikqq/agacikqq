
import type { Bracelet } from '@/types';
import { mockCharms } from './mock-charms';

export const mockBracelets: Bracelet[] = [
  {
    id: 'bracelet-1',
    name: 'Silver Link Chain Bracelet',
    slug: 'silver-link-chain-bracelet',
    description: 'A classic silver link chain bracelet, perfect for customizing with your favorite charms.',
    basePrice: 25.00,
    images: [
      'https://picsum.photos/seed/silverBracelet1/600/800',
      'https://picsum.photos/seed/silverBracelet2/600/800',
    ],
    materials: 'Sterling Silver',
    availableCharms: [mockCharms[0], mockCharms[1], mockCharms[2], mockCharms[4]], // Star, Heart, Moon, Paw
  },
  {
    id: 'bracelet-2',
    name: 'Braided Leather Bracelet',
    slug: 'braided-leather-bracelet',
    description: 'A stylish braided leather bracelet with a secure clasp, great for a rustic look.',
    basePrice: 18.50,
    images: [
      'https://picsum.photos/seed/leatherBracelet1/600/800',
    ],
    materials: 'Genuine Leather, Stainless Steel Clasp',
    availableCharms: [mockCharms[3], mockCharms[4], mockCharms[5]], // Initial A, Paw, Clover
  },
  {
    id: 'bracelet-3',
    name: 'Rose Gold Bangle',
    slug: 'rose-gold-bangle',
    description: 'Elegant rose gold bangle that can be worn alone or adorned with delicate charms.',
    basePrice: 32.75,
    images: [
      'https://picsum.photos/seed/roseGoldBangle1/600/800',
      'https://picsum.photos/seed/roseGoldBangle2/600/800',
    ],
    materials: 'Rose Gold Plated Stainless Steel',
    availableCharms: [mockCharms[0], mockCharms[1], mockCharms[5]], // Star, Heart, Clover
  },
  {
    id: 'bracelet-4',
    name: 'Beaded Charm Bracelet',
    slug: 'beaded-charm-bracelet',
    description: 'Colorful beaded bracelet with a stretch design, ready for a fun collection of charms.',
    basePrice: 15.00,
    images: [
      'https://picsum.photos/seed/beadedBracelet1/600/800',
    ],
    materials: 'Assorted Beads, Elastic Cord',
    availableCharms: mockCharms.slice(0, 4), // Star, Heart, Moon, Initial A
  },
];
