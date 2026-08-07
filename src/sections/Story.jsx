import { STORY } from '../content.js';

// Native position:sticky pin. The motion controller scrubs the four tagged
// elements against scroll progress through the tall section (see lib/motion.js).
export default function Story() {
  return (
    <section id="story" className="story">
      <div className="story__pin">
        <div className="container story__inner">
          <p className="story__kicker eyebrow" data-story-kicker>{STORY.kicker}</p>
          <h2 className="story__head">
            <span className="story__l1" data-story-l1>{STORY.lines[0]}</span>
            <span className="story__l2 text-red" data-story-l2>{STORY.lines[1]}</span>
          </h2>
          <p className="story__body" data-story-body>
            Amaztra tucks <span className="text-gold">six beauty actives</span> into moments you
            already keep: your <span className="text-gold">first coffee</span>, or a{' '}
            <span className="text-gold">single capsule</span>. Nothing new to remember, nothing
            extra to do.
          </p>
        </div>
      </div>
    </section>
  );
}
