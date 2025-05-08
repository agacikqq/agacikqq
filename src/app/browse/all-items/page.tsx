
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { SweatpantsCard } from '@/components/sweatpants-card';
import { BraceletCard } from '@/components/bracelet-card';
import { MatchingBraceletSetCard } from '@/components/matching-bracelet-set-card';
import { ProductDetailModal } from '@/components/product-detail-modal';
import { SweatpantsDetailModal } from '@/components/sweatpants-detail-modal';
import { BraceletDetailModal } from '@/components/bracelet-detail-modal';
import { MatchingBraceletSetDetailModal } from '@/components/matching-bracelet-set-detail-modal';

import { mockHoodies } from '@/data/mock-hoodies';
import { mockSweatpants } from '@/data/mock-sweatpants';
import { mockBracelets } from '@/data/mock-bracelets';
import { mockMatchingBracelets } from '@/data/mock-matching-bracelets';

import type { Hoodie, Sweatpants, Bracelet, MatchingBraceletSet, HoodieCartItem, SweatpantsCartItem, BraceletCartItem, MatchingSetCartItem } from '@/types';
import { useCart } from '@/context/cart-context';
import { toast } from '@/hooks/use-toast';
import { Boxes } from 'lucide-react';

type DisplayableProduct = 
  | (Hoodie & { productType: 'hoodie' })
  | (Sweatpants & { productType: 'sweatpants' })
  | (Bracelet & { productType: 'bracelet' })
  | (MatchingBraceletSet & { productType: 'matchingSet' });

export default function AllItemsPage() {
  const { editingItem, setEditingItem, getOriginalProductForEditing } = useCart();
  const [hasMounted, setHasMounted] = useState(false);

  const [selectedHoodie, setSelectedHoodie] = useState<Hoodie | null>(null);
  const [isHoodieModalOpen, setIsHoodieModalOpen] = useState(false);

  const [selectedSweatpants, setSelectedSweatpants] = useState<Sweatpants | null>(null);
  const [isSweatpantsModalOpen, setIsSweatpantsModalOpen] = useState(false);

  const [selectedBracelet, setSelectedBracelet] = useState<Bracelet | null>(null);
  const [isBraceletModalOpen, setIsBraceletModalOpen] = useState(false);

  const [selectedMatchingSet, setSelectedMatchingSet] = useState<MatchingBraceletSet | null>(null);
  const [isMatchingSetModalOpen, setIsMatchingSetModalOpen] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const allDisplayProducts = useMemo((): DisplayableProduct[] => {
    const products: DisplayableProduct[] = [
      ...mockHoodies.map(item => ({ ...item, productType: 'hoodie' as const })),
      ...mockSweatpants.map(item => ({ ...item, productType: 'sweatpants' as const })),
      ...mockBracelets.map(item => ({ ...item, productType: 'bracelet' as const })),
      ...mockMatchingBracelets.map(item => ({ ...item, productType: 'matchingSet' as const })),
    ];
    // Simple shuffle for variety, could be sorted or made more deterministic
    return products.sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    if (editingItem) {
      const { type, item: cartItemBeingEdited } = editingItem;
      
      const productToEdit = allDisplayProducts.find(p => p.id === cartItemBeingEdited.productId && p.productType === type);

      if (productToEdit) {
        switch (type) {
          case 'hoodie':
            setSelectedHoodie(productToEdit as Hoodie);
            setIsHoodieModalOpen(true);
            break;
          case 'sweatpants':
            setSelectedSweatpants(productToEdit as Sweatpants);
            setIsSweatpantsModalOpen(true);
            break;
          case 'bracelet':
             if (editingItem.type === 'bracelet' && editingItem.originalBracelet) {
                 setSelectedBracelet(editingItem.originalBracelet);
                 setIsBraceletModalOpen(true);
            } else { // Fallback if originalBracelet wasn't directly on editingItem state (shouldn't happen with current logic)
                 const original = getOriginalProductForEditing(cartItemBeingEdited) as Bracelet | undefined;
                 if(original){
                    setSelectedBracelet(original);
                    setIsBraceletModalOpen(true);
                 } else {
                    toast({ title: "Error", description: "Could not find bracelet details to edit.", variant: "destructive" });
                    setEditingItem(null);
                 }
            }
            break;
          case 'matchingSet':
            if (editingItem.type === 'matchingSet' && editingItem.originalSet) {
                 setSelectedMatchingSet(editingItem.originalSet);
                 setIsMatchingSetModalOpen(true);
            } else {
                 const original = getOriginalProductForEditing(cartItemBeingEdited) as MatchingBraceletSet | undefined;
                 if(original){
                    setSelectedMatchingSet(original);
                    setIsMatchingSetModalOpen(true);
                 } else {
                    toast({ title: "Error", description: "Could not find matching set details to edit.", variant: "destructive" });
                    setEditingItem(null);
                 }
            }
            break;
          default:
            // This case should ideally not be reached if type checks are exhaustive
            toast({ title: "Error", description: "Cannot edit this item type from this consolidated page.", variant: "destructive"});
            setEditingItem(null); 
        }
      } else if (cartItemBeingEdited?.productId) {
        toast({
          title: "Edit Not Available Here",
          description: "This item might not be part of the current product listings or its details cannot be edited from this view.",
          variant: "default",
        });
        setEditingItem(null);
      }
    }
  }, [editingItem, setEditingItem, allDisplayProducts, getOriginalProductForEditing]);


  const handleViewHoodieDetails = (hoodie: Hoodie) => {
    if (editingItem) setEditingItem(null);
    setSelectedHoodie(hoodie);
    setIsHoodieModalOpen(true);
  };
  const handleCloseHoodieModal = () => {
    setIsHoodieModalOpen(false);
    setSelectedHoodie(null);
    if (editingItem?.type === 'hoodie') setEditingItem(null);
  };

  const handleViewSweatpantsDetails = (sweatpants: Sweatpants) => {
    if (editingItem) setEditingItem(null);
    setSelectedSweatpants(sweatpants);
    setIsSweatpantsModalOpen(true);
  };
  const handleCloseSweatpantsModal = () => {
    setIsSweatpantsModalOpen(false);
    setSelectedSweatpants(null);
    if (editingItem?.type === 'sweatpants') setEditingItem(null);
  };
  
  const handleViewBraceletDetails = (bracelet: Bracelet) => {
    if (editingItem) setEditingItem(null);
    setSelectedBracelet(bracelet);
    setIsBraceletModalOpen(true);
  };
  const handleCloseBraceletModal = () => {
    setIsBraceletModalOpen(false);
    setSelectedBracelet(null);
    if (editingItem?.type === 'bracelet') setEditingItem(null);
  };

  const handleViewMatchingSetDetails = (set: MatchingBraceletSet) => {
    if (editingItem) setEditingItem(null);
    setSelectedMatchingSet(set);
    setIsMatchingSetModalOpen(true);
  };
  const handleCloseMatchingSetModal = () => {
    setIsMatchingSetModalOpen(false);
    setSelectedMatchingSet(null);
    if (editingItem?.type === 'matchingSet') setEditingItem(null);
  };

  if (!hasMounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow container mx-auto p-4 text-center">
          <p className="text-3xl font-semibold text-primary animate-pulse">Loading All Coezii Productz...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8 bg-transparent">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold text-primary mb-3 flex items-center justify-center gap-3">
              <Boxes className="h-12 w-12 text-accent animate-pulse" />
              All Our Cœzii Productz
            </h1>
            <p className="text-xl text-muted-foreground">
              Browse everything cœzii has to offer, all in one place!
            </p>
          </div>

          {allDisplayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allDisplayProducts.map((product) => {
                switch (product.productType) {
                  case 'hoodie':
                    return <ProductCard key={`hoodie-${product.id}`} hoodie={product} onViewDetailsClick={handleViewHoodieDetails} />;
                  case 'sweatpants':
                    return <SweatpantsCard key={`sweatpants-${product.id}`} sweatpants={product} onViewDetailsClick={handleViewSweatpantsDetails} />;
                  case 'bracelet':
                    return <BraceletCard key={`bracelet-${product.id}`} bracelet={product} onViewDetailsClick={handleViewBraceletDetails} />;
                  case 'matchingSet':
                    return <MatchingBraceletSetCard key={`set-${product.id}`} set={product} onViewDetailsClick={handleViewMatchingSetDetails} />;
                  default:
                    return null;
                }
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Boxes className="h-24 w-24 text-muted-foreground/50 mx-auto mb-6" />
              <h2 className="text-3xl font-semibold mb-2 text-foreground">No Productz Available</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our collections are currently empty. Please check back soon!
              </p>
            </div>
          )}
        </div>
      </main>
      
      <ProductDetailModal hoodie={selectedHoodie} isOpen={isHoodieModalOpen} onClose={handleCloseHoodieModal} />
      <SweatpantsDetailModal sweatpants={selectedSweatpants} isOpen={isSweatpantsModalOpen} onClose={handleCloseSweatpantsModal} />
      <BraceletDetailModal bracelet={selectedBracelet} isOpen={isBraceletModalOpen} onClose={handleCloseBraceletModal} />
      <MatchingBraceletSetDetailModal set={selectedMatchingSet} isOpen={isMatchingSetModalOpen} onClose={handleCloseMatchingSetModal} />
      
      <Footer />
    </div>
  );
}
