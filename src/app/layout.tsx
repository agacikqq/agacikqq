
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google'; // Changed from Dancing_Script to Outfit
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/context/cart-context';
import { CartSidebar } from '@/components/cart-sidebar';

const outfit = Outfit({ // Changed from dancingScript to outfit
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit', // Changed CSS variable name
});

export const metadata: Metadata = {
  title: 'TeenHood - Awesome Hoodies for Teens', // Updated title
  description: 'Discover the coolest and most comfortable hoodies. Filter by color, size, and design.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${outfit.variable} font-sans antialiased flex flex-col min-h-screen bg-background`}> {/* Apply new font variable */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="teenhood-theme" // Updated storageKey
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
