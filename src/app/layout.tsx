
import type { Metadata } from 'next';
import { Great_Vibes } from 'next/font/google'; // Changed from Dancing_Script to Great_Vibes
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/context/cart-context';
import { CartSidebar } from '@/components/cart-sidebar';

const greatVibes = Great_Vibes({ // Changed from dancingScript to greatVibes
  subsets: ['latin'],
  weight: ['400'], // Great Vibes typically only has a 400 weight
  variable: '--font-great-vibes', // Changed variable name
});

export const metadata: Metadata = {
  title: 'cœzii - Awesome Hoodiez for Teens',
  description: 'Discover the coolest and most comfortable hoodiez. Filter by color, size, and design.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${greatVibes.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-2xl`}> {/* Apply new font variable */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="coezii-theme"
        >
          <CartProvider>
            <SidebarProvider>
              {children}
              <CartSidebar />
            </SidebarProvider>
          </CartProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}

