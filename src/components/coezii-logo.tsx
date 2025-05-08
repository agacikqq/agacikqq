
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
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
          .coezii-text-base {
            font-family: 'Poppins', var(--font-poppins), sans-serif;
            font-size: 40px; /* Adjusted size for Poppins */
            font-weight: 700; /* Bolder weight */
            letter-spacing: -0.5px; /* Slight adjustment for Poppins */
          }
          .coezii-text-shadow {
            fill: hsl(var(--foreground) / 0.3);
            transform: translate(1px, 1px);
          }
          .coezii-text-main {
            fill: url(#coeziiGradient);
            filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.15)); /* Softer shadow */
          }
        `}
      </style>
      {/* Apply base class and specific classes */}
      <text x="5" y="40" className="coezii-text-base coezii-text-shadow">cœzii</text>
      <text x="5" y="40" className="coezii-text-base coezii-text-main">cœzii</text>
    </svg>
  );
}
