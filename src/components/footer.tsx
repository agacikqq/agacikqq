
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-8 text-center border-t bg-primary/10 mt-auto">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
        <p className="text-muted-foreground">&copy; {currentYear} cœzii. All rights reserved.</p>
        <Link href="/contact" className="text-lg font-medium text-primary hover:text-accent transition-colors">
          Contact Us
        </Link>
      </div>
    </footer>
  );
}

