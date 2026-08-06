import { useGsap } from '../lib/useGsap.js';
import { gsap, scrollToId } from '../lib/motion.js';
import { useCountdown } from '../lib/useCountdown.js';
import { HERO, LAUNCH_ISO, LAUNCH_DATE_LABEL, LANDING_URL, CTA_LABEL } from '../content.js';
import { onImgError } from '../imgFallback.js';
import { Arrow } from './icons.jsx';

const pad = (n) => String(n).padStart(2, '0');

function Countdown() {
  const t = useCountdown(LAUNCH_ISO);
  const units = [
    { v: t.days, l: 'Days' },
    { v: t.hours, l: 'Hours' },
    { v: t.minutes, l: 'Minutes' },
    { v: t.seconds, l: 'Seconds' },
  ];
  return (
    <div className="cd" role="timer">
      <span className="sr-only">Launching on {LAUNCH_DATE_LABEL}.</span>
      {units.map((u, i) => (
        <span className="cd__group" key={u.l} aria-hidden="true">
          {i > 0 && <span className="cd__sep">:</span>}
          <span className="cd__unit">
            <span className="cd__num">{pad(u.v)}</span>
            <span className="cd__lbl">{u.l}</span>
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Hero() {
  const ref = useGsap((root) => {
    gsap.from(root.querySelectorAll('[data-hero-in]'), {
      y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.1,
    });
  });

  return (
    <section id="top" className="hero" ref={ref}>
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__inner">
        <p className="eyebrow" data-hero-in>{HERO.kicker}</p>

        <h1 className="hero__title" data-hero-in>
          {HERO.title[0]} <span className="text-red">{HERO.title[1]}</span>
        </h1>

        <div className="hero__art" data-hero-in>
          <div className="hero__art-inner">
            <img className="hero__box float-2" src="assets/img/amaztra-box.webp" onError={onImgError}
              decoding="async" fetchpriority="high"
              alt="AMAZTRA capsule pack, a glutathione and collagen food supplement" />
            <img className="hero__pouch float" src="assets/img/pouch/clean-front.webp" onError={onImgError}
              decoding="async" fetchpriority="high"
              alt="AMAZTRA instant coffee pouch" />
          </div>
        </div>

        <div className="hero__cd" data-hero-in>
          <p className="hero__cd-label">{HERO.openLabel}</p>
          <Countdown />
        </div>

        <p className="hero__sub" data-hero-in>{HERO.sub}</p>

        <div className="hero__actions" data-hero-in>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => scrollToId('join')}>
            <span>{CTA_LABEL}</span><Arrow size={18} />
          </button>
          <a className="btn btn-ghost" href={LANDING_URL} target="_blank" rel="noopener noreferrer">
            {HERO.visit}
          </a>
        </div>

        <p className="hero__reassure" data-hero-in>{HERO.reassure}</p>
      </div>
    </section>
  );
}
