import { useReveal } from '../lib/hooks.js';
import { MOREINFO, LANDING_URL } from '../content.js';
import { Arrow } from './icons.jsx';

export default function MoreInfo() {
  const ref = useReveal();
  return (
    <section id="more" className="section section--tint more" ref={ref} aria-label="Learn more about Amaztra">
      <div className="container more__inner">
        <p className="eyebrow" data-reveal>{MOREINFO.kicker}</p>
        <h2 className="h-2 more__title" data-reveal style={{ '--reveal-delay': '0.06s' }}>{MOREINFO.title}</h2>
        <p className="lede more__sub" data-reveal style={{ '--reveal-delay': '0.12s' }}>{MOREINFO.body}</p>
        <a className="btn btn-secondary btn-lg" data-reveal style={{ '--reveal-delay': '0.18s' }}
          href={LANDING_URL} target="_blank" rel="noopener noreferrer">
          <span>{MOREINFO.cta}</span><Arrow size={18} />
        </a>
      </div>
    </section>
  );
}
