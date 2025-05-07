'use client';

import Image from 'next/image';
import type { Hoodie, ProductColor, ProductSize } from '@/types';
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
import { Package, ShieldCheck, Info } from 'lucide-react';
import React, { useState } from 'react';

interface ProductDetailModalProps {
  hoodie: Hoodie | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ hoodie, isOpen, onClose }: ProductDetailModalProps) {
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(hoodie?.colors[0] || null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(hoodie?.availableSizes[0] || null);

  React.useEffect(() => {
    if (hoodie) {
      setSelectedColor(hoodie.colors[0] || null);
      setSelectedSize(hoodie.availableSizes[0] || null);
    }
  }, [hoodie]);


  if (!hoodie) return null;

  const currentImage = selectedColor?.image || hoodie.images[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0">
        <ScrollArea className="max-h-[90vh]">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-6 flex flex-col">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-lg mb-4">
              <Image
                src={currentImage}
                alt={`${hoodie.name} - ${selectedColor?.name || ''}`}
                width={600}
                height={800}
                className="h-full w-full object-cover transition-all duration-300"
                data-ai-hint={`${selectedColor?.name.toLowerCase() || hoodie.colors[0].name.toLowerCase()} hoodie clothing detail`}
              />
            </div>
            {hoodie.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {hoodie.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      // Heuristic: if multiple images, assume they might show different colors or angles
                      // For now, clicking a thumbnail won't change selectedColor, only main image
                      // A more complex logic would map thumbnails to color variants
                      // For simplicity, we're just cycling main view.
                      // A better way is to have images associated with colors
                      const colorForImage = hoodie.colors[index % hoodie.colors.length];
                      if (colorForImage) setSelectedColor(colorForImage);
                    }}
                    className={`aspect-square rounded-md overflow-hidden border-2 ${
                      (selectedColor?.image || hoodie.images[0]) === img ? 'border-accent' : 'border-transparent'
                    } hover:border-accent/70 transition-colors`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      width={100}
                      height={133}
                      className="h-full w-full object-cover"
                      data-ai-hint="hoodie clothing thumbnail"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-4xl font-bold tracking-tight text-foreground">{hoodie.name}</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground pt-1">
                {hoodie.designs.map(d => d.name).join(', ')}
              </DialogDescription>
            </DialogHeader>
            
            <p className="mb-4 text-4xl font-extrabold text-accent">
              ${hoodie.price.toFixed(2)}
            </p>

            <div className="mb-6">
              <h4 className="mb-2 text-lg font-semibold text-foreground">Color:</h4>
              <div className="flex flex-wrap gap-2">
                {hoodie.colors.map((color) => (
                  <Button
                    key={color.value}
                    variant={selectedColor?.value === color.value ? 'default' : 'outline'}
                    size="sm" // Button size sm text will be text-sm from button.tsx
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${selectedColor?.value === color.value ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2' : 'hover:bg-muted/50'}`}
                    aria-pressed={selectedColor?.value === color.value}
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
              <h4 className="mb-2 text-lg font-semibold text-foreground">Size:</h4>
              <div className="flex flex-wrap gap-2">
                {hoodie.availableSizes.map((size) => (
                  <Button
                    key={size.value}
                    variant={selectedSize?.value === size.value ? 'default' : 'outline'}
                    size="sm" // Button size sm text will be text-sm from button.tsx
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-md px-4 py-2 transition-all ${selectedSize?.value === size.value ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2' : 'hover:bg-muted/50'}`}
                    aria-pressed={selectedSize?.value === size.value}
                  >
                    {size.name} ({size.value})
                  </Button>
                ))}
              </div>
            </div>
            
            <Separator className="my-6" />

            <div className="space-y-4 text-base text-foreground/90">
              <p>{hoodie.description}</p>
              
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-base">Materials</h5>
                  <p className="text-base text-muted-foreground">{hoodie.materials}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-base">Care Instructions</h5>
                  <p className="text-base text-muted-foreground">{hoodie.careInstructions}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-base">Origin</h5>
                  <p className="text-base text-muted-foreground">{hoodie.origin}</p>
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
                onClick={() => {
                  // Placeholder for Add to Cart functionality
                  alert(`Added ${hoodie.name} (${selectedColor?.name}, ${selectedSize?.name}) to cart! (Not really)`);
                  onClose();
                }}
              >
                Add to Cart
              </Button>
            </DialogFooter>
          </div>
        </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

