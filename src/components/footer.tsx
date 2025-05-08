
'use client';

import { useEffect, useState } from 'react';

export function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-8 text-center border-t bg-primary/10 mt-auto">
      <p className="text-muted-foreground">&copy; {currentYear} cœzii. All rights reserved.</p>
    </footer>
  );
}
