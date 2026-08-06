import { useEffect, useState } from 'react';
import { useScrolled } from '../lib/hooks.js';
import { scrollToId as go } from '../lib/motion.js';
import { CTA_LABEL } from '../content.js';
import { Arrow } from './icons.jsx';

// Mobile-only sticky CTA. Appears after the hero, hides while a form section
// (signup or final) is on screen so it never covers the field it points to.
export default function StickyCta() {
  const past = useScrolled(560);
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const targets = ['join'].map((id) => document.getElementById(id)).filter(Boolean);
    if (!targets.length) return;
    const seen = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) seen.add(e.target.id); else seen.delete(e.target.id); });
        setFormInView(seen.size > 0);
      },
      { threshold: 0.15 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const show = past && !formInView;

  return (
    <div className={`sticky-cta${show ? ' is-show' : ''}`} aria-hidden={!show}>
      <button type="button" className="btn btn-primary btn-block" tabIndex={show ? 0 : -1} onClick={() => go('join')}>
        <span>{CTA_LABEL}</span><Arrow size={17} />
      </button>
    </div>
  );
}
