
import type { Metadata } from 'next';
import { Dancing_Script } from 'next/font/google'; // Changed from Outfit to Dancing_Script
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/theme-provider';

const dancingScript = Dancing_Script({ // Changed from outfit to dancingScript
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Adjusted weights for Dancing Script
  variable: '--font-dancing-script', // Changed CSS variable name
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
      <body className={`${dancingScript.variable} font-sans antialiased flex flex-col min-h-screen bg-background`}> {/* Apply new font variable */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
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

