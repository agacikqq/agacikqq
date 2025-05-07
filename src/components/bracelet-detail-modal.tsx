
'use client';

import Image from 'next/image';
import type { Bracelet, Charm, BraceletCartItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Gem, Info } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/context/cart-context'; // Import useCart

interface BraceletDetailModalProps {
  bracelet: Bracelet | null;
  isOpen: boolean;
  onClose: () => void;
}

const INCLUDED_CHARMS_COUNT = 4;

export function BraceletDetailModal({ bracelet, isOpen, onClose }: BraceletDetailModalProps) {
  const { addItemToCart, editingItem, setEditingItem } = useCart();
  const [selectedCharms, setSelectedCharms] = useState<Charm[]>([]);
  const [currentImage, setCurrentImage] = useState<string>('');

  const isEditing = editingItem?.productType === 'bracelet' && editingItem?.productId === bracelet?.id;

  useEffect(() => {
    if (isOpen && bracelet) {
      if (isEditing && editingItem?.productType === 'bracelet') {
        const editBracelet = editingItem.item as BraceletCartItem;
        setSelectedCharms(editBracelet.selectedCharms);
        setCurrentImage(editBracelet.image || bracelet.images[0] || '');
      } else {
        setSelectedCharms([]); 
        setCurrentImage(bracelet.images[0] || '');
      }
    } else if (!isOpen) {
        if (isEditing) {
            setEditingItem(null);
        }
    }
  }, [bracelet, isOpen, isEditing, editingItem, setEditingItem]);

  const totalPrice = useMemo(() => {
    if (!bracelet) return 0;
    
    let charmsPrice = 0;
    if (selectedCharms.length > INCLUDED_CHARMS_COUNT) {
      const extraCharms = selectedCharms.slice(INCLUDED_CHARMS_COUNT);
      charmsPrice = extraCharms.reduce((sum, charm) => sum + charm.price, 0);
    }
    return bracelet.basePrice + charmsPrice;
  }, [bracelet, selectedCharms]);

  if (!bracelet) return null;

  const handleCharmToggle = (charm: Charm) => {
    setSelectedCharms(prev =>
      prev.find(c => c.id === charm.id)
        ? prev.filter(c => c.id !== charm.id)
        : [...prev, charm]
    );
  };

  const handleAddToCart = () => {
    const cartItemData: Omit<BraceletCartItem, 'cartItemId' | 'unitPrice' | 'quantity'> = {
      productId: bracelet.id,
      name: bracelet.name,
      image: currentImage || bracelet.images[0],
      productType: 'bracelet',
      baseBraceletPrice: bracelet.basePrice,
      selectedCharms,
    };
    addItemToCart(cartItemData);
    onClose();
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if(!open && isEditing) setEditingItem(null);
        onClose();
    }}>
      <DialogContent className="max-w-4xl p-0">
        <ScrollArea className="max-h-[90vh]">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="p-6 flex flex-col bg-card/30">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg mb-4 shadow-inner">
              <Image
                src={currentImage}
                alt={`${bracelet.name}`}
                width={600}
                height={750}
                className="h-full w-full object-cover transition-all duration-300"
                data-ai-hint={`${bracelet.materials.toLowerCase()} bracelet jewelry detail`}
              />
            </div>
            {bracelet.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {bracelet.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(img)}
                    className={`aspect-square rounded-md overflow-hidden border-2 ${
                      currentImage === img ? 'border-accent ring-2 ring-accent' : 'border-transparent'
                    } hover:border-accent/70 transition-colors`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      width={100}
                      height={125}
                      className="h-full w-full object-cover"
                      data-ai-hint="bracelet jewelry thumbnail"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-4xl font-bold tracking-tight text-foreground">{bracelet.name}</DialogTitle>
            </DialogHeader>
            
            <div className="mb-4 flex items-baseline gap-x-3">
              <span className="text-4xl font-extrabold text-accent">
                AED {totalPrice.toFixed(2)}
              </span>
              {selectedCharms.length > 0 && totalPrice !== bracelet.basePrice && (
                 <span className="text-xl text-muted-foreground">
                    (Base: AED {bracelet.basePrice.toFixed(2)})
                 </span>
              )}
            </div>

            <DialogDescription className="text-base text-muted-foreground mb-6">
                {bracelet.description}
            </DialogDescription>
            
            <div className="flex items-start gap-3 mb-6">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-semibold text-xl">Materials</h5>
                  <p className="text-lg text-muted-foreground">{bracelet.materials}</p>
                </div>
            </div>

            <Separator className="my-4" />

            {/* Charms Section */}
            {bracelet.availableCharms.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-1 text-xl font-semibold text-foreground flex items-center">
                    <Gem className="mr-2 h-5 w-5 text-primary" />
                    Customize with Charms
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  The first {INCLUDED_CHARMS_COUNT} selected charms are included in the bracelet price. Additional charms (if any) will be charged at their listed price.
                </p>
                <ScrollArea className="h-48 pr-3">
                  <div className="space-y-3">
                    {bracelet.availableCharms.map((charm) => (
                      <div key={charm.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={charm.image}
                            alt={charm.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                            data-ai-hint={`${charm.name.toLowerCase()} charm small`}
                          />
                          <div>
                            <Label htmlFor={`charm-${charm.id}`} className="text-base font-medium cursor-pointer">
                              {charm.name}
                            </Label>
                            {charm.description && <p className="text-sm text-muted-foreground">{charm.description}</p>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-base font-semibold text-accent">+AED {charm.price.toFixed(2)}</span>
                          <Checkbox
                            id={`charm-${charm.id}`}
                            checked={selectedCharms.some(c => c.id === charm.id)}
                            onCheckedChange={() => handleCharmToggle(charm)}
                            aria-label={`Select charm ${charm.name}, costs AED ${charm.price.toFixed(2)} extra`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
            {bracelet.availableCharms.length === 0 && (
                 <p className="text-muted-foreground text-center my-4">This bracelet cannot be customized with charms.</p>
            )}


            <DialogFooter className="mt-auto pt-6">
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Close
              </Button>
              <Button
                variant="default"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
                onClick={handleAddToCart}
              >
                {isEditing ? 'Update Item' : `Add to Cart`} - AED {totalPrice.toFixed(2)}
              </Button>
            </DialogFooter>
          </div>
        </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
