'use client';

import Image from 'next/image';
import type { Hoodie, ProductColor } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface ProductCardProps {
  hoodie: Hoodie;
  onViewDetailsClick: (hoodie: Hoodie) => void;
}

export function ProductCard({ hoodie, onViewDetailsClick }: ProductCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="aspect-[3/4] w-full overflow-hidden">
          <Image
            src={hoodie.images[0]}
            alt={hoodie.name}
            width={400}
            height={533}
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint={`${hoodie.colors[0].name.toLowerCase()} hoodie clothing`}
            priority={hoodie.id === '1' || hoodie.id === '2'} // Prioritize first few images
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2 text-2xl font-semibold leading-tight tracking-tight">
          {hoodie.name}
        </CardTitle>
        <p className="mb-3 text-3xl font-bold text-accent">
          ${hoodie.price.toFixed(2)}
        </p>
        <p className="mb-3 text-base text-muted-foreground line-clamp-2">
          {hoodie.description}
        </p>
        <div className="mb-3">
          <h4 className="mb-1 text-sm font-medium text-foreground/80">Colors:</h4>
          <div className="flex flex-wrap gap-2">
            {hoodie.colors.map((color: ProductColor) => (
              <Badge
                key={color.value}
                variant="outline"
                className="flex items-center gap-1.5 border-border px-2 py-1" // text-sm is now in Badge component
                aria-label={`Color: ${color.name}`}
              >
                <span
                  className="inline-block h-3 w-3 rounded-full border"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden="true"
                />
                {color.name}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-1 text-sm font-medium text-foreground/80">Sizes:</h4>
          <div className="flex flex-wrap gap-1.5">
            {hoodie.availableSizes.map((size) => (
              <Badge key={size.value} variant="secondary" className="px-2.5 py-1"> {/* text-sm is now in Badge component */}
                {size.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="default"
          size="lg" // Button size lg text will be base or lg depending on button.tsx
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => onViewDetailsClick(hoodie)}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

