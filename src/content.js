// Original copy for this soft-launch experience. Only product FACTS are drawn
// from the existing Amaztra site (six actives, two formats, food-supplement
// honesty, maker). Every hook, headline, and sentence here is written fresh and
// is not reused from that site. No em dashes anywhere.

export const CTA_LABEL = 'Join the Waitlist';
export const VISIT_LABEL = 'Visit AMAZTRA Page';

// Real launch date. Interpreted in the visitor's local time (midnight).
export const LAUNCH_ISO = '2026-08-18T00:00:00';
export const LAUNCH_DATE_LABEL = 'August 18, 2026';

// The existing product landing page. If this experience replaces that URL,
// repoint this to wherever the product page lives.
export const LANDING_URL = 'https://amaztra.vercel.app';

export const ANNOUNCE = `Amaztra opens ${LAUNCH_DATE_LABEL}. The list gets in first.`;

export const HERO = {
  // kicker retained for reference; no longer rendered in the redesign.
  kicker: 'Soft launch',
  title: ["Your Glow's", 'Launch Date'],
  openLabel: `Doors open ${LAUNCH_DATE_LABEL}`,
  sub: 'Amaztra is a beauty-from-within coffee and capsule. Six actives, in a cup you brew or a capsule you take. The list walks in first.',
  reassure: 'One email the day we open. Nothing else.',
  visit: 'Visit AMAZTRA Page',
};

export const STORY = {
  kicker: 'The idea',
  lines: ['The best routine', 'is the one you forget you have.'],
  body: 'Amaztra tucks six beauty actives into moments you already keep: your first coffee, or a single capsule. Nothing new to remember, nothing extra to do.',
};

// Placeholder years for the first two beats; the launch beat is the real date.
export const TIMELINE = [
  { year: 'year', label: 'The idea', body: 'Where it began: skincare that asks nothing of you.', placeholder: true },
  { year: 'year', label: 'The formula', body: 'Six actives, balanced across coffee and capsule.', placeholder: true },
  { year: 'August 2026', label: 'The soft launch', body: 'The first release, opened to the list.', placeholder: false },
];

// Six actives, rewritten in original wording (facts preserved from the product).
export const ACTIVES = [
  { key: 'glutathione', name: 'Glutathione', chip: 'Brightens tone', meta: 'The headline antioxidant', desc: 'A well-known brightening antioxidant that helps even out the look of your skin over time.' },
  { key: 'collagen', name: 'Collagen', chip: 'Firmness', meta: 'Structure and bounce', desc: 'Supports the skin structure that keeps it looking supple, the part that fades as the years add up.' },
  { key: 'astaxanthin', name: 'Astaxanthin', chip: 'Defense', meta: 'A deep-coloured shield', desc: 'A richly pigmented antioxidant that helps skin hold up to the small stresses of every day.' },
  { key: 'vitc', name: 'Vitamin C', chip: 'Radiance', meta: 'As sodium ascorbate', desc: 'Feeds your skin natural collagen-making and layers on bright antioxidant support.' },
  { key: 'nac', name: 'N-Acetyl-Cysteine', chip: 'Antioxidant fuel', meta: 'Behind the scenes', desc: 'Helps your body top up its own glutathione, the antioxidant quietly doing the work.' },
  { key: 'polypodium', name: 'Polypodium Leucotomos', chip: 'Botanical', meta: 'A fern extract', desc: 'A plant extract long used to help skin stand up to sun and daily strain.' },
];

export const WAYS = [
  {
    key: 'coffee',
    name: 'The Coffee',
    serving: '1 sachet daily',
    note: 'Instant coffee mix',
    body: 'A cup you would pour anyway, with the actives already stirred in.',
    img: 'assets/img/pouch/clean-front.webp',
    alt: 'AMAZTRA instant coffee pouch',
  },
  {
    key: 'capsule',
    name: 'The Capsule',
    serving: '1 capsule daily',
    note: 'Higher potency',
    body: 'One small capsule when you want the higher dose and none of the fuss.',
    img: 'assets/img/amaztra-box.webp',
    alt: 'AMAZTRA capsule box',
  },
];

export const TRUST = {
  kicker: 'The honest part',
  title: 'We are not selling overnight.',
  body: 'Amaztra works from the inside, slowly, and only as well as the rest of your habits: sunscreen, sleep, water, a decent plate. It is a food supplement with no approved therapeutic claims. Real, and honest about it.',
  maker: 'Amazing Pharma Corporation',
  makerLogo: 'assets/img/apc-logo.webp',
};

export const JOIN = {
  kicker: 'Join the waitlist',
  title: 'Get in before the doors open.',
  body: `Leave your email. On ${LAUNCH_DATE_LABEL}, the people on this list hear first and step in before anyone else.`,
  browse: 'Prefer to look around first? Visit AMAZTRA Page',
};

// Instead of reproducing the product FAQ and full ingredient detail here, this
// section invites visitors to the existing site for the complete information.
export const MOREINFO = {
  kicker: 'The full picture',
  title: 'There is more to Amaztra.',
  body: 'The ingredient science, how the coffee and capsule fit into a day, and every question you might have, it all lives on the site.',
  cta: 'Visit AMAZTRA Page',
};

export const FINAL = {
  kicker: LAUNCH_DATE_LABEL,
  title: 'The doors are almost open.',
  body: 'Add your name, and be on the right side of them.',
};

export const NAV_LINKS = [
  { id: 'story', label: 'Story' },
];

export const FOOTER_NOTE =
  'AMAZTRA is a food supplement with no approved therapeutic claims. Use alongside a balanced diet and a healthy lifestyle.';
