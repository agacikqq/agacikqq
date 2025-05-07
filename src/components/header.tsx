
'use client';

import Link from 'next/link';
import { Shirt, ShoppingCart, Menu } from 'lucide-react'; // Added Menu for mobile trigger
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export function Header() {
  const { cartCount, toggleCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-primary/90 backdrop-blur-lg shadow-md">
      <TooltipProvider>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <Shirt className="h-8 w-8 text-primary-foreground group-hover:animate-pulse" />
            <span className="inline-block text-4xl font-bold text-primary-foreground tracking-tight">
              TeenHood
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-x-6 lg:gap-x-8">
          <Link href="/hoodies" className="text-lg font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            Hoodies
          </Link>
          <Link href="/collections" className="text-lg font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            Bracelets
          </Link>
          <Link href="/matching-bracelets" className="text-lg font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            Matching Sets
          </Link>
          <Link href="/sale" className="text-lg font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            Sale
          </Link>
        </nav>

        {/* Right side items: Theme Toggle, Cart & Mobile Sidebar/Dropdown Trigger */}
        <div className="flex items-center space-x-3">
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
                <ShoppingCart className="h-6 w-6" />
                {mounted && cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">
                    {cartCount > 9 ? '9+' : cartCount}
                  </Badge>
                )}
                <span className="sr-only">View Shopping Cart</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Cart ({mounted ? cartCount : 0} items)</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Mobile Navigation Dropdown */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/hoodies" className="text-base">Hoodies</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/collections" className="text-base">Bracelets</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/matching-bracelets" className="text-base">Matching Sets</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/sale" className="text-base">Sale</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      </TooltipProvider>
    </header>
  );
}
