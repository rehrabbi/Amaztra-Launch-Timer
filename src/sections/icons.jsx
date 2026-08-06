// Minimal, consistent UI glyphs (stroke 1.75). Standard interface marks, not
// decorative illustration. A dedicated icon library would be the norm, but it
// would add a dependency, which is out of scope without approval.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const Arrow = ({ size = 18 }) => (
  <svg className="arrow" width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
  </svg>
);

export const Plus = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M12 5v14" /><path d="M5 12h14" />
  </svg>
);

export const Check = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="m5 12 5 5 9-9" />
  </svg>
);

export const Menu = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" />
  </svg>
);

export const Close = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M6 6 18 18" /><path d="M18 6 6 18" />
  </svg>
);

export const Spark = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M12 3v4" /><path d="M12 17v4" /><path d="M3 12h4" /><path d="M17 12h4" />
    <path d="m6.3 6.3 2.8 2.8" /><path d="m14.9 14.9 2.8 2.8" />
    <path d="m17.7 6.3-2.8 2.8" /><path d="m9.1 14.9-2.8 2.8" />
  </svg>
);
