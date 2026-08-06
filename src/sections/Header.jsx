import { useEffect, useRef, useState } from 'react';
import { useScrolled, useActiveSection } from '../lib/hooks.js';
import { scrollToId } from '../lib/motion.js';
import { NAV_LINKS, CTA_LABEL, ANNOUNCE } from '../content.js';
import { Menu, Close, Arrow } from './icons.jsx';

export default function Header() {
  const scrolled = useScrolled(24);
  const [menuOpen, setMenuOpen] = useState(false);
  const [announce, setAnnounce] = useState(true);
  const active = useActiveSection(NAV_LINKS.map((l) => l.id));
  const panelRef = useRef(null);
  const burgerRef = useRef(null);

  useEffect(() => {
    try { setAnnounce(sessionStorage.getItem('amaztra_announce_closed') !== '1'); } catch { /* noop */ }
  }, []);

  const closeAnnounce = () => {
    setAnnounce(false);
    try { sessionStorage.setItem('amaztra_announce_closed', '1'); } catch { /* noop */ }
  };

  // mobile menu: body scroll-lock, ESC to close, focus trap, restore focus
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const panel = panelRef.current;
    const focusables = panel ? panel.querySelectorAll('a[href], button:not([disabled])') : [];
    if (focusables.length) focusables[0].focus();

    const onKey = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); return; }
      if (e.key === 'Tab' && focusables.length) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      if (burgerRef.current) burgerRef.current.focus();
    };
  }, [menuOpen]);

  const go = (id) => { setMenuOpen(false); scrollToId(id); };

  return (
    <header className="hdr">
      <a className="skip-link" href="#main">Skip to content</a>

      {announce && (
        <div className="announce">
          <p>{ANNOUNCE}</p>
          <button type="button" className="announce__x" onClick={closeAnnounce} aria-label="Dismiss announcement">
            <Close size={16} />
          </button>
        </div>
      )}

      <nav className={`nav${scrolled ? ' is-scrolled' : ''}`} aria-label="Primary">
        <div className="nav__inner container">
          <a href="#top" className="nav__brand" onClick={(e) => { e.preventDefault(); go('top'); }}>AMAZTRA</a>

          <ul className="nav__links">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className={active === l.id ? 'is-active' : undefined}
                  onClick={(e) => { e.preventDefault(); go(l.id); }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav__right">
            <button type="button" className="btn btn-primary nav__cta" onClick={() => go('join')}>
              {CTA_LABEL}
            </button>
            <button
              ref={burgerRef}
              type="button"
              className="nav__burger"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </nav>

      {/* mobile menu */}
      <div className={`mnav${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <button type="button" className="mnav__scrim" tabIndex={-1} aria-label="Close menu" onClick={() => setMenuOpen(false)} />
        <div className="mnav__panel" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" ref={panelRef}>
          <div className="mnav__top">
            <span className="nav__brand">AMAZTRA</span>
            <button type="button" className="mnav__x" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <Close />
            </button>
          </div>
          <ul className="mnav__links">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={(e) => { e.preventDefault(); go(l.id); }}>{l.label}</a>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-primary btn-block" onClick={() => go('join')}>
            <span>{CTA_LABEL}</span><Arrow size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
