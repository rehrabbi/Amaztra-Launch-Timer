import { useEffect, useRef, useState } from 'react';
import { useNearViewport, usePauseOffscreen } from '../useLazyVideo.js';

const EASE = 'cubic-bezier(.16,1,.3,1)';
const prefersReduce = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// One Origin section, two formats behind a toggle. The shared headline ("Beauty
// shouldn't feel like work") carries the thesis; the payoff line, copy and clip
// swap per format. objPos biases the cover crop so the model's face clears the
// top edge of the landscape media frame.
const STORY = {
  coffee: {
    eyebrow: 'The origin',
    headLead: 'feel like',      // headline line 3 reads "feel like [strikeWord]"
    strikeWord: 'work',
    punch: 'it should brew.',
    desc: 'Self-care quietly became a chore. But you never skipped the first warm cup, so we folded the actives right into it.',
    video: 'assets/video/origin-coffee-opt.mp4',
    poster: 'assets/video/origin-coffee-poster.jpg',
    objPos: '50% 22%',
  },
  capsule: {
    eyebrow: 'The origin',
    headLead: 'feel',
    strikeWord: 'complicated',
    punch: 'it should come in a capsule.',
    desc: '',                   // capsule closes on the payoff line, no body copy
    video: 'assets/video/origin-opt.mp4',
    poster: 'assets/video/origin-poster.jpg',
    objPos: '50% 26%',
  },
};

// Coffee / Capsule format toggle: a gold thumb slides between the two, the labels
// crossfade, the active option pulses, and each tap gives a small press bounce.
// Styling lives in index.css (.origin-toggle / .origin-tab) so :hover and :active
// affordance works. Shared by both layouts.
function OriginToggle({ fmt, setFmt }) {
  const thumbRef = useRef(null);
  const prev = useRef(fmt);
  useEffect(() => {
    if (prev.current === fmt) return;
    prev.current = fmt;
    const t = thumbRef.current;
    if (t && !prefersReduce()) {
      t.animate([
        { boxShadow: '0 6px 16px rgba(201,154,52,.35)' },
        { boxShadow: '0 10px 30px rgba(246,227,154,.85)', offset: 0.5 },
        { boxShadow: '0 6px 16px rgba(201,154,52,.35)' },
      ], { duration: 560, easing: 'ease-out' });
    }
  }, [fmt]);
  return (
    <div className="origin-toggle" data-fmt={fmt} role="tablist" aria-label="Choose format">
      <span ref={thumbRef} className="origin-toggle__thumb" aria-hidden="true" />
      {['coffee', 'capsule'].map((k) => (
        <button key={k} type="button" role="tab" aria-selected={fmt === k}
          className={'origin-tab' + (fmt === k ? ' is-on' : '')} onClick={() => setFmt(k)}>{k}</button>
      ))}
    </div>
  );
}

/**
 * Origin — "Editorial Depth". Two columns: a vertical "THE ORIGIN" rail and the
 * stacked headline on the left, the looping brew clip masking in from the right.
 * On view the eyebrow fades in, the headline lines flip up out of their clips, a
 * red strike wipes across "work", the gold punch line rises and catches an ember
 * glow with sparks, and the media reveals bottom-up. Ambient embers drift up the
 * panel. Type matches the site: Anton headline/punch, Space Grotesk rail and
 * body. The video is a marked placeholder slot, a real mp4 at
 * assets/video/brew.mp4 will play automatically. Reduced motion shows all at rest.
 */
function StoryDesktop() {
  const rootRef = useRef(null);
  const emberRef = useRef(null);
  const coffeeVidRef = useRef(null);
  const capsuleVidRef = useRef(null);
  const punchRef = useRef(null);
  const descRef = useRef(null);
  const sweepRef = useRef(null);
  const prevFmt = useRef('coffee');
  const [fmt, setFmt] = useState('coffee');
  const cfg = STORY[fmt];
  const near = useNearViewport(rootRef);
  usePauseOffscreen(rootRef, [coffeeVidRef, capsuleVidRef], prefersReduce());

  // Toggle transition: cross-dissolve the two video layers with a directional
  // clip-wipe, run a coloured light sweep across the frame (warm toward coffee,
  // clean gold toward capsule), and re-enter the payoff line with an ember flash.
  // Guard on the previous value (not a flipped boolean) so React StrictMode's
  // double-invoked mount effect never fires the transition on load.
  useEffect(() => {
    if (prevFmt.current === fmt) return;
    prevFmt.current = fmt;
    const show = fmt === 'capsule' ? capsuleVidRef.current : coffeeVidRef.current;
    const hide = fmt === 'capsule' ? coffeeVidRef.current : capsuleVidRef.current;
    const punch = punchRef.current, desc = descRef.current, sweep = sweepRef.current;
    [show, hide, punch, desc, sweep].forEach((el) => { if (el) el.getAnimations().forEach((a) => a.cancel()); });
    if (prefersReduce()) {
      if (show) show.style.opacity = '1';
      if (hide) hide.style.opacity = '0';
      return;
    }
    const EO = 'cubic-bezier(.16,1,.3,1)';
    const toCapsule = fmt === 'capsule';
    const dir = toCapsule ? 1 : -1;                 // capsule wipes L->R, coffee R->L
    if (show && hide) {
      show.style.opacity = '1';
      show.animate([
        { opacity: 0, transform: 'scale(1.07)', clipPath: dir > 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' },
        { opacity: 1, offset: 0.55 },
        { opacity: 1, transform: 'scale(1)', clipPath: 'inset(0 0 0 0)' },
      ], { duration: 900, easing: EO, fill: 'both' });
      hide.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 560, easing: 'ease', fill: 'both' });
    }
    if (sweep) {
      sweep.style.background = toCapsule
        ? 'linear-gradient(90deg,transparent,rgba(246,227,154,.9),transparent)'
        : 'linear-gradient(90deg,transparent,rgba(226,58,52,.5),rgba(246,183,74,.85),transparent)';
      sweep.animate([
        { transform: `translateX(${dir > 0 ? '-140%' : '140%'}) skewX(-14deg)`, opacity: 0 },
        { opacity: 1, offset: 0.35 },
        { transform: `translateX(${dir > 0 ? '140%' : '-140%'}) skewX(-14deg)`, opacity: 0 },
      ], { duration: 780, easing: EO, fill: 'both' });
    }
    // payoff line re-enters (no blur: it is background-clip:text) with an ember pop
    if (punch) {
      punch.animate([
        { opacity: 0, transform: 'translateY(24px) scale(.955)' },
        { opacity: 1, transform: 'none' },
      ], { duration: 720, delay: 140, easing: 'cubic-bezier(.2,1.1,.3,1)', fill: 'both' });
    }
    if (desc) {
      if (cfg.desc) {
        desc.animate([
          { opacity: 0, transform: 'translateY(14px)', filter: 'blur(4px)' },
          { opacity: 1, transform: 'none', filter: 'blur(0)' },
        ], { duration: 620, delay: 220, easing: EO, fill: 'both' });
      } else {
        desc.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 340, easing: 'ease', fill: 'both' });
      }
    }
  }, [fmt]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = prefersReduce();
    const eyebrow = root.querySelector('[data-eyebrow]');
    const cws = [...root.querySelectorAll('.story-cw')];
    const strike = root.querySelector('[data-strike]');
    const punch = root.querySelector('[data-punch]');
    const desc = root.querySelector('[data-desc]');
    const media = root.querySelector('[data-media]');
    const vid = root.querySelector('[data-media] video');
    const sparks = root.querySelector('[data-sparks]');
    const timers = [];

    if (!reduce) {
      const host = emberRef.current;
      if (host && !host.childElementCount) {
        for (let i = 0; i < 14; i++) {
          const s = document.createElement('span');
          const sz = 2 + Math.random() * 3.5, gold = Math.random() > 0.4;
          s.style.cssText = 'position:absolute;bottom:-10px;left:' + (Math.random() * 100) + '%;width:' + sz.toFixed(1) + 'px;height:' + sz.toFixed(1) + 'px;border-radius:50%;background:' + (gold ? 'radial-gradient(circle,rgba(246,183,74,.9),transparent)' : 'radial-gradient(circle,rgba(226,58,52,.85),transparent)') + ';box-shadow:0 0 7px ' + (gold ? 'rgba(246,183,74,.55)' : 'rgba(226,58,52,.5)') + ';--dx:' + (Math.random() * 80 - 40).toFixed(0) + 'px;animation:o-embed ' + (9 + Math.random() * 8).toFixed(1) + 's ease-in-out ' + (Math.random() * 9).toFixed(1) + 's infinite;';
          host.appendChild(s);
        }
      }
    }

    const spawnSparks = () => {
      if (!sparks || sparks.childElementCount) return;
      for (let i = 0; i < 12; i++) {
        const s = document.createElement('span');
        const sz = 2 + Math.random() * 2.5;
        s.style.cssText = 'position:absolute;bottom:' + (Math.random() * 30) + '%;left:' + (20 + Math.random() * 60) + '%;width:' + sz.toFixed(1) + 'px;height:' + sz.toFixed(1) + 'px;border-radius:50%;background:radial-gradient(circle,rgba(246,227,154,.95),rgba(226,58,52,.3));box-shadow:0 0 6px rgba(246,183,74,.7);--dx:' + (Math.random() * 30 - 15).toFixed(0) + 'px;animation:o-spark ' + (2 + Math.random() * 2).toFixed(1) + 's ease-out ' + (Math.random() * 2.5).toFixed(1) + 's infinite;';
        sparks.appendChild(s);
      }
    };

    const showAll = () => {
      if (eyebrow) eyebrow.style.opacity = '1';
      cws.forEach((el) => { el.style.transform = 'none'; el.style.opacity = '1'; });
      if (strike) strike.style.transform = 'rotate(-3deg) scaleX(1)';
      if (punch) punch.style.opacity = '1';
      if (desc) desc.style.opacity = '1';
      if (media) media.style.clipPath = 'inset(0 0 0 0)';
    };
    if (reduce) { showAll(); return; }

    const hide = () => {
      [eyebrow, punch, strike, desc, media, ...cws].forEach((el) => { if (el) el.getAnimations().forEach((a) => a.cancel()); });
      timers.forEach(clearTimeout); timers.length = 0;
      if (eyebrow) eyebrow.style.opacity = '0';
      cws.forEach((el) => { el.style.transform = 'translateY(110%)'; el.style.opacity = '0'; });
      if (strike) strike.style.transform = 'rotate(-3deg) scaleX(0)';
      if (punch) { punch.style.opacity = '0'; punch.style.animation = 'none'; }
      if (desc) desc.style.opacity = '0';
      if (media) media.style.clipPath = 'inset(0 0 100% 0)';
      if (vid) { vid.getAnimations().forEach((a) => a.cancel()); vid.style.transform = 'scale(1.14)'; }
    };

    const play = () => {
      hide();
      if (eyebrow) eyebrow.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 1400, delay: 300, easing: EASE, fill: 'both' });
      if (media) media.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 2000, delay: 300, easing: EASE, fill: 'both' });
      if (vid) vid.animate([{ transform: 'scale(1.14)' }, { transform: 'scale(1)' }], { duration: 3200, delay: 300, easing: EASE, fill: 'both' });
      cws.forEach((el, i) => el.animate([
        { opacity: 0, transform: 'translateY(110%)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 1400, delay: 700 + i * 260, easing: 'cubic-bezier(.2,1,.3,1)', fill: 'both' }));
      if (strike) timers.push(setTimeout(() => strike.animate([{ transform: 'rotate(-3deg) scaleX(0)' }, { transform: 'rotate(-3deg) scaleX(1)' }], { duration: 820, easing: EASE, fill: 'both' }), 2100));
      if (punch) {
        punch.animate([{ opacity: 0, transform: 'translateY(28px) scale(.955)' }, { opacity: 1, transform: 'none' }], { duration: 1500, delay: 2300, easing: 'cubic-bezier(.2,1.1,.3,1)', fill: 'both' });
        timers.push(setTimeout(() => { punch.style.animation = 'ember 3.4s ease-in-out infinite'; spawnSparks(); }, 3700));
      }
      if (desc) desc.animate([{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }], { duration: 1400, delay: 2800, easing: EASE, fill: 'both' });
    };

    hide();
    const io = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (e.isIntersecting) { play(); io.disconnect(); }
    }), { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    io.observe(root);
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, []);

  return (
    <section
      id="story"
      ref={rootRef}
      className="fullpage"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        background: '#141210',
        padding: 'clamp(64px,9vh,120px) clamp(24px,6vw,80px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        textAlign: 'left', fontFamily: "'Space Grotesk',system-ui,sans-serif", overflow: 'hidden',
      }}
    >
      {/* warm spotlight carried up from Ritual so the two beats share one light */}
      <span aria-hidden="true" style={{ position: 'absolute', left: '-20%', top: '-32%', width: '110%', height: '140%', borderRadius: '50%', background: 'radial-gradient(closest-side,rgba(246,183,74,.15),rgba(246,183,74,.05) 44%,transparent 72%)', filter: 'blur(20px)', pointerEvents: 'none', zIndex: 0, animation: 'rt-spot 13s ease-in-out infinite' }} />
      {/* ambient ember field + top seam fade */}
      <div ref={emberRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }} />
      <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '46vh', background: 'linear-gradient(180deg,#141210 0%,#141210 20%,rgba(20,18,16,.55) 55%,transparent 100%)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="story-grid" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr .82fr', alignItems: 'center', gap: 0 }}>
        {/* left: rail + stacked headline + punch + desc */}
        <div style={{ position: 'relative', zIndex: 2, minWidth: 0, display: 'flex', gap: 'clamp(18px,2vw,26px)' }}>
          <span data-eyebrow className="story-rail" style={{ opacity: 0, writingMode: 'vertical-rl', transform: 'rotate(180deg)', alignSelf: 'flex-start', paddingTop: '4px', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 500, fontSize: '12px', letterSpacing: '.24em', textTransform: 'uppercase', color: '#C6A24C', whiteSpace: 'nowrap' }}>{cfg.eyebrow}</span>

          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, fontFamily: "'Anton',sans-serif", textTransform: 'uppercase', fontSize: 'clamp(40px,5.4vw,66px)', lineHeight: 1.16, letterSpacing: '-.02em', color: '#EDE4D3' }}>
              <span style={{ display: 'block', overflow: 'hidden' }}><span className="story-cw" style={{ display: 'inline-block', opacity: 0, transform: 'translateY(110%)' }}>Beauty</span></span>
              <span style={{ display: 'block', overflow: 'hidden' }}><span className="story-cw" style={{ display: 'inline-block', opacity: 0, transform: 'translateY(110%)' }}>shouldn&rsquo;t</span></span>
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <span className="story-cw" style={{ display: 'inline-block', opacity: 0, transform: 'translateY(110%)' }}>
                  {cfg.headLead}{' '}
                  <span style={{ position: 'relative', color: '#8f8578' }}>
                    {cfg.strikeWord}
                    <span data-strike aria-hidden="true" style={{ position: 'absolute', left: '-4%', right: '-4%', top: '52%', height: 'clamp(5px,.7vw,9px)', background: '#E23A34', transform: 'rotate(-3deg) scaleX(0)', transformOrigin: 'left' }} />
                  </span>
                </span>
              </span>
            </h2>

            <p ref={punchRef} id="story-punch" data-punch style={{ opacity: 0, position: 'relative', margin: 'clamp(16px,2.4vh,26px) 0 0', fontFamily: "'Anton',sans-serif", textTransform: 'uppercase', fontSize: 'clamp(48px,6.4vw,84px)', lineHeight: 0.9, letterSpacing: '-.01em', background: 'linear-gradient(180deg,#F6E39A,#A9761B)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', zIndex: 3 }}>
              {cfg.punch}
              <span data-sparks aria-hidden="true" style={{ position: 'absolute', inset: '-30% 0 0', pointerEvents: 'none' }} />
            </p>

            <p ref={descRef} data-desc style={{ opacity: 0, margin: 'clamp(24px,4vh,36px) 0 0', maxWidth: '38ch', fontSize: 'clamp(15px,1.6vw,18px)', lineHeight: 1.6, color: '#cfc4b2' }}>
              {cfg.desc}
            </p>

            <div style={{ marginTop: 'clamp(22px,3.4vh,34px)' }}>
              <OriginToggle fmt={fmt} setFmt={setFmt} />
            </div>
          </div>
        </div>

        {/* right: brew clip masking in, pulled left so the punch line overlaps its frame */}
        <div className="story-media-wrap" style={{ position: 'relative', zIndex: 1, minWidth: 0, height: 'clamp(380px,58vh,520px)', marginLeft: 'clamp(-96px,-6vw,-64px)' }}>
          <span aria-hidden="true" style={{ position: 'absolute', inset: '-12%', borderRadius: '50%', background: 'radial-gradient(circle,rgba(226,58,52,.3),rgba(246,183,74,.12) 46%,transparent 70%)', filter: 'blur(34px)', pointerEvents: 'none', animation: 'glow-pulse 6s ease-in-out infinite' }} />
          <div data-media className="story-media" style={{ position: 'relative', height: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(246,227,154,.22)', boxShadow: '0 34px 70px rgba(0,0,0,.55)', background: 'linear-gradient(160deg,#2a1c15,#171310)', clipPath: 'inset(0 0 100% 0)' }}>
            <video ref={coffeeVidRef} src={near ? STORY.coffee.video : undefined} poster={STORY.coffee.poster} autoPlay loop muted playsInline preload="none" tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: STORY.coffee.objPos, display: 'block', zIndex: 1 }} />
            <video ref={capsuleVidRef} src={near ? STORY.capsule.video : undefined} poster={STORY.capsule.poster} autoPlay loop muted playsInline preload="none" tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: STORY.capsule.objPos, display: 'block', opacity: 0, zIndex: 1 }} />
            <span ref={sweepRef} aria-hidden="true" style={{ position: 'absolute', top: '-10%', bottom: '-10%', left: 0, width: '60%', opacity: 0, pointerEvents: 'none', mixBlendMode: 'screen', filter: 'blur(6px)', zIndex: 2 }} />
            <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 60px rgba(0,0,0,.35)', borderRadius: 'inherit', zIndex: 3 }} />          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ MOBILE (1c — Cinematic full-bleed) ============================ */

function useIsMobile(bp = 767) {
  const q = `(max-width:${bp}px)`;
  const [m, setM] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

function StoryMobile() {
  const rootRef = useRef(null);
  const pillRef = useRef(null);
  const headRef = useRef(null);
  const strikeRef = useRef(null);
  const punchRef = useRef(null);
  const descRef = useRef(null);
  const coffeeVidRef = useRef(null);
  const capsuleVidRef = useRef(null);
  const prevFmt = useRef('coffee');
  const [fmt, setFmt] = useState('coffee');
  const cfg = STORY[fmt];
  const reduce = prefersReduce();
  const near = useNearViewport(rootRef);
  usePauseOffscreen(rootRef, [coffeeVidRef, capsuleVidRef], reduce);

  // Toggle transition: cross-dissolve the two full-bleed clips with a directional
  // clip-wipe and re-enter the payoff line and copy. Prev-value guard keeps
  // StrictMode's double-mount from firing it on load.
  useEffect(() => {
    if (prevFmt.current === fmt) return;
    prevFmt.current = fmt;
    const show = fmt === 'capsule' ? capsuleVidRef.current : coffeeVidRef.current;
    const hide = fmt === 'capsule' ? coffeeVidRef.current : capsuleVidRef.current;
    const punch = punchRef.current, desc = descRef.current;
    [show, hide, punch, desc].forEach((el) => { if (el) el.getAnimations().forEach((a) => a.cancel()); });
    if (prefersReduce()) {
      if (show) show.style.opacity = '1';
      if (hide) hide.style.opacity = '0';
      return;
    }
    const EO = 'cubic-bezier(.16,1,.3,1)';
    const dir = fmt === 'capsule' ? 1 : -1;
    if (show && hide) {
      show.style.opacity = '1';
      show.animate([
        { opacity: 0, clipPath: dir > 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' },
        { opacity: 1, offset: 0.6 },
        { opacity: 1, clipPath: 'inset(0 0 0 0)' },
      ], { duration: 820, easing: EO, fill: 'both' });
      hide.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 520, easing: 'ease', fill: 'both' });
    }
    if (punch) punch.animate([{ opacity: 0, transform: 'translateY(22px) scale(.955)' }, { opacity: 1, transform: 'none' }], { duration: 680, delay: 120, easing: 'cubic-bezier(.2,1.1,.3,1)', fill: 'both' });
    if (desc) {
      if (cfg.desc) desc.animate([{ opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 560, delay: 200, easing: EO, fill: 'both' });
      else desc.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, easing: 'ease', fill: 'both' });
    }
  }, [fmt]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const pill = pillRef.current, head = headRef.current, strike = strikeRef.current, punch = punchRef.current, desc = descRef.current;
    const EO = 'cubic-bezier(.16,1,.3,1)';
    const showAll = () => {
      [pill, head, punch, desc].forEach((el) => { if (el) { el.style.opacity = '1'; el.style.transform = 'none'; } });
      if (strike) strike.style.transform = 'rotate(-3deg) scaleX(1)';
    };
    if (reduce) { showAll(); return; }
    const hide = () => {
      [pill, head, punch, desc].forEach((el) => { if (el) el.style.opacity = '0'; });
      if (strike) strike.style.transform = 'rotate(-3deg) scaleX(0)';
    };
    let timer = 0;
    const play = () => {
      if (pill) pill.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 300, easing: EO, fill: 'both' });
      if (head) head.animate([{ opacity: 0, transform: 'translateY(22px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 1100, delay: 550, easing: EO, fill: 'both' });
      if (strike) timer = setTimeout(() => strike.animate([{ transform: 'rotate(-3deg) scaleX(0)' }, { transform: 'rotate(-3deg) scaleX(1)' }], { duration: 800, easing: EO, fill: 'both' }), 1250);
      if (punch) punch.animate([{ opacity: 0, transform: 'translateY(30px) scale(.955)' }, { opacity: 1, transform: 'none' }], { duration: 1200, delay: 1100, easing: 'cubic-bezier(.2,1.1,.3,1)', fill: 'both' });
      if (desc) desc.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 1000, delay: 1550, easing: EO, fill: 'both' });
    };
    hide();
    const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { play(); io.disconnect(); } }), { rootMargin: '-30% 0px -30% 0px', threshold: 0 });
    io.observe(root);
    return () => { io.disconnect(); clearTimeout(timer); };
  }, [reduce]);

  return (
    <section id="story" ref={rootRef} className="fullpage" style={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden', background: '#141210', fontFamily: "'Space Grotesk',system-ui,sans-serif" }}>
      <style>{`@keyframes st-ken{from{transform:scale(1.03) translateY(0)}to{transform:scale(1.18) translateY(-16px)}}`}</style>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, animation: reduce ? 'none' : 'st-ken 16s ease-in-out infinite alternate' }}>
        <video ref={coffeeVidRef} src={near ? STORY.coffee.video : undefined} poster={STORY.coffee.poster} autoPlay={!reduce} loop muted playsInline preload="none" tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: STORY.coffee.objPos, display: 'block' }} />
        <video ref={capsuleVidRef} src={near ? STORY.capsule.video : undefined} poster={STORY.capsule.poster} autoPlay={!reduce} loop muted playsInline preload="none" tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: STORY.capsule.objPos, display: 'block', opacity: 0 }} />
      </div>
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(18,15,13,.5) 0%,rgba(18,15,13,0) 26%,rgba(18,15,13,.5) 58%,rgba(18,15,13,.94) 100%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 clamp(24px,7vw,34px) clamp(48px,8vh,72px)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span ref={pillRef} style={{ alignSelf: 'flex-start', opacity: reduce ? 1 : 0, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '13px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#C6A24C' }}>{cfg.eyebrow}</span>
        <h2 ref={headRef} style={{ margin: '6px 0 0', opacity: reduce ? 1 : 0, fontFamily: "'Anton',sans-serif", textTransform: 'uppercase', fontSize: 'clamp(34px,10vw,46px)', lineHeight: 1.04, letterSpacing: '-.01em', color: '#EDE4D3', textShadow: '0 2px 20px rgba(0,0,0,.6)' }}>Beauty shouldn&rsquo;t {cfg.headLead} <span style={{ position: 'relative', color: '#8f8578' }}>{cfg.strikeWord}<span ref={strikeRef} aria-hidden="true" style={{ position: 'absolute', left: '-4%', right: '-4%', top: '52%', height: 'clamp(5px,1.6vw,8px)', background: '#E23A34', transform: 'rotate(-3deg) scaleX(0)', transformOrigin: 'left' }} /></span></h2>
        <p ref={punchRef} style={{ margin: '4px 0 0', opacity: reduce ? 1 : 0, fontFamily: "'Anton',sans-serif", textTransform: 'uppercase', fontSize: 'clamp(50px,15vw,64px)', lineHeight: 0.86, letterSpacing: '-.01em', background: 'linear-gradient(180deg,#F6E39A,#A9761B)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{cfg.punch}</p>
        <p ref={descRef} style={{ margin: '10px 0 0', opacity: reduce ? 1 : 0, maxWidth: '40ch', fontSize: 'clamp(14px,4vw,16px)', lineHeight: 1.6, color: '#e9e0d0', textShadow: '0 1px 10px rgba(0,0,0,.7)' }}>{cfg.desc}</p>
        <div style={{ marginTop: '6px' }}>
          <OriginToggle fmt={fmt} setFmt={setFmt} />
        </div>
      </div>
    </section>
  );
}

export default function Story() {
  const isMobile = useIsMobile(767);
  return isMobile ? <StoryMobile /> : <StoryDesktop />;
}
