
"use client";

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  // Ensure the component only renders on the client after theme is determined
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder or null to avoid hydration mismatch / flash
    return <div className="h-10 w-10" />; // Placeholder to maintain layout
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Sun className="h-5 w-5" aria-hidden="true" />
          )}
          <span className="sr-only">Switch to {theme === 'light' ? 'dark' : 'light'} mode</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle Dark/Light Mode</p>
      </TooltipContent>
    </Tooltip>
  );
}

