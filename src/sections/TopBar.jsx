import { useEffect, useState } from 'react';
import { scrollToId } from '../lib/motion.js';
import { ANNOUNCE, CTA_LABEL } from '../content.js';
import { Close } from './icons.jsx';
import Wordmark from './Wordmark.jsx';

// Replaces the old nav. Two pieces:
//  - the dismissible announcement bar (persisted to sessionStorage)
//  - a thin fixed bar that the motion controller slides down once the user
//    scrolls past the hero countdown (transform toggled via [data-bar]).
export default function TopBar() {
  const [announce, setAnnounce] = useState(true);

  useEffect(() => {
    try {
      setAnnounce(sessionStorage.getItem('amaztra_announce_closed') !== '1');
    } catch { /* noop */ }
  }, []);

  const closeAnnounce = () => {
    setAnnounce(false);
    try { sessionStorage.setItem('amaztra_announce_closed', '1'); } catch { /* noop */ }
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      {announce && (
        <div className="announce">
          <p>{ANNOUNCE}</p>
          <button type="button" className="announce__x" onClick={closeAnnounce} aria-label="Dismiss announcement">
            <Close size={15} />
          </button>
        </div>
      )}

      <div className="bar" data-bar>
        <div className="bar__inner container">
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); scrollToId('top'); }}
            aria-label="AMAZTRA, back to top"
          >
            <Wordmark variant="bar" />
          </a>
          <button type="button" className="bar__cta" onClick={() => scrollToId('join')}>
            {CTA_LABEL}
          </button>
        </div>
      </div>
    </>
  );
}
