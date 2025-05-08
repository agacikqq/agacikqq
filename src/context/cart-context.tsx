'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartItem, HoodieCartItem, BraceletCartItem, MatchingSetCartItem, SweatpantsCartItem, Hoodie, ProductColor, ProductSize, Bracelet, Charm, MatchingBraceletSet, EditingItemState, BraceletCustomization, Sweatpants } from '@/types';
import { toast } from '@/hooks/use-toast';
import { mockBracelets } from '@/data/mock-bracelets';
import { mockMatchingBracelets } from '@/data/mock-matching-bracelets';
import { mockHoodies } from '@/data/mock-hoodies';
import { mockSweatpants } from '@/data/mock-sweatpants';


const INCLUDED_CHARMS_COUNT = 4; // Same as in BraceletDetailModal
const INCLUDED_CHARMS_PER_BRACELET_IN_SET = 4; // Same as in MatchingBraceletSetDetailModal

interface CartContextType {
  items: CartItem[];
  addItemToCart: (itemData: Omit<CartItem, 'cartItemId' | 'unitPrice' | 'quantity'> & { quantity?: number }) => void;
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
  const optionsString = JSON.stringify(
    Object.entries(options)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .reduce((obj, [key, value]) => {
        (obj as any)[key] = value;
        return obj;
      }, {})
  );
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
      toast(toastToShow);
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
        localStorage.removeItem('cartItems');
    }
  }, [items]);

  const addItemToCartLogic = (
    itemData: Omit<CartItem, 'cartItemId' | 'unitPrice' | 'quantity'> & { quantity?: number },
    currentItems: CartItem[],
    currentEditingItem: EditingItemState
  ): { nextItems: CartItem[], toastMsg: { title: string; description: string } | null, editingItemToClear: boolean } => {
    
    let optionsForId: any = {};
    if (itemData.productType === 'hoodie') {
        const hoodieData = itemData as Omit<HoodieCartItem, 'cartItemId'| 'unitPrice' | 'quantity'>;
        optionsForId = { color: hoodieData.selectedColor.value, size: hoodieData.selectedSize.value };
    } else if (itemData.productType === 'sweatpants') {
        const sweatpantsData = itemData as Omit<SweatpantsCartItem, 'cartItemId'| 'unitPrice' | 'quantity'>;
        optionsForId = { color: sweatpantsData.selectedColor.value, size: sweatpantsData.selectedSize.value };
    } else if (itemData.productType === 'bracelet') {
        const braceletData = itemData as Omit<BraceletCartItem, 'cartItemId'| 'unitPrice' | 'quantity'>;
        optionsForId = { charms: braceletData.selectedCharms.map(c => c.id).sort() };
    } else if (itemData.productType === 'matchingSet') {
        const setData = itemData as Omit<MatchingSetCartItem, 'cartItemId'| 'unitPrice' | 'quantity'>;
        optionsForId = { 
        customizations: setData.braceletsCustomization.map(bc => ({
            braceletId: bc.braceletId,
            charms: bc.selectedCharms.map(c => c.id).sort()
        })).sort((a,b) => a.braceletId.localeCompare(b.braceletId))
        };
    }

    const cartItemId = generateCartItemId(itemData.productId, optionsForId);
    const unitPrice = calculateUnitPrice(itemData);
    const quantityToAdd = itemData.quantity || 1;

    let nextItems = [...currentItems];
    let toastMsg: { title: string; description: string } | null = null;
    let editingItemToClear = false;

    // Check if the item being added/updated matches the item currently being edited (by cartItemId)
    if (currentEditingItem && currentEditingItem.cartItemId && currentEditingItem.cartItemId === cartItemId) {
       // This means we are updating the currently edited item with its *new* configuration (which might result in the same cartItemId or a new one)
       // This logic is tricky if cartItemId changes. Let's assume for now if currentEditingItem.cartItemId matches, we're replacing that exact item.
       // A more robust way: if currentEditingItem.cartItemId is the ID of the item *before* edit.

       // If the new configuration results in the same cartItemId
        nextItems = currentItems.map(item =>
          item.cartItemId === currentEditingItem.cartItemId // Find the item by its original cartId
            ? { ...itemData, cartItemId, unitPrice, quantity: quantityToAdd } as CartItem // Update it
            : item
        );
        toastMsg = { title: "Item Updated", description: `${itemData.name} has been updated in your cart.` };
        editingItemToClear = true;

    } else if (currentEditingItem && currentEditingItem.cartItemId && currentEditingItem.cartItemId !== cartItemId) {
      // This means the edited item's configuration has changed, resulting in a *new* cartItemId.
      // 1. Remove the old item (identifiable by currentEditingItem.cartItemId).
      nextItems = currentItems.filter(item => item.cartItemId !== currentEditingItem.cartItemId);
      // 2. Add or update the new item (identifiable by the new cartItemId).
      const existingNewConfigItemIndex = nextItems.findIndex(i => i.cartItemId === cartItemId);
      if (existingNewConfigItemIndex > -1) {
          // New configuration matches another existing item, so merge quantities
          nextItems[existingNewConfigItemIndex] = { 
              ...nextItems[existingNewConfigItemIndex], 
              quantity: nextItems[existingNewConfigItemIndex].quantity + quantityToAdd 
          };
      } else {
          // New configuration is entirely new, add it
          nextItems.push({ ...itemData, cartItemId, unitPrice, quantity: quantityToAdd } as CartItem);
      }
      toastMsg = { title: "Item Updated", description: `${itemData.name} configuration changed in your cart.` };
      editingItemToClear = true;

    } else { // Not editing, or editingItem has no cartItemId (fresh add from modal not in edit mode)
      const existingItemIndex = currentItems.findIndex(item => item.cartItemId === cartItemId);
      if (existingItemIndex > -1) {
        nextItems = currentItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
        toastMsg = { title: "Quantity Updated", description: `Quantity of ${itemData.name} increased in your cart.` };
      } else {
        const newItem: CartItem = {
          ...itemData,
          cartItemId,
          unitPrice,
          quantity: quantityToAdd,
        } as CartItem;
        nextItems = [...currentItems, newItem];
        toastMsg = { title: "Item Added", description: `${itemData.name} has been added to your cart.` };
      }
    }
    return { nextItems, toastMsg, editingItemToClear };
  };
  
  const addItemToCart = useCallback((itemData: Omit<CartItem, 'cartItemId' | 'unitPrice' | 'quantity'> & { quantity?: number }) => {
    setItems(currentItems => {
        const result = addItemToCartLogic(itemData, currentItems, editingItem);
        if (result.toastMsg) {
            addToastToQueue(result.toastMsg);
        }
        if (result.editingItemToClear) {
            setEditingItem(null);
        }
        if (!isCartOpen) { // Open cart after adding/updating if it's closed
            setIsCartOpen(true);
        }
        return result.nextItems;
    });
  }, [editingItem, isCartOpen, addToastToQueue]);


  const removeItemFromCart = useCallback((cartItemId: string) => {
    setItems(currentItems => {
        const itemToRemove = currentItems.find(item => item.cartItemId === cartItemId);
        const nextItems = currentItems.filter(item => item.cartItemId !== cartItemId);
        if (itemToRemove) {
            addToastToQueue({ title: "Item Removed", description: `${itemToRemove.name} has been removed from your cart.`, variant: 'destructive' });
        }
        // If the removed item was being edited, clear editingItem
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
            // If the removed item was being edited, clear editingItem
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
    setEditingItem(null); // Also clear editing item if cart is cleared
    addToastToQueue({ title: "Cart Cleared", description: "All items have been removed from your cart.", variant: 'destructive' });
  }, [addToastToQueue]);

  const cartTotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  
  const closeCart = useCallback(() => {
    setIsCartOpen(false);
    // Do NOT clear editingItem here. 
    // It should be cleared by the modal or page when editing is done/cancelled, or if an item is removed.
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
  
  switch (editingItem.type) {
    case 'hoodie':
      return editingItem.item.cartItemId;
    case 'sweatpants':
      return editingItem.item.cartItemId;
    case 'bracelet':
      return editingItem.item.cartItemId;
    case 'matchingSet':
      return editingItem.item.cartItemId;
    default:
      return undefined;
  }
};