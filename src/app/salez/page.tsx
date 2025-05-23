
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import { ProductDetailModal } from '@/components/product-detail-modal';
import { mockHoodies } from '@/data/mock-hoodies';
import type { Hoodie, HoodieCartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Percent } from 'lucide-react';
import { useCart } from '@/context/cart-context'; 
import { Footer } from '@/components/footer'; 
import { toast } from '@/hooks/use-toast';


export default function SalezPage() {
  const { editingItem, setEditingItem } = useCart(); 
  const [allSaleHoodies, setAllSaleHoodies] = useState<Hoodie[]>([]);
  const [filteredSaleHoodies, setFilteredSaleHoodies] = useState<Hoodie[]>([]);
  const [selectedHoodie, setSelectedHoodie] = useState<Hoodie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const saleItems = mockHoodies.filter(
      hoodie => hoodie.originalPrice && hoodie.originalPrice > hoodie.price
    );
    setAllSaleHoodies(saleItems);
  }, []);

  // Effect to open modal if editingItem changes (e.g., from cart edit button)
  useEffect(() => {
    if (editingItem?.type === 'hoodie') {
      // Check if the hoodie being edited is actually a sale item shown on this page
      const hoodieToEdit = allSaleHoodies.find(h => h.id === editingItem.item.productId);
      
      if (hoodieToEdit) {
        // Yes, it's a sale item, open the modal for editing
        setSelectedHoodie(hoodieToEdit); // Set base hoodie for the modal
        setIsModalOpen(true);
      } else {
        // The item being edited is a hoodie, but not one currently on sale
        // Or it's a different type of item entirely.
        // Don't open the modal here. If navigation happened, the other page's useEffect will handle it.
        // If navigation didn't happen (e.g., error state), clear the editingItem.
         if (editingItem?.item?.productId && !allSaleHoodies.some(h => h.id === editingItem.item.productId)) {
           // Only show toast if it was a hoodie but not a SALE hoodie
           toast({
                title: "Edit Mismatch",
                description: "This item is not currently on sale. Please edit it from the main Hoodiez page.",
                variant: "default", // Use default, not necessarily an error
            });
         }
        // Important: Clear editingItem ONLY if it's for a hoodie and NOT found here.
        // If it's another type, let the corresponding page handle it.
        if (editingItem?.item?.productId && !allSaleHoodies.some(h => h.id === editingItem.item.productId)) {
            setEditingItem(null);
        }
      }
    }
  }, [editingItem, setEditingItem, allSaleHoodies]); // Added allSaleHoodies dependency


  useEffect(() => {
    let items = allSaleHoodies;
    if (searchTerm) {
      items = items.filter(
        hoodie =>
          hoodie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hoodie.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredSaleHoodies(items);
  }, [searchTerm, allSaleHoodies]);

  const handleViewDetails = (hoodie: Hoodie) => {
    // When viewing details fresh (not editing), ensure editingItem is cleared
    if (editingItem) setEditingItem(null);
    setSelectedHoodie(hoodie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHoodie(null);
    // If the modal was closed while editing, clear the editingItem state
    if (editingItem?.type === 'hoodie') {
        setEditingItem(null);
    }
  };

  if (!hasMounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow container mx-auto p-4 text-center">
          <p className="text-3xl font-semibold text-primary animate-pulse">Loading Salez...</p>
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
              <Percent className="h-12 w-12 text-accent animate-pulse" />
              Hot Dealz!
            </h1>
            <p className="text-xl text-muted-foreground">
              Grab these awesome hoodiez at discounted prices before they're gone!
            </p>
          </div>

          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center max-w-xl mx-auto">
            <div className="relative flex-grow w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sale items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 py-3 text-base rounded-full focus:ring-2 focus:ring-accent border-muted bg-card/80 shadow-sm"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
            <p className="text-lg text-muted-foreground whitespace-nowrap">
              Showing {filteredSaleHoodies.length} of {allSaleHoodies.length} sale items
            </p>
          </div>

          {filteredSaleHoodies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSaleHoodies.map(hoodie => (
                <ProductCard key={hoodie.id} hoodie={hoodie} onViewDetailsClick={handleViewDetails} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Percent className="h-24 w-24 text-muted-foreground/50 mx-auto mb-6" />
              <h2 className="text-3xl font-semibold mb-2 text-foreground">No Sale Items Found</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {searchTerm ? "Your search didn't match any sale items. Try a different term or clear the search." : "Check back later for more cœzii dealz!"}
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')} variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Clear Search
                  </Button>
              )}
            </div>
          )}
        </div>
      </main>
      <ProductDetailModal
        hoodie={selectedHoodie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      <Footer />
    </div>
  );
}

