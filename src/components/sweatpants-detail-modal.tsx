
'use client';

import Image from 'next/image';
import type { Sweatpants, ProductColor, ProductSize, SweatpantsCartItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, ShieldCheck, Info, Percent } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { useCart } from '@/context/cart-context';

interface SweatpantsDetailModalProps {
  sweatpants: Sweatpants | null;
  isOpen: boolean;
  onClose: () => void; 
}

export function SweatpantsDetailModal({ sweatpants, isOpen, onClose }: SweatpantsDetailModalProps) {
  const { addItemToCart, editingItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');
  
  const amCurrentlyEditingThisItem = editingItem?.type === 'sweatpants' && editingItem.item?.productId === sweatpants?.id;

  useEffect(() => {
    if (isOpen && sweatpants) {
      if (amCurrentlyEditingThisItem && editingItem?.item) { // Check editingItem.item exists
        const editSweatpantsCartItem = editingItem.item as SweatpantsCartItem;
        setSelectedColor(editSweatpantsCartItem.selectedColor);
        setSelectedSize(editSweatpantsCartItem.selectedSize);
        setCurrentImage(editSweatpantsCartItem.selectedColor?.image || editSweatpantsCartItem.image || sweatpants.images[0]);
      } else {
        const initialColor = sweatpants.colors[0] || null;
        setSelectedColor(initialColor);
        setSelectedSize(sweatpants.availableSizes[0] || null);
        setCurrentImage(initialColor?.image || sweatpants.images[0]);
      }
    }
  }, [sweatpants, isOpen, editingItem, amCurrentlyEditingThisItem]);
  
  useEffect(() => {
    if (selectedColor && selectedColor.image) {
      setCurrentImage(selectedColor.image);
    } else if (sweatpants && sweatpants.images.length > 0 && (!selectedColor || !selectedColor.image)) {
      setCurrentImage(sweatpants.images[0]);
    }
  }, [selectedColor, sweatpants]);


  if (!sweatpants) return null;

  const isOnSale = sweatpants.originalPrice && sweatpants.originalPrice > sweatpants.price;
  const discountPercent = isOnSale ? Math.round(((sweatpants.originalPrice! - sweatpants.price) / sweatpants.originalPrice!) * 100) : 0;


  const handleAddToCartOrUpdate = () => {
    if (!selectedColor || !selectedSize) {
        toast({
            title: "Selection Missing",
            description: "Please select a color and size.",
            variant: "destructive",
        });
        return;
    }
    const cartItemData: Omit<SweatpantsCartItem, 'cartItemId' | 'unitPrice' | 'quantity'> = {
      productId: sweatpants.id,
      name: sweatpants.name,
      image: selectedColor.image || currentImage || sweatpants.images[0],
      productType: 'sweatpants',
      selectedColor,
      selectedSize,
    };
    
    addItemToCart(cartItemData); 
    onClose(); 
  };

  const handleInternalClose = (open: boolean) => {
      if (!open) {
          onClose(); 
      }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleInternalClose}> 
      <DialogContent className="max-w-3xl p-0">
        <ScrollArea className="max-h-[90vh]">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-6 flex flex-col bg-card/30"> 
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg mb-4 shadow-inner"> 
              <Image
                src={currentImage}
                alt={`${sweatpants.name} - ${selectedColor?.name || ''}`}
                width={600}
                height={800}
                className="h-full w-full object-cover transition-all duration-300"
                data-ai-hint={`${selectedColor?.name.toLowerCase() || sweatpants.colors[0].name.toLowerCase()} sweatpants clothing detail`}
              />
               {isOnSale && (
                <Badge variant="destructive" className="absolute top-3 right-3 z-10 text-lg px-3 py-1 shadow-md">
                  <Percent className="mr-1 h-5 w-5" />
                  {discountPercent}% OFF
                </Badge>
              )}
            </div>
            {sweatpants.colors.filter(c => c.image).length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {sweatpants.colors.filter(c => c.image).map((colorOption) => (
                  <button
                    key={colorOption.value}
                    onClick={() => setSelectedColor(colorOption)}
                    className={`aspect-square rounded-md overflow-hidden border-2 ${
                      selectedColor?.value === colorOption.value ? 'border-accent ring-2 ring-accent' : 'border-transparent'
                    } hover:border-accent/70 transition-colors`}
                    aria-label={`View ${colorOption.name}`}
                  >
                    <Image
                      src={colorOption.image!}
                      alt={`Thumbnail ${colorOption.name}`}
                      width={100}
                      height={133}
                      className="h-full w-full object-cover"
                      data-ai-hint="sweatpants clothing thumbnail"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col"> 
            <DialogHeader className="mb-4">
              <DialogTitle className="text-4xl font-bold tracking-tight text-foreground">{sweatpants.name}</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground pt-1">
                {sweatpants.designs.map(d => d.name).join(', ')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mb-4 flex items-baseline gap-x-3">
              <span className="text-4xl font-extrabold text-accent">
                AED {sweatpants.price.toFixed(2)}
              </span>
              {isOnSale && sweatpants.originalPrice && (
                <span className="text-2xl text-muted-foreground line-through">
                  AED {sweatpants.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="mb-6">
              <h4 className="mb-2 text-lg font-semibold text-foreground">Color: {selectedColor?.name || 'Select a color'}</h4>
              <div className="flex flex-wrap gap-2">
                {sweatpants.colors.map((color) => (
                  <Button
                    key={color.value}
                    variant={selectedColor?.value === color.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${selectedColor?.value === color.value ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2' : 'hover:bg-muted/50'}`}
                    aria-pressed={selectedColor?.value === color.value}
                    aria-label={`Select color ${color.name}`}
                  >
                    <span
                      className="inline-block h-4 w-4 rounded-full border border-border"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />
                    {color.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="mb-2 text-lg font-semibold text-foreground">Size: {selectedSize?.name || 'Select a size'}</h4>
              <div className="flex flex-wrap gap-2">
                {sweatpants.availableSizes.map((size) => (
                  <Button
                    key={size.value}
                    variant={selectedSize?.value === size.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-md px-4 py-2 transition-all ${selectedSize?.value === size.value ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2' : 'hover:bg-muted/50'}`}
                    aria-pressed={selectedSize?.value === size.value}
                    aria-label={`Select size ${size.name} (${size.value})`}
                  >
                    {size.name} ({size.value})
                  </Button>
                ))}
              </div>
            </div>
            
            <Separator className="my-6" />

            <div className="space-y-4 text-lg text-foreground/90">
              <p>{sweatpants.description}</p>
              
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-semibold text-xl">Materials</h5>
                  <p className="text-lg text-muted-foreground">{sweatpants.materials}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-semibold text-xl">Care Instructions</h5>
                  <p className="text-lg text-muted-foreground">{sweatpants.careInstructions}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-semibold text-xl">Origin</h5>
                  <p className="text-lg text-muted-foreground">{sweatpants.origin}</p>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-auto pt-6">
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto"> 
                Close
              </Button>
              <Button
                variant="default"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
                onClick={handleAddToCartOrUpdate}
                disabled={!selectedColor || !selectedSize}
              >
                {amCurrentlyEditingThisItem ? 'Update Item' : 'Add to Cart'} 
              </Button>
            </DialogFooter>
          </div>
        </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

