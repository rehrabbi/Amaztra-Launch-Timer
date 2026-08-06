import { useGsap } from '../lib/useGsap.js';
import { gsap } from '../lib/motion.js';
import { TRUST } from '../content.js';
import { onImgError } from '../imgFallback.js';

export default function Trust() {
  const ref = useGsap((root) => {
    gsap.from(root.querySelectorAll('[data-in]'), {
      opacity: 0, y: 28, duration: 0.9, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: root, start: 'top 74%' },
    });
  });
  return (
    <section className="section trust" ref={ref} aria-label="Honest by design">
      <div className="container trust__inner">
        <p className="eyebrow" data-in>{TRUST.kicker}</p>
        <h2 className="h-2 measure" data-in>{TRUST.title}</h2>
        <p className="lede" data-in>{TRUST.body}</p>
        <div className="trust__maker" data-in>
          <img src={TRUST.makerLogo} onError={onImgError} loading="lazy" decoding="async" height="34" alt={`${TRUST.maker} logo`} />
          <span>Made by {TRUST.maker}</span>
        </div>
      </div>
    </section>
  );
}
