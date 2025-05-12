
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The key={pathname} will cause this main element and its children to re-render
  // when the pathname changes, effectively re-triggering the animation.
  return (
    <main key={pathname} className="flex-1 animate-fadeIn">
      {children}
    </main>
  );
}
