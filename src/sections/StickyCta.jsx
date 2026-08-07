import { scrollToId as go } from '../lib/motion.js';
import { CTA_LABEL } from '../content.js';
import { Arrow } from './icons.jsx';

// Mobile-only sticky CTA. Visibility is driven by the motion controller, which
// toggles `.is-on` (and aria-hidden) via [data-sticky] once past the hero and
// while the join form is off screen. CSS limits it to <=820px.
export default function StickyCta() {
  return (
    <div className="sticky" data-sticky aria-hidden="true">
      <button type="button" className="btn btn-primary btn-block" onClick={() => go('join')}>
        <span>{CTA_LABEL}</span><Arrow size={17} />
      </button>
    </div>
  );
}
