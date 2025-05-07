
'use client';

import Link from 'next/link';
import { Shirt, ShoppingCart } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCart } from '@/context/cart-context'; // Import useCart
import { Badge } from '@/components/ui/badge'; // Import Badge for cart count
import { useEffect, useState } from 'react';


export function Header() {
  const { cartCount, toggleCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-primary/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Shirt className="h-7 w-7 text-primary-foreground" />
            <span className="inline-block text-3xl font-bold text-primary-foreground tracking-tight">
              cœzii
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-base font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            Shop All
          </Link>
          <Link href="/collections" className="text-base font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            Bracelets
          </Link>
          <Link href="/matching-bracelets" className="text-base font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            Matching Sets
          </Link>
          <Link href="/sale" className="text-base font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            Sale
          </Link>
        </nav>

        {/* Right side items: Theme Toggle, Cart & Mobile Sidebar Trigger */}
        <div className="flex items-center space-x-2">
          <ThemeToggleButton />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="View shopping cart"
                className="relative text-primary-foreground hover:bg-primary-foreground/10"
                onClick={toggleCart} 
              >
                <ShoppingCart className="h-5 w-5" />
                {mounted && cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">
                    {cartCount}
                  </Badge>
                )}
                <span className="sr-only">View Shopping Cart</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Cart ({mounted ? cartCount : 0} items)</p>
            </TooltipContent>
          </Tooltip>
          <div className="md:hidden">
             <SidebarTrigger className="text-primary-foreground hover:bg-primary-foreground/10" />
          </div>
        </div>
      </div>
    </header>
  );
}
