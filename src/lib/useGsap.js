import { useEffect, useRef } from 'react';
import { gsap, prefersReduce } from './motion.js';

// Runs a GSAP setup inside a scoped context tied to the returned ref, with
// automatic revert on unmount. Skipped entirely under reduced motion, where
// markup renders in its finished state via CSS.
export function useGsap(setup) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReduce()) return;
    const ctx = gsap.context(() => setup(root), root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}
