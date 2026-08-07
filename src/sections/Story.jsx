import { STORY } from '../content.js';

// The idea section. A normal centered block that shows on its own, no scroll
// pin or scrubbed reveal.
export default function Story() {
  return (
    <section id="story" className="story">
      <div className="container story__inner">
        <p className="story__kicker eyebrow">{STORY.kicker}</p>
        <h2 className="story__head">
          <span className="story__l1">{STORY.lines[0]}</span>
          <span className="story__l2 text-red">{STORY.lines[1]}</span>
        </h2>
        <p className="story__body">
          Amaztra tucks <span className="text-gold">six beauty actives</span> into moments you
          already keep: your <span className="text-gold">first coffee</span>, or a{' '}
          <span className="text-gold">single capsule</span>. Nothing new to remember, nothing
          extra to do.
        </p>
      </div>
    </section>
  );
}
