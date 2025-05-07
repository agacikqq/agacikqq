
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import { FilterSidebar } from '@/components/filter-sidebar';
import { ProductDetailModal } from '@/components/product-detail-modal';
import { mockHoodies } from '@/data/mock-hoodies';
import type { Hoodie, Filters, ProductColor, ProductSize, ProductDesign } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { SidebarInset } from '@/components/ui/sidebar';

export default function HomePage() {
  const [hoodies, setHoodies] = useState<Hoodie[]>(mockHoodies);
  const [selectedHoodie, setSelectedHoodie] = useState<Hoodie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filters>({
    colors: [],
    sizes: [],
    designs: [],
  });

  // Prevent hydration errors by delaying rendering of client-specific components
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);


  const allColors = useMemo(() => {
    const colors = new Map<string, ProductColor>();
    mockHoodies.forEach(hoodie => hoodie.colors.forEach(color => colors.set(color.value, color)));
    return Array.from(colors.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, []);

  const allSizes = useMemo(() => {
    const sizes = new Map<string, ProductSize>();
    mockHoodies.forEach(hoodie => hoodie.availableSizes.forEach(size => sizes.set(size.value, size)));
    // Define a sort order for sizes
    const sortOrder: { [key: string]: number } = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5 };
    return Array.from(sizes.values()).sort((a, b) => (sortOrder[a.value] || 99) - (sortOrder[b.value] || 99));
  }, []);

  const allDesigns = useMemo(() => {
    const designs = new Map<string, ProductDesign>();
    mockHoodies.forEach(hoodie => hoodie.designs.forEach(design => designs.set(design.value, design)));
    return Array.from(designs.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, []);

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    setActiveFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  const handleClearFilters = () => {
    setActiveFilters({ colors: [], sizes: [], designs: [] });
    setSearchTerm('');
  };

  const filteredHoodies = useMemo(() => {
    return hoodies.filter(hoodie => {
      const matchesSearch = searchTerm === '' || 
        hoodie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hoodie.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesColor = activeFilters.colors.length === 0 ||
        activeFilters.colors.some(fc => hoodie.colors.some(hc => hc.value === fc));
      
      const matchesSize = activeFilters.sizes.length === 0 ||
        activeFilters.sizes.some(fs => hoodie.availableSizes.some(hs => hs.value === fs));

      const matchesDesign = activeFilters.designs.length === 0 ||
        activeFilters.designs.some(fd => hoodie.designs.some(hd => hd.value === fd));

      return matchesSearch && matchesColor && matchesSize && matchesDesign;
    });
  }, [hoodies, activeFilters, searchTerm]);

  const handleViewDetails = (hoodie: Hoodie) => {
    setSelectedHoodie(hoodie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHoodie(null);
  };

  if (!hasMounted) {
    // Render a loading state or null during server-side rendering and initial client-side mount
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow container mx-auto p-4 text-center">
          <p className="text-3xl font-semibold text-primary animate-pulse">Loading cœzii...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex flex-1">
        <FilterSidebar
          allColors={allColors}
          allSizes={allSizes}
          allDesigns={allDesigns}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        <SidebarInset>
          <main className="flex-1 p-4 md:p-8 bg-transparent"> {/* Changed bg-background to bg-transparent to allow body gradient to show */}
            <div className="container mx-auto">
              <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search hoodies by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 py-3 rounded-full focus:ring-2 focus:ring-accent border-muted bg-card/80" // Input component itself handles text size
                  />
                  {searchTerm && (
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => setSearchTerm('')}
                      >
                       <X className="h-4 w-4" />
                       <span className="sr-only">Clear search</span>
                     </Button>
                  )}
                </div>
                <p className="text-lg text-muted-foreground whitespace-nowrap"> {/* Increased text size from text-base to text-lg */}
                  Showing {filteredHoodies.length} of {hoodies.length} hoodies
                </p>
              </div>

              {filteredHoodies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredHoodies.map(hoodie => (
                    <ProductCard key={hoodie.id} hoodie={hoodie} onViewDetailsClick={handleViewDetails} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <h2 className="text-3xl font-semibold mb-2">No Hoodies Found</h2>
                  <p className="text-lg text-muted-foreground mb-4"> {/* Increased text size from text-base to text-lg */}
                    Try adjusting your search or filters.
                  </p>
                  <Button onClick={handleClearFilters} variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
      <ProductDetailModal
        hoodie={selectedHoodie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

