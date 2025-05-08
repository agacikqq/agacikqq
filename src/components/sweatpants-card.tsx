
'use client';

import Image from 'next/image';
import type { Sweatpants, ProductColor } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Percent } from 'lucide-react';

interface SweatpantsCardProps {
  sweatpants: Sweatpants;
  onViewDetailsClick: (sweatpants: Sweatpants) => void;
}

export function SweatpantsCard({ sweatpants, onViewDetailsClick }: SweatpantsCardProps) {
  const isOnSale = sweatpants.originalPrice && sweatpants.originalPrice > sweatpants.price;
  const discountPercent = isOnSale ? Math.round(((sweatpants.originalPrice! - sweatpants.price) / sweatpants.originalPrice!) * 100) : 0;

  return (
    <Card className="relative flex h-full flex-col overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl">
      {isOnSale && (
        <Badge variant="destructive" className="absolute top-3 right-3 z-10 text-base px-3 py-1 shadow-md">
          <Percent className="mr-1 h-4 w-4" />
          {discountPercent}% OFF
        </Badge>
      )}
      <CardHeader className="p-0">
        <div className="aspect-[3/4] w-full overflow-hidden">
          <Image
            src={sweatpants.images[0]}
            alt={sweatpants.name}
            width={400}
            height={533}
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint={`${sweatpants.colors[0].name.toLowerCase()} sweatpants clothing`}
            priority={sweatpants.id === 'sp1' || sweatpants.id === 'sp2'} 
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2 text-2xl font-semibold leading-tight tracking-tight">
          {sweatpants.name}
        </CardTitle>
        
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-accent">
            AED {sweatpants.price.toFixed(2)}
          </span>
          {isOnSale && sweatpants.originalPrice && (
            <del className="text-xl text-muted-foreground/80">
              AED {sweatpants.originalPrice.toFixed(2)}
            </del>
          )}
        </div>

        <p className="mb-3 text-lg text-muted-foreground line-clamp-2">
          {sweatpants.description}
        </p>
        <div className="mb-3">
          <h4 className="mb-1 text-lg font-medium text-foreground/80">Colors:</h4>
          <div className="flex flex-wrap gap-2">
            {sweatpants.colors.map((color: ProductColor) => (
              <Badge
                key={color.value}
                variant="outline"
                className="flex items-center gap-1.5 border-border px-2 py-1"
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
          <h4 className="mb-1 text-lg font-medium text-foreground/80">Sizes:</h4>
          <div className="flex flex-wrap gap-1.5">
            {sweatpants.availableSizes.map((size) => (
              <Badge key={size.value} variant="secondary" className="px-2.5 py-1">
                {size.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="default"
          size="lg"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => onViewDetailsClick(sweatpants)}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
