
'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/footer'; 
import { categories } from '@/data/categories.tsx'; 
import { RecommendedProductsSection } from '@/components/recommended-products-section';
import type { RecommendedProduct as RecommendedProductType, SummarizedProduct } from '@/ai/flows/recommend-products-flow';
import { useCart } from '@/context/cart-context';

// This function needs to be invokable from the client if we refresh recommendations based on cart changes
// For initial load, it can be called on the server (if page.tsx is server component)
// Or, if page.tsx must be client due to other hooks, then this is called in useEffect.
// For now, let's assume page.tsx is a client component and calls this in useEffect.
// However, to avoid calling AI on every render, better to fetch once or pass from server.

// Making page.tsx a client component for simplicity with useCart hook.
// The AI call will happen client-side in this setup. For SSR AI call, page.tsx would be server and pass data to client child.

export default function HomePage() {
  const displayCategories = categories.filter(category => category.name !== 'All Productz');
  const { items: cartItems } = useCart();
  const [recommendations, setRecommendations] = useState<RecommendedProductType[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoadingRecommendations(true);
      try {
        // Dynamically import the server action
        const { recommendProducts } = await import('@/ai/flows/recommend-products-flow');

        const summarizedCartItems: SummarizedProduct[] = cartItems.map(item => ({
          id: item.productId,
          name: item.name,
          productType: item.productType,
          description: '', // Description not strictly needed from cart for this summarization
        }));

        const recs = await recommendProducts({ currentCartItems: summarizedCartItems, numberOfRecommendations: 4 });
        setRecommendations(recs);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        setRecommendations([]); // Set to empty on error
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [cartItems]); // Re-fetch recommendations if cart changes

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-transparent">
        {/* Hero Section */}
        <section className="py-16 md:py-24 text-center bg-gradient-to-br from-primary/30 via-background to-background">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary mb-6">
              Welcome to cœzii!
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Your one-stop shop for the coolest hoodiez, comfiest sweatpantz, customizable braceletz, and matching setz. Express yourself with cœzii!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-xl px-10 py-7 rounded-full">
                  <Link href="/hoodies">Shop All Hoodiez</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-xl px-10 py-7 rounded-full border-accent text-accent hover:bg-accent/10">
                  <Link href="/browse/all-items">Explore All Productz</Link>
                </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-primary mb-12">
              Explore Our Collections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayCategories.map((category) => (
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
        
        {/* Recommended Products Section */}
        <RecommendedProductsSection 
          recommendations={recommendations} 
          isLoading={isLoadingRecommendations} 
        />
        
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
                        <Link href="/hoodies/1">Check it Out</Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
