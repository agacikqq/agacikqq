
import type { Metadata } from 'next';
import { Poppins, Great_Vibes } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/context/cart-context';
import { CartSidebar } from '@/components/cart-sidebar';
import { PageTurnButton } from '@/components/page-turn-button'; // New import

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'], 
  variable: '--font-poppins', 
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
});

export const metadata: Metadata = {
  title: 'cœzii - Awesome Hoodiez for Teens',
  description: 'Discover the coolest and most comfortable hoodiez. Filter by color, size, and design.',
};

const pageSequence = ['/hoodies', '/sweatpants', '/collections', '/matching-bracelets'];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${poppins.variable} ${greatVibes.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-2xl`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="coezii-theme"
        >
          <CartProvider>
            <SidebarProvider>
              <div className="flex flex-col flex-1">
                {children}
              </div>
              <CartSidebar />
              <PageTurnButton pageSequence={pageSequence} />
            </SidebarProvider>
          </CartProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}

