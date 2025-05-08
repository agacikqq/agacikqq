
'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { categories } from '@/data/categories.tsx';
import { LayoutGrid } from 'lucide-react';

export default function AllProductsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8 bg-transparent">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold text-primary mb-3 flex items-center justify-center gap-3">
              <LayoutGrid className="h-12 w-12 text-accent animate-pulse" />
              Explore All Our Productz
            </h1>
            <p className="text-xl text-muted-foreground">
              Find everything cœzii has to offer, from comfy apparel to unique accessories.
            </p>
          </div>

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
      </main>
      <Footer />
    </div>
  );
}
