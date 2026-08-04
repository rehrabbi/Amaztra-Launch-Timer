// Active ingredients shown in the orbit.
// k = name, s = subtitle, b = benefit chip, d = description.
export const ING = [
  { k: 'Glutathione',       s: 'Supports healthy-looking radiance', b: 'Brightens & evens tone', d: 'Brightens and evens skin tone from within, and defends cells against everyday oxidative stress.' },
  { k: 'Collagen',          s: 'Supports skin elasticity',          b: 'Firms & plumps skin',   d: 'Supports skin structure, elasticity and that fresh, bouncy feel over time.' },
  { k: 'Astaxanthin',       s: 'Antioxidant support',               b: 'Shields from stress',   d: 'A remarkably potent antioxidant that helps protect skin from oxidative damage.' },
  { k: 'Vitamin C',         s: 'Supports collagen formation',       b: 'Boosts collagen',       d: "Powers your body's natural collagen formation and adds antioxidant support." },
  { k: 'N-Acetyl Cysteine', s: 'Supports glutathione production',   b: 'Fuels antioxidants',    d: 'Feeds your natural antioxidant system, helping glutathione do its work.' },
  { k: 'Polypodium',        s: 'Plant-based skin support',          b: 'Botanical defense',     d: 'A plant-based extract traditionally used to help support and protect skin.' },
];

export const ANGLES = [-90, -30, 30, 90, 150, 210];

// Per-serving amounts of each active, in the same order as ING.
// capsule[] are the approved label values.
// TODO(AMAZTRA): coffee[] are PLACEHOLDERS — replace with the real per-sachet amounts.
export const DOSE = {
  coffee: [50, 40, 0.5, 20, 8, 15],
  capsule: [200, 150, 2, 70, 23, 50],
};
// ONE absolute scale across both formats, so a capsule bar always reads fuller
// than the same active's coffee bar. (Highest dose anywhere = glutathione, 200 mg.)
export const DOSE_MAX = 200;

export const FORMATS = {
  coffee: { label: 'Coffee', word: 'cup.', serving: '1 sachet daily · instant coffee mix', obj: 'assets/img/pouch/1-front-cut.webp' },
  capsule: { label: 'Capsule', word: 'capsule.', serving: '1 capsule daily · higher potency', obj: 'assets/img/amaztra-box.webp' },
};

export const POUCH = 'assets/img/pouch/1-front-cut.webp';

// Outbound links used by the final CTA.
export const LINKS = {
  shop: 'https://vt.tiktok.com/ZS451WDMG/?page=TikTokShop',
};
