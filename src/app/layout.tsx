
import type { Metadata } from 'next';
import { Dancing_Script } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/context/cart-context';
import { CartSidebar } from '@/components/cart-sidebar';

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Dancing Script has limited weights, but specifying helps if available
  variable: '--font-dancing-script',
});

export const metadata: Metadata = {
  title: 'cœzii - Awesome Hoodies for Teens', // Updated title
  description: 'Discover the coolest and most comfortable hoodies. Filter by color, size, and design.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${dancingScript.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-2xl`}> {/* Apply new font variable and base text size */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="coezii-theme" // Updated storageKey
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

