
'use client';

import Image from 'next/image';
import type { MatchingBraceletSet, SimpleBraceletInfo } from '@/types';
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
import { Users, Info, Percent } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface MatchingBraceletSetDetailModalProps {
  set: MatchingBraceletSet | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MatchingBraceletSetDetailModal({ set, isOpen, onClose }: MatchingBraceletSetDetailModalProps) {
  const [currentMainImage, setCurrentMainImage] = useState<string>('');

  useEffect(() => {
    if (set) {
      setCurrentMainImage(set.images[0] || '');
    }
  }, [set]);

  if (!set) return null;

  const isOnSale = set.originalSetPrice && set.originalSetPrice > set.setPrice;
  const discountPercent = isOnSale ? Math.round(((set.originalSetPrice! - set.setPrice) / set.originalSetPrice!) * 100) : 0;

  const handleAddToCart = () => {
    toast({
        title: "Set Added to Cart! (Simulated)",
        description: `${set.name} for AED ${set.setPrice.toFixed(2)}`,
        variant: "default",
      });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <ScrollArea className="max-h-[90vh]">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="p-6 flex flex-col bg-card/30">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg mb-4 shadow-inner">
              <Image
                src={currentMainImage}
                alt={`${set.name}`}
                width={600}
                height={600}
                className="h-full w-full object-cover transition-all duration-300"
                data-ai-hint={`${set.bracelets.map(b => b.materials.split(',')[0].trim().toLowerCase()).join(' ')} matching detail`}
              />
              {isOnSale && (
                <Badge variant="destructive" className="absolute top-3 right-3 z-10 text-lg px-3 py-1 shadow-md">
                  <Percent className="mr-1 h-5 w-5" />
                  {discountPercent}% OFF
                </Badge>
              )}
            </div>
            {set.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {set.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMainImage(img)}
                    className={`aspect-square rounded-md overflow-hidden border-2 ${
                      currentMainImage === img ? 'border-accent ring-2 ring-accent' : 'border-transparent'
                    } hover:border-accent/70 transition-colors`}
                    aria-label={`View image ${index + 1} for ${set.name}`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1} for ${set.name}`}
                      width={100}
                      height={100}
                      className="h-full w-full object-cover"
                       data-ai-hint="matching bracelet thumbnail"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-4xl font-bold tracking-tight text-foreground">{set.name}</DialogTitle>
            </DialogHeader>
            
            <div className="mb-4 flex items-baseline gap-x-3">
              <span className="text-4xl font-extrabold text-accent">
                AED {set.setPrice.toFixed(2)}
              </span>
              {isOnSale && set.originalSetPrice && (
                <span className="text-2xl text-muted-foreground line-through">
                  AED {set.originalSetPrice.toFixed(2)}
                </span>
              )}
            </div>

            <DialogDescription className="text-base text-muted-foreground mb-6">
                {set.description}
            </DialogDescription>
            
            <Separator className="my-4" />

            {/* Individual Bracelets in Set */}
            <div className="mb-6">
                <h4 className="mb-3 text-xl font-semibold text-foreground flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Bracelets in this Set ({set.bracelets.length})
                </h4>
                <div className="space-y-4">
                    {set.bracelets.map((braceletInfo: SimpleBraceletInfo) => (
                        <div key={braceletInfo.id} className="flex items-start gap-4 p-3 border rounded-md bg-muted/20">
                            <Image
                                src={braceletInfo.image}
                                alt={braceletInfo.name}
                                width={80}
                                height={80}
                                className="rounded-md object-cover aspect-square"
                                data-ai-hint={`${braceletInfo.materials.toLowerCase()} bracelet small`}
                            />
                            <div>
                                <h5 className="text-lg font-semibold text-foreground">{braceletInfo.name}</h5>
                                {braceletInfo.description && <p className="text-sm text-muted-foreground mt-1">{braceletInfo.description}</p>}
                                <div className="flex items-start gap-2 mt-2">
                                    <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground/80">Materials:</span> {braceletInfo.materials}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <DialogFooter className="mt-auto pt-6">
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Close
              </Button>
              <Button
                variant="default"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
                onClick={handleAddToCart}
              >
                Add Set to Cart - AED {set.setPrice.toFixed(2)}
              </Button>
            </DialogFooter>
          </div>
        </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
