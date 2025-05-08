
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { BraceletCard } from '@/components/bracelet-card';
import { BraceletDetailModal } from '@/components/bracelet-detail-modal';
import { mockBracelets } from '@/data/mock-bracelets';
import type { Bracelet } from '@/types';
import { Gem } from 'lucide-react';
import { useCart } from '@/context/cart-context'; 
import { Footer } from '@/components/footer'; 
import { toast } from '@/hooks/use-toast';

export default function CollectionsPage() {
  const { editingItem, setEditingItem } = useCart(); 
  const [bracelets, setBracelets] = useState<Bracelet[]>([]);
  const [selectedBracelet, setSelectedBracelet] = useState<Bracelet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
    setBracelets(mockBracelets);
  }, []);

  // Effect to open the modal when editingItem changes (e.g. from cart edit button)
  useEffect(() => {
    if (editingItem?.type === 'bracelet') {
      // editingItem.originalBracelet should be populated by CartSidebar's handleEditItem
      if (editingItem.originalBracelet) { 
        setSelectedBracelet(editingItem.originalBracelet); // This sets the base bracelet for the modal
        setIsModalOpen(true);
      } else {
        // Fallback if originalBracelet wasn't populated, try finding by ID
        const braceletToEdit = mockBracelets.find(b => b.id === editingItem.item.productId);
        if (braceletToEdit) {
          setSelectedBracelet(braceletToEdit);
          setIsModalOpen(true);
        } else {
          toast({
              title: "Error",
              description: "Could not find the bracelet details to edit.",
              variant: "destructive",
          });
          setEditingItem(null); // Clear the editing state
        }
      }
    }
  }, [editingItem, setEditingItem]); 

  const handleViewDetails = (bracelet: Bracelet) => {
    // When viewing details fresh (not editing), ensure editingItem is cleared
    if (editingItem) setEditingItem(null);
    setSelectedBracelet(bracelet);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBracelet(null);
    // If the modal was closed while editing, clear the editingItem state
    if (editingItem?.type === 'bracelet') {
        setEditingItem(null);
    }
  };

  if (!hasMounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow container mx-auto p-4 text-center">
          <p className="text-3xl font-semibold text-primary animate-pulse">Loading Braceletz...</p>
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
              <Gem className="h-12 w-12 text-accent animate-pulse" />
              Individual Braceletz
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover our exquisite range of individual braceletz, ready to be personalized with beautiful charms.
            </p>
          </div>

          {bracelets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bracelets.map(bracelet => (
                <BraceletCard key={bracelet.id} bracelet={bracelet} onViewDetailsClick={handleViewDetails} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Gem className="h-24 w-24 text-muted-foreground/50 mx-auto mb-6" />
              <h2 className="text-3xl font-semibold mb-2 text-foreground">No Braceletz Available</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our individual braceletz collection is currently empty. Please check back soon!
              </p>
            </div>
          )}
        </div>
      </main>
      <BraceletDetailModal
        bracelet={selectedBracelet}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      <Footer />
    </div>
  );
}
