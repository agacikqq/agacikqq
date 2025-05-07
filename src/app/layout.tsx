import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter for modern, readable font
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Using CSS variable for font
});

export const metadata: Metadata = {
  title: 'TeenHood - Awesome Hoodies for Teens',
  description: 'Discover the coolest hoodies for teens. Filter by color, size, and design.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-background`}>
        <SidebarProvider>
          {children}
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
