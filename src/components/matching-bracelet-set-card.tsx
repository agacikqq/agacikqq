
'use client';

import Image from 'next/image';
import type { MatchingBraceletSet } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Users, Percent } from 'lucide-react';

interface MatchingBraceletSetCardProps {
  set: MatchingBraceletSet;
  onViewDetailsClick: (set: MatchingBraceletSet) => void;
}

export function MatchingBraceletSetCard({ set, onViewDetailsClick }: MatchingBraceletSetCardProps) {
  const isOnSale = set.originalSetPrice && set.originalSetPrice > set.setPrice;
  const discountPercent = isOnSale ? Math.round(((set.originalSetPrice! - set.setPrice) / set.originalSetPrice!) * 100) : 0;

  return (
    <Card className="relative flex h-full flex-col overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl">
      {isOnSale && (
        <Badge variant="destructive" className="absolute top-3 right-3 z-10 text-base px-3 py-1 shadow-md">
          <Percent className="mr-1 h-4 w-4" />
          {discountPercent}% OFF
        </Badge>
      )}
      <CardHeader className="p-0">
        <div className="aspect-[4/3] w-full overflow-hidden">
          <Image
            src={set.images[0]}
            alt={set.name}
            width={600}
            height={450}
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint={`${set.bracelets.map(b => b.materials.split(',')[0].trim().toLowerCase()).join(' ')} matching set`}
            priority={set.id === 'match-set-1'}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2 text-2xl font-semibold leading-tight tracking-tight">
          {set.name}
        </CardTitle>
        
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-accent">
            AED {set.setPrice.toFixed(2)}
          </span>
          {isOnSale && set.originalSetPrice && (
            <del className="text-xl text-muted-foreground/80">
              AED {set.originalSetPrice.toFixed(2)}
            </del>
          )}
        </div>

        <p className="mb-3 text-lg text-muted-foreground line-clamp-3">
          {set.description}
        </p>
        <div className="mb-3">
          <h4 className="mb-1 text-lg font-medium text-foreground/80 flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Contains {set.bracelets.length} Bracelets:
          </h4>
          <ul className="list-disc list-inside pl-1 text-base text-muted-foreground">
            {set.bracelets.map(bracelet => (
              <li key={bracelet.id}>{bracelet.name}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="default"
          size="lg"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => onViewDetailsClick(set)}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          View Set Details
        </Button>
      </CardFooter>
    </Card>
  );
}
