
import Link from 'next/link';
import { Shirt } from 'lucide-react'; // Icon can be reviewed later if "Shirt" doesn't fit "cœzii"
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggleButton } from '@/components/theme-toggle-button'; // Import ThemeToggleButton

export function Header() {
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
          <Link href="/" className="text-base font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            Collections
          </Link>
          <Link href="/sale" className="text-base font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            Sale
          </Link>
        </nav>

        {/* Right side items: Theme Toggle & Mobile Sidebar Trigger */}
        <div className="flex items-center space-x-2">
          <ThemeToggleButton />
          <div className="md:hidden">
             <SidebarTrigger className="text-primary-foreground hover:bg-primary-foreground/10" />
          </div>
        </div>
      </div>
    </header>
  );
}
