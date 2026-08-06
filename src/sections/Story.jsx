import { useGsap } from '../lib/useGsap.js';
import { gsap } from '../lib/motion.js';
import { STORY } from '../content.js';

export default function Story() {
  const ref = useGsap((root) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top top', end: '+=150%', pin: root.querySelector('.story__pin'), scrub: 0.6 },
    });
    tl.from(root.querySelector('.story__kicker'), { opacity: 0, y: 18, ease: 'none' })
      .from(root.querySelector('.story__l1'), { opacity: 0, yPercent: 45, ease: 'none' }, 0.1)
      .from(root.querySelector('.story__l2'), { opacity: 0, yPercent: 45, ease: 'none' }, 0.32)
      .from(root.querySelector('.story__body'), { opacity: 0, y: 24, ease: 'none' }, 0.58);
  });

  return (
    <section id="story" className="story" ref={ref}>
      <div className="story__pin">
        <div className="container story__inner">
          <p className="story__kicker eyebrow">{STORY.kicker}</p>
          <h2 className="story__head">
            <span className="story__l1">{STORY.lines[0]}</span>
            <span className="story__l2 text-red">{STORY.lines[1]}</span>
          </h2>
          <p className="story__body lede">{STORY.body}</p>
        </div>
      </div>
    </section>
  );
}
