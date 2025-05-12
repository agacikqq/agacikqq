
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRightCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageTurnButtonProps {
  pageSequence: string[];
}

export function PageTurnButton({ pageSequence }: PageTurnButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(pageSequence.includes(pathname));
  }, [pathname, pageSequence]);

  const handleTurnPage = () => {
    const currentIndex = pageSequence.indexOf(pathname);
    if (currentIndex === -1) { // Current page not in sequence
        // Optionally, navigate to the first page in sequence if button is somehow shown
        // router.push(pageSequence[0]);
        return;
    }

    const nextIndex = (currentIndex + 1) % pageSequence.length;
    const nextPage = pageSequence[nextIndex];

    setIsAnimating(true);
    router.push(nextPage);

    // Reset animation state after a short delay.
    // This is useful if the component instance persists across navigations.
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300); // Corresponds to animation duration

    return () => clearTimeout(timer);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      variant="default"
      size="icon"
      className={cn(
        "fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl z-50",
        "bg-accent text-accent-foreground hover:bg-accent/90",
        "focus:ring-4 focus:ring-accent/50 focus:outline-none",
        "transition-all duration-300 ease-in-out",
        isAnimating ? 'scale-110 brightness-110 animate-pulse' : 'scale-100 brightness-100'
      )}
      onClick={handleTurnPage}
      aria-label="Next product category page"
    >
      <ArrowRightCircle className="h-8 w-8" />
    </Button>
  );
}
