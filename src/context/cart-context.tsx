
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartItem, HoodieCartItem, BraceletCartItem, MatchingSetCartItem, SweatpantsCartItem, Hoodie, ProductColor, ProductSize, Bracelet, Charm, MatchingBraceletSet, EditingItemState, BraceletCustomization, Sweatpants } from '@/types';
import { toast } from '@/hooks/use-toast';
import { mockBracelets } from '@/data/mock-bracelets';
import { mockMatchingBracelets } from '@/data/mock-matching-bracelets';
import { mockHoodies } from '@/data/mock-hoodies';
import { mockSweatpants } from '@/data/mock-sweatpants';


const INCLUDED_CHARMS_COUNT = 4; 
const INCLUDED_CHARMS_PER_BRACELET_IN_SET = 4; 

interface CartContextType {
  items: CartItem[];
  addItemToCart: (itemData: Omit<CartItem, 'cartItemId' | 'unitPrice' | 'quantity'>) => void;
  removeItemFromCart: (cartItemId: string) => void;
  updateItemQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  editingItem: EditingItemState;
  setEditingItem: React.Dispatch<React.SetStateAction<EditingItemState>>;
  getOriginalProductForEditing: (cartItem: CartItem) => Hoodie | Bracelet | MatchingBraceletSet | Sweatpants | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const generateCartItemId = (productId: string, options: any): string => {
  // Sort options by key to ensure consistent ID generation
  const sortedOptions = Object.entries(options)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .reduce((obj, [key, value]) => {
      (obj as any)[key] = value;
      return obj;
    }, {});
  const optionsString = JSON.stringify(sortedOptions);
  // Use a simple hash or just base64 encode for mock purposes
  // For production, a more robust hashing (like SHA-256) might be considered if IDs need to be very collision-resistant
  // and not easily reversible, but for client-side mock, base64 is fine.
  if (typeof window !== "undefined" && typeof window.btoa === 'function') {
    return `${productId}-${window.btoa(optionsString)}`;
  }
  // Fallback for environments where btoa might not be available (e.g., some SSR pre-computation if not careful)
  return `${productId}-${Buffer.from(optionsString).toString('base64')}`;
};


const calculateUnitPrice = (itemData: Omit<CartItem, 'cartItemId' | 'unitPrice' | 'quantity'>): number => {
  switch (itemData.productType) {
    case 'hoodie':
      return (itemData as Omit<HoodieCartItem, 'cartItemId' | 'unitPrice' | 'quantity'>).productId
          ? mockHoodies.find(h => h.id === itemData.productId)?.price || 0
          : 0;
    case 'sweatpants':
      return (itemData as Omit<SweatpantsCartItem, 'cartItemId' | 'unitPrice' | 'quantity'>).productId
          ? mockSweatpants.find(s => s.id === itemData.productId)?.price || 0
          : 0;
    case 'bracelet': {
      const braceletData = itemData as Omit<BraceletCartItem, 'cartItemId' | 'unitPrice' | 'quantity'>;
      let charmsPrice = 0;
      if (braceletData.selectedCharms.length > INCLUDED_CHARMS_COUNT) {
        const extraCharms = braceletData.selectedCharms.slice(INCLUDED_CHARMS_COUNT);
        charmsPrice = extraCharms.reduce((sum, charm) => sum + charm.price, 0);
      }
      return braceletData.baseBraceletPrice + charmsPrice;
    }
    case 'matchingSet': {
      const setData = itemData as Omit<MatchingSetCartItem, 'cartItemId' | 'unitPrice' | 'quantity'>;
      let totalExtraCharmsPrice = 0;
      setData.braceletsCustomization.forEach(customization => {
        if (customization.selectedCharms.length > INCLUDED_CHARMS_PER_BRACELET_IN_SET) {
          const extraCharms = customization.selectedCharms.slice(INCLUDED_CHARMS_PER_BRACELET_IN_SET);
          totalExtraCharmsPrice += extraCharms.reduce((sum, charm) => sum + charm.price, 0);
        }
      });
      return setData.setBasePrice + totalExtraCharmsPrice;
    }
    default:
      return 0;
  }
};


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItemState>(null);
  const [toastQueue, setToastQueue] = useState<Array<{ title: string; description: string, variant?: 'default' | 'destructive' }>>([]);

  useEffect(() => {
    if (toastQueue.length > 0) {
      const toastToShow = toastQueue[0];
      toast(toastToShow); // Assuming toast is synchronous or handles its own queueing well
      setToastQueue(currentQueue => currentQueue.slice(1));
    }
  }, [toastQueue]);

  const addToastToQueue = useCallback((newToast: { title: string; description: string, variant?: 'default' | 'destructive' }) => {
    setToastQueue(currentQueue => [...currentQueue, newToast]);
  }, []);


  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setItems(JSON.parse(storedCartItems));
    }
  }, []);

  useEffect(() => {
    if (items.length > 0 || localStorage.getItem('cartItems')) {
        localStorage.setItem('cartItems', JSON.stringify(items));
    } else if (items.length === 0 && localStorage.getItem('cartItems')) {
        // Clear local storage only if it exists and items array is now empty
        localStorage.removeItem('cartItems');
    }
  }, [items]);
  
  const addItemToCart = useCallback((
    itemDataFromModal: Omit<CartItem, 'cartItemId' | 'unitPrice' | 'quantity'>
  ) => {
    setItems(currentItems => {
      let optionsForId: any = {};
      if (itemDataFromModal.productType === 'hoodie') {
          const hoodieData = itemDataFromModal as Omit<HoodieCartItem, 'cartItemId'| 'unitPrice' | 'quantity'>;
          optionsForId = { color: hoodieData.selectedColor.value, size: hoodieData.selectedSize.value };
      } else if (itemDataFromModal.productType === 'sweatpants') {
          const sweatpantsData = itemDataFromModal as Omit<SweatpantsCartItem, 'cartItemId'| 'unitPrice' | 'quantity'>;
          optionsForId = { color: sweatpantsData.selectedColor.value, size: sweatpantsData.selectedSize.value };
      } else if (itemDataFromModal.productType === 'bracelet') {
          const braceletData = itemDataFromModal as Omit<BraceletCartItem, 'cartItemId'| 'unitPrice' | 'quantity'>;
          optionsForId = { charms: braceletData.selectedCharms.map(c => c.id).sort() };
      } else if (itemDataFromModal.productType === 'matchingSet') {
          const setData = itemDataFromModal as Omit<MatchingSetCartItem, 'cartItemId'| 'unitPrice' | 'quantity'>;
          optionsForId = { 
            customizations: setData.braceletsCustomization.map(bc => ({
                braceletId: bc.braceletId,
                charms: bc.selectedCharms.map(c => c.id).sort()
            })).sort((a,b) => a.braceletId.localeCompare(b.braceletId))
          };
      }

      const newCartItemId = generateCartItemId(itemDataFromModal.productId, optionsForId);
      const newUnitPrice = calculateUnitPrice(itemDataFromModal);

      let nextItems = [...currentItems];
      let toastMsg: { title: string; description: string, variant?: 'default' | 'destructive' } | null = null;
      let editingItemToClear = false;

      if (editingItem && editingItem.cartItemId) { // Indicates an update operation
        editingItemToClear = true;
        const oldCartItemId = editingItem.cartItemId;
        const originalQuantity = editingItem.item.quantity; // Use the quantity of the item being edited

        if (oldCartItemId === newCartItemId) {
          // Configuration hasn't changed the ID, just update properties of the item.
          nextItems = currentItems.map(item =>
            item.cartItemId === oldCartItemId
              ? { ...itemDataFromModal, cartItemId: newCartItemId, unitPrice: newUnitPrice, quantity: originalQuantity } as CartItem
              : item
          );
          toastMsg = { title: "Item Updated", description: `${itemDataFromModal.name} has been updated in your cart.` };
        } else {
          // Configuration changed, resulting in a new cartItemId.
          // 1. Remove the old item.
          nextItems = currentItems.filter(item => item.cartItemId !== oldCartItemId);
          // 2. Add/merge the new item.
          const existingItemWithNewConfigIndex = nextItems.findIndex(i => i.cartItemId === newCartItemId);
          if (existingItemWithNewConfigIndex > -1) {
            // New configuration matches another existing item, so merge quantities.
            nextItems[existingItemWithNewConfigIndex] = {
              ...nextItems[existingItemWithNewConfigIndex],
              quantity: nextItems[existingItemWithNewConfigIndex].quantity + originalQuantity,
              // unitPrice should be newUnitPrice if we are "moving" the item here
              unitPrice: newUnitPrice, 
              // Also update other properties like image, selectedColor, selectedSize for hoodies/sweatpants
              ...(itemDataFromModal.productType === 'hoodie' && { selectedColor: (itemDataFromModal as HoodieCartItem).selectedColor, selectedSize: (itemDataFromModal as HoodieCartItem).selectedSize, image: itemDataFromModal.image }),
              ...(itemDataFromModal.productType === 'sweatpants' && { selectedColor: (itemDataFromModal as SweatpantsCartItem).selectedColor, selectedSize: (itemDataFromModal as SweatpantsCartItem).selectedSize, image: itemDataFromModal.image }),
              ...(itemDataFromModal.productType === 'bracelet' && { selectedCharms: (itemDataFromModal as BraceletCartItem).selectedCharms, image: itemDataFromModal.image }),
              ...(itemDataFromModal.productType === 'matchingSet' && { braceletsCustomization: (itemDataFromModal as MatchingSetCartItem).braceletsCustomization, image: itemDataFromModal.image }),
            };
            toastMsg = { title: "Item Updated & Merged", description: `${itemDataFromModal.name} configuration changed and merged.` };
          } else {
            // New configuration is entirely new, add it with original quantity.
            nextItems.push({ ...itemDataFromModal, cartItemId: newCartItemId, unitPrice: newUnitPrice, quantity: originalQuantity } as CartItem);
            toastMsg = { title: "Item Updated", description: `${itemDataFromModal.name} configuration changed in your cart.` };
          }
        }
      } else { // Adding a new item (not an update from edit mode)
        const quantityToAdd = 1; // New items from modal are always quantity 1 initially
        const existingItemIndex = currentItems.findIndex(item => item.cartItemId === newCartItemId);
        if (existingItemIndex > -1) {
          nextItems = currentItems.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantityToAdd }
              : item
          );
          toastMsg = { title: "Quantity Updated", description: `Quantity of ${itemDataFromModal.name} increased in your cart.` };
        } else {
          nextItems.push({ ...itemDataFromModal, cartItemId: newCartItemId, unitPrice: newUnitPrice, quantity: quantityToAdd } as CartItem);
          toastMsg = { title: "Item Added", description: `${itemDataFromModal.name} has been added to your cart.` };
        }
      }

      if (toastMsg) addToastToQueue(toastMsg);
      if (editingItemToClear) setEditingItem(null);
      if (!isCartOpen) setIsCartOpen(true); // Open cart if it was closed
      return nextItems;
    });
  }, [editingItem, isCartOpen, addToastToQueue, setEditingItem, setIsCartOpen]);


  const removeItemFromCart = useCallback((cartItemId: string) => {
    setItems(currentItems => {
        const itemToRemove = currentItems.find(item => item.cartItemId === cartItemId);
        const nextItems = currentItems.filter(item => item.cartItemId !== cartItemId);
        if (itemToRemove) {
            addToastToQueue({ title: "Item Removed", description: `${itemToRemove.name} has been removed from your cart.`, variant: 'destructive' });
        }
        if (editingItem && editingItem.cartItemId === cartItemId) {
            setEditingItem(null);
        }
        return nextItems;
    });
  }, [addToastToQueue, editingItem]);

  const updateItemQuantity = useCallback((cartItemId: string, quantity: number) => {
     setItems(currentItems => {
        const currentItem = currentItems.find(item => item.cartItemId === cartItemId);
        let toastInfo: { title: string; description: string; variant?: "default" | "destructive" } | null = null;
        let nextItems = [...currentItems];

        if (quantity <= 0) {
            if (currentItem) {
                toastInfo = { title: "Item Removed", description: `${currentItem.name} has been removed from your cart.`, variant: 'destructive' };
            }
            nextItems = nextItems.filter(item => item.cartItemId !== cartItemId);
            if (editingItem && editingItem.cartItemId === cartItemId) {
                setEditingItem(null);
            }
        } else {
            if (currentItem) {
                toastInfo = { title: "Quantity Updated", description: `Quantity of ${currentItem.name} changed to ${quantity}.` };
            }
            nextItems = nextItems.map(item =>
                item.cartItemId === cartItemId ? { ...item, quantity } : item
            );
        }
        
        if (toastInfo) {
            addToastToQueue(toastInfo);
        }
        return nextItems;
    });
  }, [addToastToQueue, editingItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setEditingItem(null); 
    addToastToQueue({ title: "Cart Cleared", description: "All items have been removed from your cart.", variant: 'destructive' });
  }, [addToastToQueue]);

  const cartTotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  
  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []); 

  const getOriginalProductForEditing = useCallback((cartItem: CartItem): Hoodie | Bracelet | MatchingBraceletSet | Sweatpants | undefined => {
    switch (cartItem.productType) {
        case 'hoodie':
            return mockHoodies.find(h => h.id === cartItem.productId);
        case 'sweatpants':
            return mockSweatpants.find(s => s.id === cartItem.productId);
        case 'bracelet':
            return mockBracelets.find(b => b.id === cartItem.productId);
        case 'matchingSet':
            return mockMatchingBracelets.find(ms => ms.id === cartItem.productId);
        default:
            return undefined;
    }
  }, []);


  return (
    <CartContext.Provider value={{ items, addItemToCart, removeItemFromCart, updateItemQuantity, clearCart, cartTotal, cartCount, isCartOpen, toggleCart, openCart, closeCart, editingItem, setEditingItem, getOriginalProductForEditing }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const getCartItemIdFromEditingItem = (editingItem: EditingItemState): string | undefined => {
  if (!editingItem) return undefined;
  
  // The structure of EditingItemState ensures `item` exists and has `cartItemId`
  return editingItem.item.cartItemId;
};
