
'use client';

import Image from 'next/image';
import type { Bracelet } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface BraceletCardProps {
  bracelet: Bracelet;
  onViewDetailsClick: (bracelet: Bracelet) => void;
}

export function BraceletCard({ bracelet, onViewDetailsClick }: BraceletCardProps) {
  return (
    <Card className="relative flex h-full flex-col overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="aspect-[3/4] w-full overflow-hidden">
          <Image
            src={bracelet.images[0]}
            alt={bracelet.name}
            width={400}
            height={533}
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint={`${bracelet.materials.toLowerCase()} bracelet jewelry`}
            priority={bracelet.id === 'bracelet-1' || bracelet.id === 'bracelet-2'} // Prioritize first few images
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2 text-2xl font-semibold leading-tight tracking-tight">
          {bracelet.name}
        </CardTitle>
        
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-accent">
            ${bracelet.basePrice.toFixed(2)}
          </span>
          <span className="text-lg text-muted-foreground">(Base Price)</span>
        </div>

        <p className="mb-3 text-lg text-muted-foreground line-clamp-2">
          {bracelet.description}
        </p>
        <div>
          <h4 className="mb-1 text-lg font-medium text-foreground/80">Materials:</h4>
          <p className="text-base text-muted-foreground">{bracelet.materials}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="default"
          size="lg"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => onViewDetailsClick(bracelet)}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          View Details & Charms
        </Button>
      </CardFooter>
    </Card>
  );
}
