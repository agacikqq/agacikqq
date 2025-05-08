
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/header';
import { SweatpantsCard } from '@/components/sweatpants-card';
import { SweatpantsDetailModal } from '@/components/sweatpants-detail-modal';
import { mockSweatpants } from '@/data/mock-sweatpants';
import type { Sweatpants, Filters, ProductColor, ProductSize, ProductDesign, SweatpantsCartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, SlidersHorizontal, Slack } from 'lucide-react';
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

export default function SweatpantsPage() {
  const { editingItem } = useCart();
  const [sweatpantsList, setSweatpantsList] = useState<Sweatpants[]>(mockSweatpants);
  const [selectedSweatpants, setSelectedSweatpants] = useState<Sweatpants | null>(null);
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
    if (editingItem?.productType === 'sweatpants') {
      const itemToEdit = mockSweatpants.find(s => s.id === editingItem.productId);
      if (itemToEdit && editingItem.type === 'sweatpants' && editingItem.item.cartItemId === (editingItem as { type: 'sweatpants'; item: SweatpantsCartItem }).item.cartItemId) {
        setSelectedSweatpants(itemToEdit);
        setIsModalOpen(true);
      }
    } else if (!editingItem && isModalOpen && selectedSweatpants){
      // Modal close logic if editing finished elsewhere
    }
  }, [editingItem, isModalOpen, selectedSweatpants]);


  const allColors = useMemo(() => {
    const colors = new Map<string, ProductColor>();
    mockSweatpants.forEach(item => item.colors.forEach(color => colors.set(color.value, color)));
    return Array.from(colors.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, []);

  const allSizes = useMemo(() => {
    const sizes = new Map<string, ProductSize>();
    mockSweatpants.forEach(item => item.availableSizes.forEach(size => sizes.set(size.value, size)));
    const sortOrder: { [key: string]: number } = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5 };
    return Array.from(sizes.values()).sort((a, b) => (sortOrder[a.value] || 99) - (sortOrder[b.value] || 99));
  }, []);

  const allDesigns = useMemo(() => {
    const designs = new Map<string, ProductDesign>();
    mockSweatpants.forEach(item => item.designs.forEach(design => designs.set(design.value, design)));
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

  const filteredSweatpants = useMemo(() => {
    return sweatpantsList.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesColor = activeFilters.colors.length === 0 ||
        activeFilters.colors.some(fc => item.colors.some(hc => hc.value === fc));
      
      const matchesSize = activeFilters.sizes.length === 0 ||
        activeFilters.sizes.some(fs => item.availableSizes.some(hs => hs.value === fs));

      const matchesDesign = activeFilters.designs.length === 0 ||
        activeFilters.designs.some(fd => item.designs.some(hd => hd.value === fd));

      return matchesSearch && matchesColor && matchesSize && matchesDesign;
    });
  }, [sweatpantsList, activeFilters, searchTerm]);

  const handleViewDetails = (item: Sweatpants) => {
    setSelectedSweatpants(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSweatpants(null);
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
          <p className="text-3xl font-semibold text-primary animate-pulse">Loading Sweatpantz...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 p-4 md:p-8 bg-transparent">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold text-primary mb-3 flex items-center justify-center gap-3">
              <Slack className="h-12 w-12 text-accent animate-pulse" />
              Our Sweatpantz Collection
            </h1>
            <p className="text-xl text-muted-foreground">
              Find your perfect pair of cœzii sweatpantz. Filter by color, size, and style.
            </p>
          </div>

          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sweatpantz by name or description..."
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
                Showing {filteredSweatpants.length} of {sweatpantsList.length} sweatpantz
              </p>
            </div>
          </div>

          {filteredSweatpants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSweatpants.map(item => (
                <SweatpantsCard key={item.id} sweatpants={item} onViewDetailsClick={handleViewDetails} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
                <Slack className="h-24 w-24 text-muted-foreground/50 mx-auto mb-6" />
              <h2 className="text-3xl font-semibold mb-2 text-foreground">No Sweatpantz Found</h2>
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
      <SweatpantsDetailModal
        sweatpants={selectedSweatpants}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
