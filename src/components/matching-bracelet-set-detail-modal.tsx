
'use client';

import Image from 'next/image';
import type { MatchingBraceletSet, Bracelet, Charm, MatchingSetCartItem, BraceletCustomization } from '@/types';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Users, Info, Percent, Gem, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/context/cart-context'; // Import useCart

interface MatchingBraceletSetDetailModalProps {
  set: MatchingBraceletSet | null;
  isOpen: boolean;
  onClose: () => void;
}

const INCLUDED_CHARMS_PER_BRACELET_IN_SET = 4;

export function MatchingBraceletSetDetailModal({ set, isOpen, onClose }: MatchingBraceletSetDetailModalProps) {
  const { addItemToCart, editingItem, setEditingItem } = useCart();
  const [currentMainImage, setCurrentMainImage] = useState<string>('');
  const [activeCustomizingBraceletId, setActiveCustomizingBraceletId] = useState<string | null>(null);
  const [braceletCustomizations, setBraceletCustomizations] = useState<Record<string, { selectedCharms: Charm[] }>>({});

  const isEditing = editingItem?.productType === 'matchingSet' && editingItem?.productId === set?.id;

  useEffect(() => {
    if (isOpen && set) {
      if (isEditing && editingItem?.productType === 'matchingSet') {
        const editSet = editingItem.item as MatchingSetCartItem;
        const initialCustomizations: Record<string, { selectedCharms: Charm[] }> = {};
        editSet.braceletsCustomization.forEach(bc => {
          initialCustomizations[bc.braceletId] = { selectedCharms: bc.selectedCharms };
        });
        setBraceletCustomizations(initialCustomizations);
        setCurrentMainImage(editSet.image || set.images[0] || '');
      } else {
        const initialCustomizations: Record<string, { selectedCharms: Charm[] }> = {};
        set.bracelets.forEach(b => {
          initialCustomizations[b.id] = { selectedCharms: [] };
        });
        setBraceletCustomizations(initialCustomizations);
        setCurrentMainImage(set.images[0] || '');
      }
      setActiveCustomizingBraceletId(null);
    } else if (!isOpen) {
      if (isEditing) {
        setEditingItem(null);
      }
      // Reset customizations when modal is closed and not editing or if set changes
      setBraceletCustomizations({});
      setActiveCustomizingBraceletId(null);
    }
  }, [set, isOpen, isEditing, editingItem, setEditingItem]);

  const totalSetPrice = useMemo(() => {
    if (!set) return 0;
    let currentTotal = set.setPrice;

    set.bracelets.forEach(bracelet => {
      const customization = braceletCustomizations[bracelet.id];
      if (customization && customization.selectedCharms.length > INCLUDED_CHARMS_PER_BRACELET_IN_SET) {
        const extraCharms = customization.selectedCharms.slice(INCLUDED_CHARMS_PER_BRACELET_IN_SET);
        const additionalCost = extraCharms.reduce((sum, charm) => sum + charm.price, 0);
        currentTotal += additionalCost;
      }
    });
    return currentTotal;
  }, [set, braceletCustomizations]);

  if (!set) return null;

  const isOnSale = set.originalSetPrice && set.originalSetPrice > set.setPrice;
  const discountPercent = isOnSale ? Math.round(((set.originalSetPrice! - set.setPrice) / set.originalSetPrice!) * 100) : 0;

  const handleCharmToggleForSetBracelet = (braceletId: string, charm: Charm) => {
    setBraceletCustomizations(prev => {
      const currentSelected = prev[braceletId]?.selectedCharms || [];
      const newSelected = currentSelected.find(c => c.id === charm.id)
        ? currentSelected.filter(c => c.id !== charm.id)
        : [...currentSelected, charm];
      return {
        ...prev,
        [braceletId]: { selectedCharms: newSelected },
      };
    });
  };

  const handleAddToCart = () => {
    const currentBraceletsCustomization: BraceletCustomization[] = set.bracelets.map(bracelet => ({
      braceletId: bracelet.id,
      braceletName: bracelet.name,
      selectedCharms: braceletCustomizations[bracelet.id]?.selectedCharms || [],
    }));

    const cartItemData: Omit<MatchingSetCartItem, 'cartItemId' | 'unitPrice' | 'quantity'> = {
      productId: set.id,
      name: set.name,
      image: currentMainImage || set.images[0],
      productType: 'matchingSet',
      setBasePrice: set.setPrice,
      braceletsCustomization: currentBraceletsCustomization,
    };
    addItemToCart(cartItemData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open && isEditing) setEditingItem(null);
        onClose();
    }}>
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
                AED {totalSetPrice.toFixed(2)}
              </span>
              {isOnSale && set.originalSetPrice && (
                <span className="text-2xl text-muted-foreground line-through">
                  AED {set.originalSetPrice.toFixed(2)}
                </span>
              )}
               {(totalSetPrice !== set.setPrice) && (
                 <span className="text-xl text-muted-foreground">
                    (Set Base: AED {set.setPrice.toFixed(2)})
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
                    {set.bracelets.map((bracelet: Bracelet) => (
                        <div key={bracelet.id} className="p-4 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <Image
                                    src={bracelet.images[0]}
                                    alt={bracelet.name}
                                    width={80}
                                    height={80}
                                    className="rounded-md object-cover aspect-square border"
                                    data-ai-hint={`${bracelet.materials.toLowerCase()} bracelet small`}
                                />
                                <div className="flex-grow">
                                    <h5 className="text-lg font-semibold text-foreground">{bracelet.name}</h5>
                                    {bracelet.description && <p className="text-sm text-muted-foreground mt-1">{bracelet.description}</p>}
                                    <div className="flex items-start gap-2 mt-2">
                                        <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground/80">Materials:</span> {bracelet.materials}</p>
                                    </div>
                                </div>
                            </div>

                            {bracelet.availableCharms && bracelet.availableCharms.length > 0 && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setActiveCustomizingBraceletId(activeCustomizingBraceletId === bracelet.id ? null : bracelet.id)} 
                                className="mt-3 w-full"
                              >
                                {activeCustomizingBraceletId === bracelet.id ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                                {activeCustomizingBraceletId === bracelet.id ? 'Hide Charms' : `Customize Charms for ${bracelet.name}`}
                              </Button>
                            )}
                             {bracelet.availableCharms.length === 0 && (
                                 <p className="text-sm text-muted-foreground mt-3 text-center">Not customizable with additional charms.</p>
                             )}


                            {activeCustomizingBraceletId === bracelet.id && bracelet.availableCharms.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-border">
                                <h5 className="mb-1 text-md font-semibold text-foreground flex items-center">
                                    <Gem className="mr-2 h-5 w-5 text-primary" />
                                    Select Charms for {bracelet.name}
                                </h5>
                                <p className="text-xs text-muted-foreground mb-3">
                                  First {INCLUDED_CHARMS_PER_BRACELET_IN_SET} selected charms are included for this bracelet. Additional charms will add to the total set price.
                                </p>
                                <ScrollArea className="h-40 pr-3 border rounded-md p-2 bg-background/50">
                                  <div className="space-y-2">
                                    {bracelet.availableCharms.map((charm) => (
                                      <div key={charm.id} className="flex items-center justify-between p-2.5 border rounded-md hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center space-x-2.5">
                                          <Image
                                            src={charm.image}
                                            alt={charm.name}
                                            width={32}
                                            height={32}
                                            className="rounded-md object-cover"
                                            data-ai-hint={`${charm.name.toLowerCase()} charm tiny`}
                                          />
                                          <div>
                                            <Label htmlFor={`set-charm-${bracelet.id}-${charm.id}`} className="text-sm font-medium cursor-pointer">
                                              {charm.name}
                                            </Label>
                                            {charm.description && <p className="text-xs text-muted-foreground">{charm.description}</p>}
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2.5">
                                          <span className="text-sm font-semibold text-accent">+AED {charm.price.toFixed(2)}</span>
                                          <Checkbox
                                            id={`set-charm-${bracelet.id}-${charm.id}`}
                                            checked={braceletCustomizations[bracelet.id]?.selectedCharms.some(c => c.id === charm.id)}
                                            onCheckedChange={() => handleCharmToggleForSetBracelet(bracelet.id, charm)}
                                            aria-label={`Select charm ${charm.name} for ${bracelet.name}`}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </div>
                            )}
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
                {isEditing ? 'Update Set' : 'Add Set to Cart'} - AED {totalSetPrice.toFixed(2)}
              </Button>
            </DialogFooter>
          </div>
        </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
