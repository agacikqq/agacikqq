
import type { MatchingBraceletSet } from '@/types';

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
        id: 'sun-bracelet',
        name: 'Golden Sun Bracelet',
        image: 'https://picsum.photos/seed/sunBraceletSet/400/400',
        materials: 'Gold-plated alloy, Amber bead',
        description: 'Radiant bracelet with a sun charm and warm amber bead.',
      },
      {
        id: 'moon-bracelet',
        name: 'Silver Moon Bracelet',
        image: 'https://picsum.photos/seed/moonBraceletSet/400/400',
        materials: 'Silver-plated alloy, Moonstone bead',
        description: 'Mystical bracelet with a moon charm and serene moonstone bead.',
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
        id: 'king-bracelet',
        name: 'King\'s Crown Bracelet',
        image: 'https://picsum.photos/seed/kingBraceletSet/400/400',
        materials: 'Black Lava Stone, Hematite, Crown Charm',
        description: 'Masculine bracelet with lava stones and a king crown charm.',
      },
      {
        id: 'queen-bracelet',
        name: 'Queen\'s Crown Bracelet',
        image: 'https://picsum.photos/seed/queenBraceletSet/400/400',
        materials: 'Rose Quartz, White Howlite, Crown Charm',
        description: 'Elegant bracelet with rose quartz and a queen crown charm.',
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
        id: 'infinity-1',
        name: 'Rose Gold Infinity Bracelet',
        image: 'https://picsum.photos/seed/infinityRose/400/400',
        materials: 'Rose Gold Plated Sterling Silver',
        description: 'A timeless piece in warm rose gold.',
      },
      {
        id: 'infinity-2',
        name: 'Sterling Silver Infinity Bracelet',
        image: 'https://picsum.photos/seed/infinitySilver/400/400',
        materials: 'Sterling Silver',
        description: 'Classic and elegant sterling silver.',
      },
    ],
  },
];
