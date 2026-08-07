// Motion controller for the soft-launch page. No animation library: one
// requestAnimationFrame-throttled scroll handler does all the reads and writes,
// straight to the DOM via cached element lookups (never through React state, so
// the page does not re-render on scroll). Native `position: sticky` handles the
// story pin; CSS keyframes handle the hero entrance and countdown digit flips.
//
// Elements are found by stable data-attributes so section components stay plain
// markup and this stays the single place that touches scroll.

export const prefersReduce = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp01 = (n) => Math.min(1, Math.max(0, n));

export function initMotion() {
  const q = (sel) => document.querySelector(sel);

  const bar = q('[data-bar]');
  const pouch = q('[data-pouch]');
  const box = q('[data-box]');
  const story = document.getElementById('story');
  const kicker = q('[data-story-kicker]');
  const l1 = q('[data-story-l1]');
  const l2 = q('[data-story-l2]');
  const body = q('[data-story-body]');
  const join = document.getElementById('join');
  const joinInner = q('[data-join-inner]');
  const joinGlow = q('[data-join-glow]');
  const sticky = q('[data-sticky]');

  const reduce = prefersReduce();
  let raf = 0;
  let joinArrived = null;

  const setEl = (el, o, t) => {
    if (!el) return;
    el.style.opacity = o;
    el.style.transform = t;
  };

  // Under reduced motion, resolve every scroll-driven element to its final,
  // fully visible state once and skip the decorative work (parallax, scrub).
  if (reduce) {
    setEl(kicker, '1', 'none');
    setEl(l1, '1', 'none');
    setEl(l2, '1', 'none');
    setEl(body, '1', 'none');
    setEl(joinInner, '1', 'none');
    if (joinGlow) {
      joinGlow.style.opacity = '1';
      joinGlow.style.transform = 'translate(-50%,-50%) scale(1)';
    }
  }

  function frame() {
    raf = 0;
    const y = window.scrollY;
    const vh = window.innerHeight;

    // 5. fixed bar slides in past the hero countdown
    if (bar) bar.style.transform = y > 220 ? 'none' : 'translateY(-101%)';

    if (!reduce) {
      // 2. hero product parallax (differing rates create depth)
      if (pouch && y < vh * 1.2) {
        pouch.style.transform = `translateY(${y * -0.07}px)`;
        if (box) box.style.transform = `translateY(${y * -0.13}px)`;
      }

      // 3. story pin scrub, keyed to progress through the tall section
      if (story) {
        const r = story.getBoundingClientRect();
        const total = story.offsetHeight - vh;
        const p = total > 0 ? clamp01(-r.top / total) : 0;
        const seg = (a, b) => clamp01((p - a) / (b - a));
        const k = seg(0, 0.08);
        setEl(kicker, k, `translateY(${(1 - k) * 16}px)`);
        const a = seg(0.06, 0.28);
        setEl(l1, a, `translateY(${(1 - a) * 45}%)`);
        const b = seg(0.22, 0.46);
        setEl(l2, b, `translateY(${(1 - b) * 45}%)`);
        const c = seg(0.42, 0.62);
        setEl(body, c, `translateY(${(1 - c) * 22}px)`);
      }
    }

    // 4. dark join section arrival (one-shot, latched on a boolean)
    let joinAway = true;
    if (join) {
      const jr = join.getBoundingClientRect();
      joinAway = jr.top > vh * 0.85;
      const arrived = jr.top < vh * 0.78;
      if (arrived !== joinArrived) {
        joinArrived = arrived;
        if (!reduce) {
          if (joinInner) {
            joinInner.style.opacity = arrived ? '1' : '0';
            joinInner.style.transform = arrived ? 'none' : 'translateY(30px)';
          }
          if (joinGlow) {
            joinGlow.style.opacity = arrived ? '1' : '0.35';
            joinGlow.style.transform = `translate(-50%,-50%) scale(${arrived ? 1 : 0.82})`;
          }
        }
      }
    }

    // mobile sticky CTA: on once past the hero, off while the join form shows
    if (sticky) {
      const on = y > 620 && joinAway;
      sticky.classList.toggle('is-on', on);
      sticky.setAttribute('aria-hidden', on ? 'false' : 'true');
    }
  }

  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    if (raf) cancelAnimationFrame(raf);
  };
}

// Anchor navigation. Native smooth scroll respects scroll-padding-top (index.css).
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: prefersReduce() ? 'auto' : 'smooth', block: 'start' });
}
