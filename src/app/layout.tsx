
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter for modern, readable font
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/theme-provider'; // Import ThemeProvider

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Using CSS variable for font
});

export const metadata: Metadata = {
  title: 'cœzii - Awesome Hoodies for Teens',
  description: 'Discover the coolest and most comfortable hoodies. Filter by color, size, and design.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-background`}>
        <ThemeProvider
          attribute="class" // This attribute is not directly used by the custom ThemeProvider but common in libraries like next-themes
          defaultTheme="light"
          enableSystem={false} // System theme detection not implemented in this custom provider
          storageKey="coezii-theme"
        >
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
