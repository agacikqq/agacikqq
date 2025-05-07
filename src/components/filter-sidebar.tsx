'use client';

import type { ProductColor, ProductSize, ProductDesign, Filters } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SlidersHorizontal, X } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from '@/components/ui/sidebar';


interface FilterSidebarProps {
  allColors: ProductColor[];
  allSizes: ProductSize[];
  allDesigns: ProductDesign[];
  activeFilters: Filters;
  onFilterChange: (filterType: keyof Filters, value: string) => void;
  onClearFilters: () => void;
}

export function FilterSidebar({
  allColors,
  allSizes,
  allDesigns,
  activeFilters,
  onFilterChange,
  onClearFilters,
}: FilterSidebarProps) {

  const renderFilterGroup = <T extends { name: string; value: string }>(
    title: string,
    items: T[],
    filterType: keyof Filters,
    activeFilterValues: string[]
  ) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-base font-semibold text-foreground">{title}</SidebarGroupLabel>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${filterType}-${item.value}`}
              checked={activeFilterValues.includes(item.value)}
              onCheckedChange={() => onFilterChange(filterType, item.value)}
              aria-labelledby={`label-${filterType}-${item.value}`}
            />
             {filterType === 'colors' && 'hex' in item && (
                <span
                  className="inline-block h-4 w-4 rounded-full border border-border"
                  style={{ backgroundColor: (item as ProductColor).hex }}
                  aria-hidden="true"
                />
              )}
            <Label htmlFor={`${filterType}-${item.value}`} id={`label-${filterType}-${item.value}`} className="cursor-pointer font-normal text-foreground/90 hover:text-foreground"> {/* Label text size increased in label.tsx */}
              {item.name}
            </Label>
          </div>
        ))}
      </div>
    </SidebarGroup>
  );

  return (
    <Sidebar side="left" collapsible="icon" variant="sidebar" className="border-r">
      <SidebarHeader className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Filters</h2>
        </div>
      </SidebarHeader>
      <ScrollArea className="h-[calc(100vh-140px)]"> {/* Adjust height based on header/footer */}
        <SidebarContent className="p-0">
          {renderFilterGroup('Colors', allColors, 'colors', activeFilters.colors)}
          <Separator className="my-4" />
          {renderFilterGroup('Sizes', allSizes, 'sizes', activeFilters.sizes)}
          <Separator className="my-4" />
          {renderFilterGroup('Designs', allDesigns, 'designs', activeFilters.designs)}
        </SidebarContent>
      </ScrollArea>
       <div className="mt-auto border-t p-4">
        <Button
          variant="outline"
          className="w-full" // Text size will be base due to button.tsx change
          onClick={onClearFilters}
          disabled={
            activeFilters.colors.length === 0 &&
            activeFilters.sizes.length === 0 &&
            activeFilters.designs.length === 0
          }
        >
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      </div>
    </Sidebar>
  );
}

