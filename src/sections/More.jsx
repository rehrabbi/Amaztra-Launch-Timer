import { LANDING_URL, VISIT_LABEL, TRUST } from '../content.js';
import { onImgError } from '../imgFallback.js';
import { Arrow } from './icons.jsx';

// The old "honest part" and "full picture" sections merged into one continuous
// cream block. One eyebrow, two paragraphs (the second a step lighter so it
// reads as a continuation), then the outlined CTA and maker credit side by side.
export default function More() {
  return (
    <section id="more" className="more" aria-label="Honest by design">
      <div className="container">
        <div className="more__inner">
          <p className="eyebrow">{TRUST.kicker}</p>
          <h2 className="more__title">We are not selling <span className="text-red">overnight</span>.</h2>
          <p className="more__body">
            Amaztra works from the inside, <span className="text-red">slowly</span>, and only as
            well as the rest of your habits: sunscreen, sleep, water, a decent plate. It is a{' '}
            <span className="text-gold">food supplement</span> with no approved therapeutic claims.
            Real, and honest about it.
          </p>
          <p className="more__body2">
            The ingredient science, how the <span className="text-gold">coffee and capsule</span>{' '}
            fit into a day, and every question you might have, it all lives on the site.
          </p>
          <div className="more__row">
            <a className="btn btn-outline btn-lg" href={LANDING_URL} target="_blank" rel="noopener noreferrer">
              <span>{VISIT_LABEL}</span><Arrow size={18} />
            </a>
            <div className="more__maker">
              <img src={TRUST.makerLogo} onError={onImgError} loading="lazy" decoding="async" height="28" alt={`${TRUST.maker} logo`} />
              <span>Made by {TRUST.maker}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
