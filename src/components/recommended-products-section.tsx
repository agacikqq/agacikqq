
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { RecommendedProduct as RecommendedProductType } from '@/ai/flows/recommend-products-flow';
import { getFullProductDetails, type ProductType } from '@/lib/product-utils'; // Updated import
import type { Hoodie, Sweatpants, Bracelet, MatchingBraceletSet, CartItem, HoodieCartItem, SweatpantsCartItem, BraceletCartItem, MatchingSetCartItem } from '@/types';

import { ProductCard } from '@/components/product-card';
import { SweatpantsCard } from '@/components/sweatpants-card';
import { BraceletCard } from '@/components/bracelet-card';
import { MatchingBraceletSetCard } from '@/components/matching-bracelet-set-card';
import { ProductDetailModal } from '@/components/product-detail-modal';
import { SweatpantsDetailModal } from '@/components/sweatpants-detail-modal';
import { BraceletDetailModal } from '@/components/bracelet-detail-modal';
import { MatchingBraceletSetDetailModal } from '@/components/matching-bracelet-set-detail-modal';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RecommendedProductsSectionProps {
  recommendations: RecommendedProductType[];
  isLoading: boolean;
}

export function RecommendedProductsSection({ recommendations, isLoading }: RecommendedProductsSectionProps) {
  const router = useRouter();
  const { setEditingItem } = useCart();

  const [selectedHoodie, setSelectedHoodie] = useState<Hoodie | null>(null);
  const [isHoodieModalOpen, setIsHoodieModalOpen] = useState(false);

  const [selectedSweatpants, setSelectedSweatpants] = useState<Sweatpants | null>(null);
  const [isSweatpantsModalOpen, setIsSweatpantsModalOpen] = useState(false);

  const [selectedBracelet, setSelectedBracelet] = useState<Bracelet | null>(null);
  const [isBraceletModalOpen, setIsBraceletModalOpen] = useState(false);

  const [selectedMatchingSet, setSelectedMatchingSet] = useState<MatchingBraceletSet | null>(null);
  const [isMatchingSetModalOpen, setIsMatchingSetModalOpen] = useState(false);


  const handleViewDetails = (productId: string, productType: ProductType) => { // Use ProductType from product-utils
    const product = getFullProductDetails(productId, productType);
    if (!product) return;

    // Logic to open the correct modal based on productType
    if (productType === 'hoodie') {
        setSelectedHoodie(product as Hoodie);
        setIsHoodieModalOpen(true);
    } else if (productType === 'sweatpants') {
        setSelectedSweatpants(product as Sweatpants);
        setIsSweatpantsModalOpen(true);
    } else if (productType === 'bracelet') {
        setSelectedBracelet(product as Bracelet);
        setIsBraceletModalOpen(true);
    } else if (productType === 'matchingSet') {
        setSelectedMatchingSet(product as MatchingBraceletSet);
        setIsMatchingSetModalOpen(true);
    }
  };
  
  // Consolidate modal close handlers
  const closeModal = () => {
    setIsHoodieModalOpen(false);
    setSelectedHoodie(null);
    setIsSweatpantsModalOpen(false);
    setSelectedSweatpants(null);
    setIsBraceletModalOpen(false);
    setSelectedBracelet(null);
    setIsMatchingSetModalOpen(false);
    setSelectedMatchingSet(null);
    // Note: We don't clear editingItem here because the modals themselves handle it
    // if they were opened for editing. For fresh views, editingItem is already null.
  };


  if (isLoading) {
    return (
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-12 flex items-center justify-center gap-3">
            <Gift className="h-10 w-10 text-accent animate-pulse" />
            Just For You...
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-card p-4 rounded-xl shadow-lg">
                <Skeleton className="aspect-[3/4] w-full rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null; // Don't render the section if there are no recommendations
  }
  
  return (
    <>
      <section className="py-16 md:py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-12 flex items-center justify-center gap-3">
            <Gift className="h-10 w-10 text-accent" />
            Cœzii Pickz For You!
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map((rec) => {
              const productData = getFullProductDetails(rec.productId, rec.productType as ProductType); // Cast to ProductType
              if (!productData) return null;

              let CardComponent;
              let cardProps: any = { onViewDetailsClick: () => handleViewDetails(rec.productId, rec.productType as ProductType) };

              switch (rec.productType) {
                case 'hoodie':
                  CardComponent = ProductCard;
                  cardProps.hoodie = productData as Hoodie;
                  break;
                case 'sweatpants':
                  CardComponent = SweatpantsCard;
                  cardProps.sweatpants = productData as Sweatpants;
                  break;
                case 'bracelet':
                  CardComponent = BraceletCard;
                  cardProps.bracelet = productData as Bracelet;
                  break;
                case 'matchingSet':
                  CardComponent = MatchingBraceletSetCard;
                  cardProps.set = productData as MatchingBraceletSet;
                  break;
                default:
                  return null;
              }

              return (
                <div key={rec.productId} className="flex flex-col">
                  <CardComponent {...cardProps} />
                  <div className="mt-3 p-3 bg-card rounded-b-lg shadow-md text-center">
                    <p className="text-sm font-semibold text-accent">Cœzii suggests:</p>
                    <p className="text-sm text-muted-foreground italic">"{rec.reason}"</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ProductDetailModal hoodie={selectedHoodie} isOpen={isHoodieModalOpen} onClose={closeModal} />
      <SweatpantsDetailModal sweatpants={selectedSweatpants} isOpen={isSweatpantsModalOpen} onClose={closeModal} />
      <BraceletDetailModal bracelet={selectedBracelet} isOpen={isBraceletModalOpen} onClose={closeModal} />
      <MatchingBraceletSetDetailModal set={selectedMatchingSet} isOpen={isMatchingSetModalOpen} onClose={closeModal} />
    </>
  );
}

