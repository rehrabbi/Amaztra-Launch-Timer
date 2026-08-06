import { useEffect, useRef, useState } from 'react';

// Adds `.is-in` to every [data-reveal] element inside the ref once it scrolls
// into view. Native IntersectionObserver, no scroll listeners, one-shot.
// Under prefers-reduced-motion the CSS already renders everything visible.
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.matches('[data-reveal]')
      ? [root, ...root.querySelectorAll('[data-reveal]')]
      : [...root.querySelectorAll('[data-reveal]')];
    if (!els.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      // trigger a little before the element enters, so a fast scroll or a
      // deep-link never catches a blank frame
      { rootMargin: '0px 0px 8% 0px', threshold: 0.01 }
    );
    // Belt and suspenders for deep-links / reload-while-scrolled: reveal anything
    // already on screen right now, then let the observer handle the rest.
    const vh = window.innerHeight || 0;
    els.forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < vh * 1.05) el.classList.add('is-in');
      else io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return ref;
}

export function useReducedMotion() {
  const [reduce, setReduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduce(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduce;
}

export function useMediaQuery(query) {
  const [match, setMatch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

// true once the page has scrolled past `threshold`px (rAF-throttled).
export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > threshold);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

// Tracks the id of the section currently in view, for nav active states.
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [ids]);
  return active;
}
