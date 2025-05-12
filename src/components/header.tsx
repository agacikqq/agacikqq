
'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, Package, History } from 'lucide-react'; 
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CoeziiLogo } from '@/components/coezii-logo'; 


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
            <CoeziiLogo className="h-10 w-auto text-primary-foreground group-hover:opacity-80 transition-opacity duration-300" />
            <span className="inline-block text-4xl font-bold text-primary-foreground tracking-tight">
              cœzii
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-x-6 lg:gap-x-8">
          <Link href="/browse/all-items" className="text-lg font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors flex items-center gap-1">
             <Package className="h-5 w-5" /> All Productz
          </Link>
          <Link href="/hoodies" className="text-lg font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            Hoodiez
          </Link>
           <Link href="/sweatpants" className="text-lg font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            Sweatpantz
          </Link>
          <Link href="/collections" className="text-lg font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            Braceletz
          </Link>
          <Link href="/matching-bracelets" className="text-lg font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            Matching Setz
          </Link>
          <Link href="/salez" className="text-lg font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            Salez
          </Link>
          <Link href="/past-orders" className="text-lg font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors flex items-center gap-1">
            <History className="h-5 w-5" /> Past Orderz
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
                  <Link href="/browse/all-items" className="text-base flex items-center gap-2"><Package className="h-4 w-4" /> All Productz</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/hoodies" className="text-base">Hoodiez</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/sweatpants" className="text-base">Sweatpantz</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/collections" className="text-base">Braceletz</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/matching-bracelets" className="text-base">Matching Setz</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/salez" className="text-base">Salez</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/past-orders" className="text-base flex items-center gap-2"><History className="h-4 w-4" /> Past Orderz</Link>
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
