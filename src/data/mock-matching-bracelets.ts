
import type { MatchingBraceletSet, Bracelet } from '@/types';
import { mockCharms } from './mock-charms';

export const mockMatchingBracelets: MatchingBraceletSet[] = [
  {
    id: 'match-set-1',
    name: 'Sun & Moon Harmony Set',
    slug: 'sun-moon-harmony-set',
    description: 'A beautiful set representing the eternal dance of sun and moon. Perfect for couples or best friends.',
    setPrice: 55.00,
    originalSetPrice: 65.00, // On sale
    images: [
      'https://picsum.photos/seed/sunMoonSet1/600/800',
      'https://picsum.photos/seed/sunMoonSet2/600/800',
    ],
    bracelets: [
      {
        id: 'sun-bracelet-in-set',
        name: 'Golden Sun Bracelet',
        slug: 'golden-sun-bracelet-in-set',
        images: ['https://picsum.photos/seed/sunBraceletSet/400/400'],
        materials: 'Gold-plated alloy, Amber bead',
        description: 'Radiant bracelet with a sun charm and warm amber bead.',
        basePrice: 0, // Covered by set price
        availableCharms: [mockCharms[0], mockCharms[2], mockCharms[5]], // Star, Moon, Clover
      },
      {
        id: 'moon-bracelet-in-set',
        name: 'Silver Moon Bracelet',
        slug: 'silver-moon-bracelet-in-set',
        images: ['https://picsum.photos/seed/moonBraceletSet/400/400'],
        materials: 'Silver-plated alloy, Moonstone bead',
        description: 'Mystical bracelet with a moon charm and serene moonstone bead.',
        basePrice: 0, // Covered by set price
        availableCharms: [mockCharms[1], mockCharms[3], mockCharms[4]], // Heart, Initial A, Paw
      },
    ],
  },
  {
    id: 'match-set-2',
    name: 'King & Queen Duo',
    slug: 'king-queen-duo',
    description: 'Rule your world together with this regal matching bracelet set, adorned with crown charms.',
    setPrice: 60.00,
    images: [
      'https://picsum.photos/seed/kingQueenSet1/600/800',
    ],
    bracelets: [
      {
        id: 'king-bracelet-in-set',
        name: 'King\'s Crown Bracelet',
        slug: 'kings-crown-bracelet-in-set',
        images: ['https://picsum.photos/seed/kingBraceletSet/400/400'],
        materials: 'Black Lava Stone, Hematite, Crown Charm',
        description: 'Masculine bracelet with lava stones and a king crown charm.',
        basePrice: 0,
        availableCharms: [mockCharms[3], mockCharms[4]], // Initial A, Paw
      },
      {
        id: 'queen-bracelet-in-set',
        name: 'Queen\'s Crown Bracelet',
        slug: 'queens-crown-bracelet-in-set',
        images: ['https://picsum.photos/seed/queenBraceletSet/400/400'],
        materials: 'Rose Quartz, White Howlite, Crown Charm',
        description: 'Elegant bracelet with rose quartz and a queen crown charm.',
        basePrice: 0,
        availableCharms: [mockCharms[0], mockCharms[1], mockCharms[5]], // Star, Heart, Clover
      },
    ],
  },
  {
    id: 'match-set-3',
    name: 'Infinity Bond Set',
    slug: 'infinity-bond-set',
    description: 'Symbolize your everlasting connection with these delicate infinity symbol bracelets.',
    setPrice: 48.00,
    images: [
      'https://picsum.photos/seed/infinitySet1/600/800',
      'https://picsum.photos/seed/infinitySet2/600/800',
    ],
    bracelets: [
      {
        id: 'infinity-1-in-set',
        name: 'Rose Gold Infinity Bracelet',
        slug: 'rose-gold-infinity-in-set',
        images: ['https://picsum.photos/seed/infinityRose/400/400'],
        materials: 'Rose Gold Plated Sterling Silver',
        description: 'A timeless piece in warm rose gold.',
        basePrice: 0,
        availableCharms: [], // This one is not customizable with extra charms in the mock
      },
      {
        id: 'infinity-2-in-set',
        name: 'Sterling Silver Infinity Bracelet',
        slug: 'sterling-silver-infinity-in-set',
        images: ['https://picsum.photos/seed/infinitySilver/400/400'],
        materials: 'Sterling Silver',
        description: 'Classic and elegant sterling silver.',
        basePrice: 0,
        availableCharms: [mockCharms[0], mockCharms[1]], // Star, Heart
      },
    ],
  },
];
