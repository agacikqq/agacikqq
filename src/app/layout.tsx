
import type { Metadata } from 'next';
import { Dancing_Script } from 'next/font/google'; // Changed from Great_Vibes to Dancing_Script
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/context/cart-context';
import { CartSidebar } from '@/components/cart-sidebar';

const dancingScript = Dancing_Script({ // Changed from greatVibes to dancingScript
  subsets: ['latin'],
  weight: ['400', '700'], // Dancing Script supports multiple weights
  variable: '--font-dancing-script', // Changed variable name
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
      <body className={`${dancingScript.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-2xl`}> {/* Apply new font variable */}
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

