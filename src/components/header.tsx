import Link from 'next/link';
import { Shirt } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-primary/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Shirt className="h-7 w-7 text-primary-foreground" />
            <span className="inline-block text-2xl font-bold text-primary-foreground tracking-tight">
              TeenHood
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="md:hidden">
             <SidebarTrigger className="text-primary-foreground hover:bg-primary-foreground/10" />
          </div>
        </div>
      </div>
    </header>
  );
}
