import { useEffect, useRef, useState } from 'react';

const prefersReduce = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function useIsMobile(bp = 767) {
  const q = `(max-width:${bp}px)`;
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

/* ---- shared content ---------------------------------------------------- */

const SPECS = {
  coffee: [
    ['FORMAT', 'Instant coffee mix'],
    ['SERVING', '1 sachet daily'],
    ['BEST FOR', 'Keeping the habit'],
  ],
  capsule: [
    ['FORMAT', 'Capsule'],
    ['SERVING', '1 capsule daily'],
    ['BEST FOR', 'Maximum potency'],
  ],
};

function SpecRows({ rows }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 500, fontSize: '12.5px' }}>
      {rows.map(([k, v]) => (
        <div key={k} style={{
          display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '8px 0',
          borderTop: '1px dashed rgba(237,228,211,.14)',
        }}>
          <span style={{ color: '#8f8578' }}>{k}</span>
          <span style={{ color: '#EDE4D3', textAlign: 'right' }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Panel — one product, one format. Coffee is red-forward, capsule gold-forward:
 * identical card architecture so neither reads as the add-on.
 */
function Panel({ kind, panelRef, reduce, clip }) {
  const isCoffee = kind === 'coffee';
  return (
    <div ref={panelRef} style={{
      position: 'relative', display: 'flex', flexDirection: 'column',
      borderRadius: '14px', overflow: 'hidden',
      border: isCoffee ? '1px solid rgba(226,58,52,.28)' : '1px solid rgba(198,162,76,.34)',
      background: isCoffee
        ? 'linear-gradient(165deg, rgba(226,58,52,.10), rgba(237,228,211,.02) 58%)'
        : 'linear-gradient(165deg, rgba(198,162,76,.12), rgba(237,228,211,.02) 58%)',
      boxShadow: '0 20px 44px rgba(0,0,0,.5)',
      clipPath: reduce ? 'none' : clip,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 20px',
        background: isCoffee ? '#E23A34' : 'linear-gradient(180deg,#F6E39A 0%,#E1BC5C 38%,#C99A34 62%,#A9761B 100%)',
      }}>
        <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(17px,1.5vw,20px)', letterSpacing: '.05em', color: '#141210' }}>
          {isCoffee ? 'THE COFFEE' : 'THE CAPSULE'}
        </span>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 500, fontSize: '12px', color: '#141210' }}>
          {isCoffee ? 'DAILY' : 'HIGHER DOSE'}
        </span>
      </div>

      <div style={{
        flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(120px,150px) minmax(0,1fr)',
        gap: 'clamp(14px,1.6vw,20px)', padding: '20px 22px 22px', alignItems: 'center',
      }}>
        <div style={{ position: 'relative', height: '100%', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span aria-hidden="true" style={{
            position: 'absolute', inset: '-6%', borderRadius: '50%', filter: 'blur(26px)', pointerEvents: 'none',
            background: isCoffee
              ? 'radial-gradient(circle, rgba(226,58,52,.30), transparent 68%)'
              : 'radial-gradient(circle, rgba(246,183,74,.30), transparent 68%)',
          }} />
          <img
            src={isCoffee ? 'assets/img/pouch/clean-front.png' : 'assets/img/amaztra-box.png'}
            alt={isCoffee ? 'AMAZTRA instant coffee pouch' : 'AMAZTRA capsule box'}
            style={{
              position: 'relative', maxHeight: 'min(220px,30vh)', width: 'auto',
              filter: 'drop-shadow(0 16px 26px rgba(0,0,0,.6))',
              animation: reduce ? 'none' : (isCoffee ? 'am-float 9s ease-in-out infinite' : 'am-float2 10s ease-in-out infinite'),
            }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ margin: 0, fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(15px,1.8vw,19px)', lineHeight: 1.2, color: '#EDE4D3' }}>
            {isCoffee ? 'The ritual you already have.' : 'The same actives, concentrated.'}
          </p>
          <SpecRows rows={isCoffee ? SPECS.coffee : SPECS.capsule} />
        </div>
      </div>
    </div>
  );
}

/**
 * Two ways — the payoff of the hero's "brew AND take". Equal billing: the two
 * panels share one card architecture, mirrored, and wipe in from opposite edges
 * as the divider draws down between them. Red carries the coffee, gold the
 * capsule, so the formats read as siblings without a third colour entering.
 */
function TwoWaysDesktop() {
  const rootRef = useRef(null);
  const headRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const seamRef = useRef(null);
  const andRef = useRef(null);
  const reduce = prefersReduce();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const EO = 'cubic-bezier(.16,1,.3,1)';
    const words = [...root.querySelectorAll('.tw-w')];

    if (reduce) {
      words.forEach((el) => { el.style.opacity = '1'; });
      [leftRef, rightRef].forEach((r) => { if (r.current) { r.current.style.opacity = '1'; r.current.style.clipPath = 'none'; } });
      if (andRef.current) andRef.current.style.opacity = '1';
      return;
    }

    const play = () => {
      words.forEach((el, i) => el.animate(
        [{ opacity: 0, transform: 'translateY(26px)' }, { opacity: 1, transform: 'none' }],
        { duration: 1000, delay: 120 + i * 170, easing: EO, fill: 'both' }));
      // the red "and" lands in the seam the panels are about to open
      if (andRef.current) andRef.current.animate(
        [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1.3)', offset: .6 }, { opacity: 1, transform: 'scale(1)' }],
        { duration: 640, delay: 820, easing: 'cubic-bezier(.2,1.5,.35,1)', fill: 'both' });
      // a light seam strikes down the centre, then fades as the halves part
      if (seamRef.current) seamRef.current.animate([
        { opacity: 0, transform: 'scaleY(0)' },
        { opacity: 1, transform: 'scaleY(1)', offset: .28 },
        { opacity: 1, transform: 'scaleY(1)', offset: .62 },
        { opacity: 0, transform: 'scaleY(1)' },
      ], { duration: 1600, delay: 700, easing: EO, fill: 'both' });
      // each panel unclips outward from the seam, so the pair reads as one object dividing
      if (leftRef.current) leftRef.current.animate(
        [{ clipPath: 'inset(0 0 0 100%)', transform: 'translateX(28px)' }, { clipPath: 'inset(0 0 0 0)', transform: 'none' }],
        { duration: 1150, delay: 1050, easing: EO, fill: 'both' });
      if (rightRef.current) rightRef.current.animate(
        [{ clipPath: 'inset(0 100% 0 0)', transform: 'translateX(-28px)' }, { clipPath: 'inset(0 0 0 0)', transform: 'none' }],
        { duration: 1150, delay: 1050, easing: EO, fill: 'both' });
    };

    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { play(); io.disconnect(); } });
    }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });
    io.observe(root);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <section
      id="two-ways"
      ref={rootRef}
      className="fullpage"
      style={{
        position: 'relative', background: '#141210',
        padding: 'clamp(64px,9vh,110px) clamp(24px,6vw,80px) clamp(40px,6vh,64px)',
        fontFamily: "'Space Grotesk',system-ui,sans-serif", overflow: 'hidden',
      }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <span style={{ position: 'absolute', left: '-20%', top: '-40%', width: '140%', height: '160%', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(246,183,74,.13), rgba(246,183,74,.05) 44%, transparent 72%)', filter: 'blur(22px)' }} />
        <span className="am-noise" style={{ opacity: 0.07 }} />
        <span style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '28vh', background: 'linear-gradient(180deg,#141210 0%,#141210 14%,rgba(20,18,16,.55) 55%,transparent 100%)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1180px', margin: '0 auto', width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p className="tw-w" style={{ margin: 0, opacity: 0, fontWeight: 600, fontSize: '13px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#C6A24C' }}>Two formats</p>
          <h2 className="tw-w fp-head" style={{
            margin: '14px 0 0', opacity: 0, fontFamily: "'Anton',sans-serif", textTransform: 'uppercase',
            fontSize: 'clamp(40px,5.4vw,66px)', lineHeight: 0.9, letterSpacing: '.01em', color: '#EDE4D3',
          }}>Brew it <span ref={andRef} style={{ display: 'inline-block', opacity: reduce ? 1 : 0, color: '#E23A34' }}>and</span> take it.</h2>
          <p className="tw-w" style={{ margin: '16px auto 0', opacity: 0, maxWidth: '52ch', fontSize: 'clamp(15px,1.7vw,18px)', lineHeight: 1.55, color: '#cfc4b2', textWrap: 'pretty' }}>
            The same six actives, two ways in. One you drink every morning. One you swallow when you want the higher dose.
          </p>
        </div>

        <div className="tw-grid" style={{
          position: 'relative', marginTop: 'clamp(24px,4vh,34px)', alignItems: 'stretch',
          display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'clamp(20px,3vw,40px)',
        }}>
          <span ref={seamRef} aria-hidden="true" style={{
            position: 'absolute', left: '50%', top: '-6px', bottom: '-6px', width: '2px', marginLeft: '-1px',
            opacity: 0, transformOrigin: 'center', pointerEvents: 'none',
            background: 'linear-gradient(180deg,transparent,#F6E39A 20%,#F6E39A 80%,transparent)',
            boxShadow: '0 0 18px 3px rgba(246,227,154,.6)',
          }} />
          <Panel kind="coffee" panelRef={leftRef} reduce={reduce} clip="inset(0 0 0 100%)" />
          <Panel kind="capsule" panelRef={rightRef} reduce={reduce} clip="inset(0 100% 0 0)" />
        </div>

        <p style={{ margin: 'clamp(16px,2.6vh,22px) 0 0', textAlign: 'center', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 500, fontSize: '11px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#8f8578' }}>
          No approved therapeutic claims
        </p>
      </div>
    </section>
  );
}

/* ============================ MOBILE ============================ */

function TwoWaysMobile() {
  const rootRef = useRef(null);
  const oneRef = useRef(null);
  const twoRef = useRef(null);
  const seamRef = useRef(null);
  const andRef = useRef(null);
  const reduce = prefersReduce();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const EO = 'cubic-bezier(.16,1,.3,1)';
    const words = [...root.querySelectorAll('.tw-w')];
    const cards = [oneRef.current, twoRef.current];

    if (reduce) {
      words.forEach((el) => { el.style.opacity = '1'; });
      cards.forEach((el) => { if (el) el.style.clipPath = 'none'; });
      if (andRef.current) andRef.current.style.opacity = '1';
      return;
    }
    const play = () => {
      words.forEach((el, i) => el.animate(
        [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'none' }],
        { duration: 900, delay: 150 + i * 170, easing: EO, fill: 'both' }));
      if (andRef.current) andRef.current.animate(
        [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1.3)', offset: .6 }, { opacity: 1, transform: 'scale(1)' }],
        { duration: 600, delay: 700, easing: 'cubic-bezier(.2,1.5,.35,1)', fill: 'both' });
      // stacked, so the seam runs across and the cards unclip away from it
      if (seamRef.current) seamRef.current.animate([
        { opacity: 0, transform: 'scaleX(0)' },
        { opacity: 1, transform: 'scaleX(1)', offset: .3 },
        { opacity: 1, transform: 'scaleX(1)', offset: .64 },
        { opacity: 0, transform: 'scaleX(1)' },
      ], { duration: 1500, delay: 620, easing: EO, fill: 'both' });
      cards.forEach((el, i) => { if (el) el.animate(
        [{ clipPath: i === 0 ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)', transform: i === 0 ? 'translateY(20px)' : 'translateY(-20px)' },
         { clipPath: 'inset(0 0 0 0)', transform: 'none' }],
        { duration: 1050, delay: 980, easing: EO, fill: 'both' }); });
    };
    const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { play(); io.disconnect(); } }),
      { rootMargin: '-25% 0px -25% 0px', threshold: 0 });
    io.observe(root);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <section id="two-ways" ref={rootRef} className="fullpage" style={{
      position: 'relative', minHeight: '100dvh', overflow: 'hidden', background: '#141210',
      padding: 'clamp(40px,7vh,64px) clamp(22px,6vw,28px) clamp(28px,5vh,40px)',
      justifyContent: 'center', fontFamily: "'Space Grotesk',system-ui,sans-serif",
    }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <span style={{ position: 'absolute', left: '-30%', top: '-20%', width: '160%', height: '120%', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(246,183,74,.13), transparent 70%)', filter: 'blur(24px)' }} />
        <span className="am-noise" style={{ opacity: 0.07 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px,2.4vh,22px)' }}>
        <div>
          <p className="tw-w" style={{ margin: 0, opacity: 0, fontWeight: 600, fontSize: '12.5px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#C6A24C' }}>Two formats</p>
          <h2 className="tw-w fp-head" style={{ margin: '12px 0 0', opacity: 0, fontFamily: "'Anton',sans-serif", textTransform: 'uppercase', fontSize: 'clamp(36px,10.5vw,50px)', lineHeight: 0.92, letterSpacing: '-.01em', color: '#EDE4D3' }}>Brew it <span ref={andRef} style={{ display: 'inline-block', opacity: reduce ? 1 : 0, color: '#E23A34' }}>and</span><br />take it.</h2>
          <p className="tw-w" style={{ margin: '12px 0 0', opacity: 0, fontSize: 'clamp(14px,4vw,16px)', lineHeight: 1.55, color: '#cfc4b2', textWrap: 'pretty' }}>
            The same six actives, two ways in. One you drink every morning. One you swallow when you want the higher dose.
          </p>
        </div>

        <MobileCard kind="coffee" cardRef={oneRef} reduce={reduce} clip="inset(100% 0 0 0)" />
        <span ref={seamRef} aria-hidden="true" style={{
          height: '2px', margin: '-1px 0', opacity: 0, transformOrigin: 'center',
          background: 'linear-gradient(90deg,transparent,#F6E39A 20%,#F6E39A 80%,transparent)',
          boxShadow: '0 0 16px 3px rgba(246,227,154,.55)',
        }} />
        <MobileCard kind="capsule" cardRef={twoRef} reduce={reduce} clip="inset(0 0 100% 0)" />

        <p style={{ margin: 0, textAlign: 'center', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 500, fontSize: '10.5px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#8f8578' }}>
          No approved therapeutic claims
        </p>
      </div>
    </section>
  );
}

function MobileCard({ kind, cardRef, reduce, clip }) {
  const isCoffee = kind === 'coffee';
  return (
    <div ref={cardRef} style={{
      display: 'flex', borderRadius: '14px', overflow: 'hidden', clipPath: reduce ? 'none' : clip,
      border: isCoffee ? '1px solid rgba(226,58,52,.28)' : '1px solid rgba(198,162,76,.34)',
      background: isCoffee
        ? 'linear-gradient(165deg, rgba(226,58,52,.10), rgba(237,228,211,.02) 58%)'
        : 'linear-gradient(165deg, rgba(198,162,76,.12), rgba(237,228,211,.02) 58%)',
      boxShadow: '0 18px 38px rgba(0,0,0,.5)',
    }}>
      <div style={{
        flexShrink: 0, width: '38%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '14px 8px',
        background: isCoffee ? 'rgba(226,58,52,.10)' : 'rgba(198,162,76,.10)',
      }}>
        <span aria-hidden="true" style={{
          position: 'absolute', inset: '4%', borderRadius: '50%', filter: 'blur(20px)',
          background: isCoffee ? 'radial-gradient(circle, rgba(226,58,52,.30), transparent 68%)' : 'radial-gradient(circle, rgba(246,183,74,.30), transparent 68%)',
        }} />
        <img
          src={isCoffee ? 'assets/img/pouch/clean-front.png' : 'assets/img/amaztra-box.png'}
          alt={isCoffee ? 'AMAZTRA instant coffee pouch' : 'AMAZTRA capsule box'}
          style={{ position: 'relative', maxHeight: '128px', width: 'auto', filter: 'drop-shadow(0 12px 20px rgba(0,0,0,.6))' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0, padding: '14px 16px 14px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ fontFamily: "'Anton',sans-serif", fontSize: '17px', letterSpacing: '.04em', color: isCoffee ? '#E23A34' : '#C6A24C' }}>
            {isCoffee ? 'THE COFFEE' : 'THE CAPSULE'}
          </span>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 500, fontSize: '10px', letterSpacing: '.06em', color: '#8f8578' }}>
            {isCoffee ? 'DAILY' : 'HIGHER DOSE'}
          </span>
        </div>
        <p style={{ margin: 0, fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: '15px', lineHeight: 1.25, color: '#EDE4D3' }}>
          {isCoffee ? 'The ritual you already have.' : 'The same actives, concentrated.'}
        </p>
        <SpecRows rows={isCoffee ? SPECS.coffee : SPECS.capsule} />
      </div>
    </div>
  );
}

export default function TwoWays() {
  const isMobile = useIsMobile(767);
  return isMobile ? <TwoWaysMobile /> : <TwoWaysDesktop />;
}
