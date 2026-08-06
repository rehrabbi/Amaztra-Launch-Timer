import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const prefersReduce = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Native scroll is kept deliberately: it is fully keyboard-operable (PageUp/Down,
// Space, Home/End, arrows) and lets anchor jumps land correctly, which a
// scroll-hijacking smooth-scroll library breaks. GSAP ScrollTrigger drives all
// the pinning and scrubbed reveals on top of native scroll.
export function initMotion() {
  // recalculate pin positions after the whole tree has mounted
  requestAnimationFrame(() => ScrollTrigger.refresh());
  return () => {};
}

// Anchor navigation. Native smooth scroll respects scroll-padding-top (set in
// index.css) so sections clear the sticky nav.
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: prefersReduce() ? 'auto' : 'smooth', block: 'start' });
}

export { gsap, ScrollTrigger };
