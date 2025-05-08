
import type { ReactElement } from 'react';
import React from 'react';
import { Shirt, Gem, HeartHandshake, Percent, Slack, Package } from 'lucide-react';

export interface Category {
  name: string;
  href: string;
  icon: ReactElement;
  description: string;
  imageSrc: string;
  imageHint: string;
}

export const categories: Category[] = [
  {
    name: 'Awesome Hoodiez',
    href: '/hoodies',
    icon: <Shirt className="h-16 w-16 text-accent" />,
    description: 'Explore our wide range of stylish and comfortable hoodiez.',
    imageSrc: 'https://picsum.photos/seed/hoodieCat/600/400',
    imageHint: 'teenager wearing hoodiez',
  },
  {
    name: 'Comfy Sweatpantz',
    href: '/sweatpants',
    icon: <Slack className="h-16 w-16 text-accent" />,
    description: 'Relax in style with our collection of cozy sweatpantz.',
    imageSrc: 'https://picsum.photos/seed/sweatpantsCat/600/400',
    imageHint: 'person wearing sweatpantz',
  },
  {
    name: 'Individual Braceletz',
    href: '/collections',
    icon: <Gem className="h-16 w-16 text-accent" />,
    description: 'Customize your look with unique braceletz and charms.',
    imageSrc: 'https://picsum.photos/seed/braceletCat/600/400',
    imageHint: 'silver charm braceletz',
  },
  {
    name: 'Matching Setz',
    href: '/matching-bracelets',
    icon: <HeartHandshake className="h-16 w-16 text-accent" />,
    description: 'Find perfect pairs to share or complete your style.',
    imageSrc: 'https://picsum.photos/seed/matchingCat/600/400',
    imageHint: 'friends matching braceletz',
  },
  {
    name: 'Hot Dealz',
    href: '/salez', // Corrected from /sale to /salez based on existing page
    icon: <Percent className="h-16 w-16 text-accent" />,
    description: 'Grab amazing discounts on your favorite items.',
    imageSrc: 'https://picsum.photos/seed/saleCat/600/400',
    imageHint: 'sale shopping discount',
  },
];
