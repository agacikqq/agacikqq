
import type { SVGProps } from 'react';

export function CoeziiLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      aria-label="cœzii logo"
      role="img"
      {...props}
    >
      <defs>
        <linearGradient id="coeziiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
          .coezii-text {
            font-family: 'Great Vibes', var(--font-great-vibes), cursive;
            font-size: 48px;
            fill: url(#coeziiGradient);
            filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.2));
          }
          .coezii-text-shadow {
            font-family: 'Great Vibes', var(--font-great-vibes), cursive;
            font-size: 48px;
            fill: hsl(var(--foreground) / 0.3);
            transform: translate(1px, 1px);
          }
        `}
      </style>
      <text x="5" y="40" className="coezii-text-shadow">cœzii</text>
      <text x="5" y="40" className="coezii-text">cœzii</text>
    </svg>
  );
}
