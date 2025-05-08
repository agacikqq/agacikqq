
'use client';

import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import type { CartItem, HoodieCartItem, BraceletCartItem, MatchingSetCartItem, SweatpantsCartItem, Hoodie, Bracelet, MatchingBraceletSet, Sweatpants, Charm } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { X, Trash2, Edit3, MinusCircle, PlusCircle, ShoppingBag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const INCLUDED_CHARMS_COUNT = 4;
const INCLUDED_CHARMS_PER_BRACELET_IN_SET = 4;

export function CartSidebar() {
  const {
    items,
    removeItemFromCart,
    updateItemQuantity,
    clearCart,
    cartTotal,
    cartCount,
    isCartOpen,
    closeCart,
    setEditingItem,
    getOriginalProductForEditing,
  } = useCart();

  const handleEditItem = (item: CartItem) => {
    const originalProduct = getOriginalProductForEditing(item);
    if (!originalProduct) {
      toast({ title: "Error", description: "Could not find original product data to edit.", variant: "destructive"});
      return;
    }

    switch (item.productType) {
      case 'hoodie':
        setEditingItem({ type: 'hoodie', item: item as HoodieCartItem });
        break;
      case 'sweatpants':
        setEditingItem({ type: 'sweatpants', item: item as SweatpantsCartItem });
        break;
      case 'bracelet':
        setEditingItem({ type: 'bracelet', item: item as BraceletCartItem, originalBracelet: originalProduct as Bracelet });
        break;
      case 'matchingSet':
        setEditingItem({ type: 'matchingSet', item: item as MatchingSetCartItem, originalSet: originalProduct as MatchingBraceletSet });
        break;
    }
    closeCart(); 
  };
  
  const renderCharmList = (charms: Charm[], includedCount: number, basePrice: number) => {
    if (!charms || charms.length === 0) return <p className="text-xs text-muted-foreground">No charms selected.</p>;

    const includedCharms = charms.slice(0, includedCount);
    const extraCharms = charms.slice(includedCount);

    return (
        <ul className="text-xs list-disc list-inside pl-1 text-muted-foreground">
            {includedCharms.map(charm => <li key={charm.id}>{charm.name} (Included)</li>)}
            {extraCharms.map(charm => <li key={charm.id}>{charm.name} (+AED {charm.price.toFixed(2)})</li>)}
        </ul>
    );
  };


  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-4 pt-6 pb-2">
          <SheetTitle className="flex items-center justify-between">
            <span className="text-2xl">Your Cart ({cartCount})</span>
            <SheetClose asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close cart</span>
                </Button>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>
        <Separator />

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6">
            <ShoppingBag className="h-24 w-24 text-muted-foreground/50 mb-6" />
            <h3 className="text-2xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-center">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex items-start space-x-4 p-4 border rounded-lg shadow-sm bg-card">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={item.productType === 'hoodie' || item.productType === 'sweatpants' ? 107 : 80} 
                      className="rounded-md object-cover aspect-[3/4] sm:aspect-square"
                      data-ai-hint={`${item.name} cart image`}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-semibold">{item.name}</h4>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeItemFromCart(item.cartItemId)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">Unit Price: AED {item.unitPrice.toFixed(2)}</p>
                      
                      {item.productType === 'hoodie' && (
                        <p className="text-xs text-muted-foreground">
                          Color: {(item as HoodieCartItem).selectedColor.name}, Size: {(item as HoodieCartItem).selectedSize.name}
                        </p>
                      )}
                      {item.productType === 'sweatpants' && (
                        <p className="text-xs text-muted-foreground">
                          Color: {(item as SweatpantsCartItem).selectedColor.name}, Size: {(item as SweatpantsCartItem).selectedSize.name}
                        </p>
                      )}

                      {item.productType === 'bracelet' && (
                        <div className="mt-1">
                           <p className="text-xs font-medium">Charms:</p>
                           {renderCharmList((item as BraceletCartItem).selectedCharms, INCLUDED_CHARMS_COUNT, (item as BraceletCartItem).baseBraceletPrice)}
                        </div>
                      )}

                      {item.productType === 'matchingSet' && (
                        <div className="mt-1 space-y-1">
                          {(item as MatchingSetCartItem).braceletsCustomization.map(bc => (
                            <div key={bc.braceletId}>
                              <p className="text-xs font-medium">{bc.braceletName} Charms:</p>
                              {renderCharmList(bc.selectedCharms, INCLUDED_CHARMS_PER_BRACELET_IN_SET, 0 /* Base price handled by set */)}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateItemQuantity(item.cartItemId, item.quantity - 1)} disabled={item.quantity <= 1}>
                            <MinusCircle className="h-4 w-4" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                                const newQuantity = parseInt(e.target.value, 10);
                                if (!isNaN(newQuantity) && newQuantity > 0) {
                                    updateItemQuantity(item.cartItemId, newQuantity);
                                } else if (e.target.value === '') {
                                    // Allow clearing input, handle validation on blur or submit
                                }
                            }}
                            onBlur={(e) => {
                                const newQuantity = parseInt(e.target.value, 10);
                                if (isNaN(newQuantity) || newQuantity <= 0) {
                                    updateItemQuantity(item.cartItemId, 1); // Reset to 1 if invalid
                                }
                            }}
                            className="h-7 w-12 text-center px-1"
                            aria-label="Item quantity"
                          />
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateItemQuantity(item.cartItemId, item.quantity + 1)}>
                            <PlusCircle className="h-4 w-4" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEditItem(item)}>
                          <Edit3 className="mr-1 h-3 w-3" /> Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="px-4 py-4 border-t">
              <div className="w-full space-y-3">
                <div className="flex justify-between text-xl font-semibold">
                  <span>Subtotal:</span>
                  <span>AED {cartTotal.toFixed(2)}</span>
                </div>
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Proceed to Checkout
                </Button>
                <Button variant="outline" size="lg" className="w-full" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

