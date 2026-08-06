import { useGsap } from '../lib/useGsap.js';
import { gsap } from '../lib/motion.js';
import { JOIN, LANDING_URL } from '../content.js';
import WaitlistForm from './WaitlistForm.jsx';

export default function Join() {
  const ref = useGsap((root) => {
    gsap.from(root.querySelectorAll('[data-in]'), {
      opacity: 0, y: 32, duration: 1, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: root, start: 'top 72%' },
    });
  });
  return (
    <section id="join" className="join" ref={ref}>
      <div className="join__glow" aria-hidden="true" />
      <div className="container join__inner">
        <p className="eyebrow" data-in>{JOIN.kicker}</p>
        <h2 className="join__title" data-in>{JOIN.title}</h2>
        <p className="join__sub" data-in>{JOIN.body}</p>
        <div className="join__form" data-in>
          <WaitlistForm id="join" dark />
        </div>
        <a className="join__browse" data-in href={LANDING_URL} target="_blank" rel="noopener noreferrer">
          {JOIN.browse}
        </a>
      </div>
    </section>
  );
}
