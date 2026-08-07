import { JOIN, LANDING_URL, LAUNCH_DATE_LABEL } from '../content.js';
import WaitlistForm from './WaitlistForm.jsx';

// Dark waitlist section. The glow and inner content are animated on arrival by
// the motion controller (data-join-glow / data-join-inner); everything else is
// plain markup. Emphasis uses the light-red on-dark accent.
export default function Join() {
  return (
    <section id="join" className="join">
      <div className="join__glow" data-join-glow aria-hidden="true" />
      <div className="join__inner" data-join-inner>
        <div className="container join__box">
          <p className="eyebrow eyebrow--dark">{JOIN.kicker}</p>
          <h2 className="join__title">{JOIN.title}</h2>
          <p className="join__sub">
            Leave your email. On <span className="text-red-on-dark">{LAUNCH_DATE_LABEL}</span>, the
            people on this list <span className="text-red-on-dark">hear first</span> and step in
            before anyone else.
          </p>

          <div className="join__form">
            <WaitlistForm id="join" dark />
          </div>

          <a className="join__browse" href={LANDING_URL} target="_blank" rel="noopener noreferrer">
            {JOIN.browse}
          </a>
        </div>
      </div>
    </section>
  );
}
