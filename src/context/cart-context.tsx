'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartItem, HoodieCartItem, BraceletCartItem, MatchingSetCartItem, Hoodie, ProductColor, ProductSize, Bracelet, Charm, MatchingBraceletSet, EditingItemState, BraceletCustomization } from '@/types';
import { toast } from '@/hooks/use-toast';
import { mockBracelets } from '@/data/mock-bracelets';
import { mockMatchingBracelets } from '@/data/mock-matching-bracelets';
import { mockHoodies } from '@/data/mock-hoodies';


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
  setEditingItem: (item: EditingItemState) => void;
  getOriginalProductForEditing: (cartItem: CartItem) => Hoodie | Bracelet | MatchingBraceletSet | undefined;
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

    if (currentEditingItem && currentEditingItem.productType === itemData.productType && currentEditingItem.productId === itemData.productId && currentEditingItem.cartItemId) {
      let itemReplaced = false;
      nextItems = currentItems.map(item => {
        if (item.cartItemId === currentEditingItem.cartItemId) {
          itemReplaced = true;
          // Create a new object for the updated item
          const updatedItem: CartItem = {
            // Spread existing properties if they should be preserved (like quantity if not overridden by quantityToAdd)
            // For now, assuming itemData and newly calculated properties are sufficient
            ...itemData,
            cartItemId, // Use newly generated cartItemId if options changed, or old one if just quantity
            unitPrice,
            quantity: quantityToAdd, // Ensure quantity is correctly set
          } as CartItem; // Cast to CartItem
          return updatedItem;
        }
        return item;
      });
      
      if (!itemReplaced) {
        // This case means the item being "edited" wasn't found by its original cartItemId.
        // This could happen if its configuration changed so much that its cartItemId also changed.
        // Or if it was removed from the cart by another action.
        // We should remove the old instance if its ID is different from the new one and it still exists.
        if(currentEditingItem.cartItemId !== cartItemId) {
            nextItems = nextItems.filter(i => i.cartItemId !== currentEditingItem.cartItemId);
        }
        // Then, check if an item with the *new* cartItemId exists to update its quantity, or add as new.
        const existingNewConfigItemIndex = nextItems.findIndex(i => i.cartItemId === cartItemId);
        if (existingNewConfigItemIndex > -1) {
            nextItems[existingNewConfigItemIndex] = { ...nextItems[existingNewConfigItemIndex], quantity: nextItems[existingNewConfigItemIndex].quantity + quantityToAdd };
        } else {
            nextItems.push({ ...itemData, cartItemId, unitPrice, quantity: quantityToAdd } as CartItem);
        }
      }
      toastMsg = { title: "Item Updated", description: `${itemData.name} has been updated in your cart.` };
      editingItemToClear = true;
    } else {
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
    const result = addItemToCartLogic(itemData, items, editingItem);
    
    setItems(result.nextItems);

    if (result.toastMsg) {
      toast(result.toastMsg);
    }

    if (result.editingItemToClear) {
      setEditingItem(null);
    }

    if (!isCartOpen) {
        setIsCartOpen(true);
    }
  }, [items, editingItem, isCartOpen]);


  const removeItemFromCart = useCallback((cartItemId: string) => {
    const itemToRemove = items.find(item => item.cartItemId === cartItemId);
    
    const nextItems = items.filter(item => item.cartItemId !== cartItemId);
    setItems(nextItems);

    if (itemToRemove) {
      toast({ title: "Item Removed", description: `${itemToRemove.name} has been removed from your cart.`, variant: 'destructive' });
    }
  }, [items]);

  const updateItemQuantity = useCallback((cartItemId: string, quantity: number) => {
    const currentItem = items.find(item => item.cartItemId === cartItemId);
    let toastInfo: { title: string; description: string; variant?: "default" | "destructive" } | null = null;

    let nextItems = [...items]; // Create a copy of the current items

    if (quantity <= 0) {
        if (currentItem) {
            toastInfo = { title: "Item Removed", description: `${currentItem.name} has been removed from your cart.`, variant: 'destructive' };
        }
        nextItems = nextItems.filter(item => item.cartItemId !== cartItemId);
        
    } else {
        if (currentItem) {
            toastInfo = { title: "Quantity Updated", description: `Quantity of ${currentItem.name} changed to ${quantity}.` };
        }
        nextItems = nextItems.map(item =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
        );
    }
    
    setItems(nextItems);

    if (toastInfo) {
        toast(toastInfo);
    }
  }, [items]);

  const clearCart = useCallback(() => {
    setItems([]);
    toast({ title: "Cart Cleared", description: "All items have been removed from your cart.", variant: 'destructive' });
  }, []);

  const cartTotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => {
    setIsCartOpen(false);
    if (editingItem) { // Only clear editingItem if it was set
        setEditingItem(null); 
    }
  }, [editingItem]); // Add editingItem to dependency if its presence affects logic

  const getOriginalProductForEditing = useCallback((cartItem: CartItem): Hoodie | Bracelet | MatchingBraceletSet | undefined => {
    switch (cartItem.productType) {
        case 'hoodie':
            return mockHoodies.find(h => h.id === cartItem.productId);
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

// Helper function to get cartItemId for an editing item, used in CartContext
export const getCartItemIdFromEditingItem = (editingItem: EditingItemState): string | undefined => {
  if (!editingItem) return undefined;
  
  switch (editingItem.type) {
    case 'hoodie':
      return editingItem.item.cartItemId;
    case 'bracelet':
      return editingItem.item.cartItemId;
    case 'matchingSet':
      return editingItem.item.cartItemId;
    default:
      return undefined;
  }
};
