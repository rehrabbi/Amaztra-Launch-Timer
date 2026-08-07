import { scrollToId } from '../lib/motion.js';
import { useCountdown } from '../lib/useCountdown.js';
import { HERO, LAUNCH_ISO, LAUNCH_DATE_LABEL, LANDING_URL, CTA_LABEL, VISIT_LABEL } from '../content.js';
import { onImgError } from '../imgFallback.js';
import { Arrow } from './icons.jsx';
import Wordmark from './Wordmark.jsx';

const pad = (n) => String(n).padStart(2, '0');

function Countdown() {
  const t = useCountdown(LAUNCH_ISO);
  return (
    <div className="cd">
      <p className="cd__label">{HERO.openLabel}</p>
      <div className="cd__timer" role="timer">
        <span className="sr-only">Launching on {LAUNCH_DATE_LABEL}.</span>
        <span className="cd__day-row" aria-hidden="true">
          {/* key change retriggers the am-digit flip when the day rolls over */}
          <span className="cd__day" key={t.days}>{String(t.days)}</span>
          <span className="cd__day-lbl">Days</span>
        </span>
        <span className="cd__rule" aria-hidden="true" />
        <span className="cd__small" aria-hidden="true">
          <span>{pad(t.hours)}<span className="cd__ulbl">HRS</span></span>
          <span className="cd__slash">/</span>
          <span>{pad(t.minutes)}<span className="cd__ulbl">MIN</span></span>
          <span className="cd__slash">/</span>
          <span className="cd__sec" key={t.seconds}>{pad(t.seconds)}<span className="cd__ulbl">SEC</span></span>
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__inner">
        <a
          href="#top"
          className="hero__wordmark am-in"
          style={{ '--am-d': '1s', '--am-delay': '0.05s' }}
          onClick={(e) => { e.preventDefault(); scrollToId('top'); }}
          aria-label="AMAZTRA"
        >
          <Wordmark variant="hero" />
        </a>

        <h1 className="hero__title am-in" style={{ '--am-d': '1.1s', '--am-delay': '0.26s' }}>
          <span>{HERO.title[0]}</span>
          <span className="text-red">{HERO.title[1]}</span>
        </h1>

        <div className="hero__art am-in" style={{ '--am-d': '1.2s', '--am-delay': '0.4s' }}>
          <div className="hero__row">
            <img
              className="hero__pouch" data-pouch
              src="assets/img/pouch/clean-front.webp" onError={onImgError}
              decoding="async" fetchpriority="high"
              alt="AMAZTRA instant coffee pouch"
            />
            <img
              className="hero__box" data-box
              src="assets/img/amaztra-box.webp" onError={onImgError}
              decoding="async" fetchpriority="high"
              alt="AMAZTRA capsule pack, a glutathione and collagen food supplement"
            />
          </div>
        </div>

        <div className="am-in" style={{ '--am-d': '1.1s', '--am-delay': '0.54s' }}>
          <Countdown />
        </div>

        <p className="hero__sub am-in" style={{ '--am-d': '1.1s', '--am-delay': '0.66s' }}>
          <span>Amaztra is a <span className="text-gold">beauty-from-within coffee and capsule</span>.</span>
          <span><span className="text-gold">Six actives</span>, in a cup you brew or a capsule you take.</span>
          <span>The list <span className="text-red">walks in first</span>.</span>
        </p>

        <div className="hero__actions am-in" style={{ '--am-d': '1.1s', '--am-delay': '0.76s' }}>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => scrollToId('join')}>
            <span>{CTA_LABEL}</span><Arrow size={18} />
          </button>
          <a className="btn btn-outline btn-lg" href={LANDING_URL} target="_blank" rel="noopener noreferrer">
            {VISIT_LABEL}
          </a>
        </div>

        <p className="hero__reassure am-in" style={{ '--am-d': '1.1s', '--am-delay': '0.86s' }}>
          {HERO.reassure}
        </p>
      </div>
    </section>
  );
}
