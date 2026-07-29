import { useEffect, useRef, useState } from 'react';

/**
 * Latches true once `ref` enters an expanded viewport margin. Use it to defer
 * assigning a <video> src until its section approaches, so below-the-fold clips
 * never download on first paint. Loads roughly one viewport ahead of arrival so
 * the poster never flashes before the clip is ready.
 */
export function useNearViewport(ref, rootMargin = '120% 0px') {
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setNear(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); }
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, near, rootMargin]);
  return near;
}

/**
 * Pauses the given <video> refs when `sectionRef` leaves the viewport and resumes
 * them when it returns, to stop offscreen decode work. Only touches videos that
 * already have a source, plays muted (catching the autoplay promise), and is a
 * no-op under reduced motion, where the clips are meant to sit at rest.
 */
export function usePauseOffscreen(sectionRef, videoRefs, reduce) {
  // stable ref array identity so the effect is not re-created every render
  const refsRef = useRef(videoRefs);
  refsRef.current = videoRefs;
  useEffect(() => {
    if (reduce) return;
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      const visible = entries[0] && entries[0].isIntersecting;
      (refsRef.current || []).forEach((r) => {
        const v = r && r.current;
        if (!v || !v.currentSrc) return;
        if (visible) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
        else v.pause();
      });
    }, { rootMargin: '0px', threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [sectionRef, reduce]);
}
