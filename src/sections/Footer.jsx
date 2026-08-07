import { NAV_LINKS, FOOTER_NOTE, CTA_LABEL, VISIT_LABEL, LANDING_URL } from '../content.js';
import { LINKS } from '../data.js';
import { scrollToId as go } from '../lib/motion.js';
import Wordmark from './Wordmark.jsx';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Wordmark variant="footer" />
          <p>Beauty-from-within coffee and capsule.</p>
        </div>
        <nav className="footer__nav" aria-label="Footer">
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={(e) => { e.preventDefault(); go(l.id); }}>{l.label}</a>
              </li>
            ))}
            <li>
              <a href="#join" onClick={(e) => { e.preventDefault(); go('join'); }}>{CTA_LABEL}</a>
            </li>
            <li>
              <a href={LANDING_URL} target="_blank" rel="noopener noreferrer">{VISIT_LABEL}</a>
            </li>
            <li>
              <a href={LINKS.shop} target="_blank" rel="noopener noreferrer">Shop on TikTok</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container footer__base">
        <p className="footer__note">{FOOTER_NOTE}</p>
        <p className="footer__copy">© {year} AMAZTRA. Made by Amazing Pharma Corporation.</p>
      </div>
    </footer>
  );
}
