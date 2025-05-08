
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import { ProductDetailModal } from '@/components/product-detail-modal';
import { mockHoodies } from '@/data/mock-hoodies';
import type { Hoodie, Filters, ProductColor, ProductSize, ProductDesign, HoodieCartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Shirt, SlidersHorizontal } from 'lucide-react'; 
import { useCart } from '@/context/cart-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Footer } from '@/components/footer'; // Import Footer

export default function HoodiesPage() {
  const { editingItem } = useCart();
  const [hoodies, setHoodies] = useState<Hoodie[]>(mockHoodies);
  const [selectedHoodie, setSelectedHoodie] = useState<Hoodie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filters>({
    colors: [],
    sizes: [],
    designs: [],
  });

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (editingItem?.productType === 'hoodie') {
      const hoodieToEdit = mockHoodies.find(h => h.id === editingItem.productId);
      if (hoodieToEdit && editingItem.type === 'hoodie' && editingItem.item.cartItemId === (editingItem as { type: 'hoodie'; item: HoodieCartItem }).item.cartItemId) {
        setSelectedHoodie(hoodieToEdit);
        setIsModalOpen(true);
      }
    } else if (!editingItem && isModalOpen && selectedHoodie){
    }
  }, [editingItem, isModalOpen, selectedHoodie]);


  const allColors = useMemo(() => {
    const colors = new Map<string, ProductColor>();
    mockHoodies.forEach(hoodie => hoodie.colors.forEach(color => colors.set(color.value, color)));
    return Array.from(colors.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, []);

  const allSizes = useMemo(() => {
    const sizes = new Map<string, ProductSize>();
    mockHoodies.forEach(hoodie => hoodie.availableSizes.forEach(size => sizes.set(size.value, size)));
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

  const renderFilterDropdownGroup = <T extends { name: string; value: string }>(
    title: string,
    items: T[],
    filterType: keyof Filters,
    activeFilterValues: string[]
  ) => (
    <>
      <DropdownMenuLabel>{title}</DropdownMenuLabel>
      {items.map((item) => (
        <DropdownMenuCheckboxItem
          key={item.value}
          checked={activeFilterValues.includes(item.value)}
          onCheckedChange={() => handleFilterChange(filterType, item.value)}
        >
          {filterType === 'colors' && 'hex' in item && (
            <span
              className="mr-2 inline-block h-3 w-3 rounded-full border border-border"
              style={{ backgroundColor: (item as ProductColor).hex }}
              aria-hidden="true"
            />
          )}
          {item.name}
        </DropdownMenuCheckboxItem>
      ))}
    </>
  );

  if (!hasMounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow container mx-auto p-4 text-center">
          <p className="text-3xl font-semibold text-primary animate-pulse">Loading Hoodiez...</p>
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
              <Shirt className="h-12 w-12 text-accent animate-pulse" />
              Our Hoodiez Collection
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover your next favorite cœzii hoodiez. Filter by color, size, and style to find the perfect fit.
            </p>
          </div>

          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search hoodiez by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 py-3 rounded-full focus:ring-2 focus:ring-accent border-muted bg-card/80"
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
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {renderFilterDropdownGroup('Colors', allColors, 'colors', activeFilters.colors)}
                  <DropdownMenuSeparator />
                  {renderFilterDropdownGroup('Sizes', allSizes, 'sizes', activeFilters.sizes)}
                  <DropdownMenuSeparator />
                  {renderFilterDropdownGroup('Designs', allDesigns, 'designs', activeFilters.designs)}
                  {(activeFilters.colors.length > 0 || activeFilters.sizes.length > 0 || activeFilters.designs.length > 0) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleClearFilters} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <X className="mr-2 h-4 w-4" /> Clear All Filters
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <p className="text-lg text-muted-foreground whitespace-nowrap">
                Showing {filteredHoodies.length} of {hoodies.length} hoodiez
              </p>
            </div>
          </div>

          {filteredHoodies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredHoodies.map(hoodie => (
                <ProductCard key={hoodie.id} hoodie={hoodie} onViewDetailsClick={handleViewDetails} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
                <Shirt className="h-24 w-24 text-muted-foreground/50 mx-auto mb-6" />
              <h2 className="text-3xl font-semibold mb-2 text-foreground">No Hoodiez Found</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Try adjusting your search or filters.
              </p>
              <Button onClick={handleClearFilters} variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Clear All Filters
              </Button>
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
