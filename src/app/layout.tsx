
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google'; // Changed from Great_Vibes
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/context/cart-context';
import { CartSidebar } from '@/components/cart-sidebar';

const poppins = Poppins({ // Changed from greatVibes
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'], // Added more weights for flexibility
  variable: '--font-poppins', // Changed variable name
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
      <body className={`${poppins.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-2xl`}> {/* Updated font variable and font-sans */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="coezii-theme"
        >
          <CartProvider>
            <SidebarProvider>
              <div className="flex flex-col flex-1"> {/* Wrapper for flex layout */}
                {children}
              </div>
              <CartSidebar />
            </SidebarProvider>
          </CartProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
