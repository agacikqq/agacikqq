
'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Shirt, Gem, HeartHandshake, Percent, Slack } from 'lucide-react'; // Added Slack for sweatpants

export default function HomePage() {
  const categories = [
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
      icon: <Slack className="h-16 w-16 text-accent" />, // Using Slack icon as placeholder for sweatpants
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
      name: 'Matching Sets',
      href: '/matching-bracelets',
      icon: <HeartHandshake className="h-16 w-16 text-accent" />,
      description: 'Find perfect pairs to share or complete your style.',
      imageSrc: 'https://picsum.photos/seed/matchingCat/600/400',
      imageHint: 'friends matching braceletz',
    },
    {
      name: 'Hot Deals',
      href: '/sale',
      icon: <Percent className="h-16 w-16 text-accent" />,
      description: 'Grab amazing discounts on your favorite items.',
      imageSrc: 'https://picsum.photos/seed/saleCat/600/400',
      imageHint: 'sale shopping discount',
    },
  ];

  return (
    <>
      <Header />
      <main className="flex-1 bg-transparent">
        {/* Hero Section */}
        <section className="py-16 md:py-24 text-center bg-gradient-to-br from-primary/30 via-background to-background">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary mb-6">
              Welcome to cœzii!
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Your one-stop shop for the coolest hoodiez, comfiest sweatpantz, customizable braceletz, and matching sets. Express yourself with cœzii!
            </p>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-xl px-10 py-7 rounded-full">
              <Link href="/hoodies">Shop All Hoodiez</Link>
            </Button>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-primary mb-12">
              Explore Our Collections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categories.map((category) => (
                <Link href={category.href} key={category.name} legacyBehavior>
                  <a className="block group bg-card p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-6">
                       <Image
                        src={category.imageSrc}
                        alt={`Image for ${category.name}`}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 group-hover:scale-110"
                        data-ai-hint={category.imageHint}
                      />
                    </div>
                    <div className="flex items-center justify-center mb-4 text-accent">
                         {React.cloneElement(category.icon, { className: "h-12 w-12 text-accent group-hover:animate-pulse" })}
                    </div>
                    <h3 className="text-2xl font-semibold text-center text-card-foreground mb-2 group-hover:text-accent">
                      {category.name}
                    </h3>
                    <p className="text-center text-muted-foreground text-md">
                      {category.description}
                    </p>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured Product Placeholder */}
        <section className="py-16 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-primary mb-6">Today's Feature</h2>
                <div className="max-w-md mx-auto bg-card p-8 rounded-xl shadow-xl">
                    <Image 
                        src="https://picsum.photos/seed/featuredProduct/600/400" 
                        alt="Featured Product" 
                        width={600} 
                        height={400} 
                        className="rounded-lg mb-6"
                        data-ai-hint="cool trendy clothing"
                    />
                    <h3 className="text-3xl font-semibold text-card-foreground mb-3">The "Trendsetter" Hoodiez</h3>
                    <p className="text-lg text-muted-foreground mb-6">Limited edition design. Get yours before it's gone!</p>
                    <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link href="/hoodies/cosmic-dreamer-hoodie">Check it Out</Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>
      <footer className="py-8 text-center border-t bg-primary/10">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} cœzii. All rights reserved.</p>
      </footer>
    </>
  );
}

