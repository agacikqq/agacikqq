'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { MatchingBraceletSetCard } from '@/components/matching-bracelet-set-card';
import { MatchingBraceletSetDetailModal } from '@/components/matching-bracelet-set-detail-modal';
import { mockMatchingBracelets } from '@/data/mock-matching-bracelets';
import type { MatchingBraceletSet } from '@/types';
import { HeartHandshake } from 'lucide-react';
import { useCart } from '@/context/cart-context'; 
import { Footer } from '@/components/footer'; 
import { toast } from '@/hooks/use-toast';

export default function MatchingBraceletsPage() {
  const { editingItem, setEditingItem } = useCart(); 
  const [matchingSets, setMatchingSets] = useState<MatchingBraceletSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<MatchingBraceletSet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
    setMatchingSets(mockMatchingBracelets);
  }, []);

 // Effect to open the modal when editingItem changes and matches a matchingSet
  useEffect(() => {
    if (editingItem?.type === 'matchingSet') {
      if (editingItem.originalSet) { // Use the set data passed in editingItem
        setSelectedSet(editingItem.originalSet);
        setIsModalOpen(true);
      } else {
         toast({
            title: "Error",
            description: "Could not find the matching set details to edit.",
            variant: "destructive",
        });
        setEditingItem(null);
      }
    }
  }, [editingItem, setEditingItem]); 

  const handleViewDetails = (set: MatchingBraceletSet) => {
    setSelectedSet(set);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSet(null);
    if (editingItem?.type === 'matchingSet') {
        setEditingItem(null);
    }
  };

  if (!hasMounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow container mx-auto p-4 text-center">
          <p className="text-3xl font-semibold text-primary animate-pulse">Loading Matching Setz...</p>
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
              <HeartHandshake className="h-12 w-12 text-accent animate-pulse" />
              Matching Braceletz Setz
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover perfect pairs and setz to share with someone special or to complete your look.
            </p>
          </div>

          {matchingSets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingSets.map(set => (
                <MatchingBraceletSetCard key={set.id} set={set} onViewDetailsClick={handleViewDetails} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <HeartHandshake className="h-24 w-24 text-muted-foreground/50 mx-auto mb-6" />
              <h2 className="text-3xl font-semibold mb-2 text-foreground">No Matching Setz Available</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our collection of matching braceletz setz is currently empty. Please check back soon!
              </p>
            </div>
          )}
        </div>
      </main>
      <MatchingBraceletSetDetailModal
        set={selectedSet}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      <Footer />
    </div>
  );
}
