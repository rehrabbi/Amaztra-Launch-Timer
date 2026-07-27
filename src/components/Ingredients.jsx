import { useEffect, useRef, useState } from 'react';
import { ING, ANGLES, POUCH, DOSE, DOSE_MAX, FORMATS } from '../data.js';

const R = 42; // desktop orbit radius, percent
const FMTS = ['coffee', 'capsule'];
const doseText = (v) => (v < 1 ? v.toFixed(1) : Math.round(v)) + ' mg';
// Perceptual (square-root) scale against the single 200 mg maximum: ordering stays
// monotonic, every active visibly grows from coffee to capsule, and the small doses
// (astaxanthin, NAC) stay readable instead of collapsing to a sliver.
const barPct = (v) => (Math.sqrt(v / DOSE_MAX) * 100).toFixed(1) + '%';
// how much the capsule steps each active up by
const multText = (i) => '\u00d7' + (Math.round((DOSE.capsule[i] / DOSE.coffee[i]) * 10) / 10);
const EASE = 'cubic-bezier(.23,1,.32,1)';
const prefersReduce = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Per-ingredient line icons, matched to what each active delivers.
const ICONS = {
  sun: {
    circle: [12, 12, 4],
    paths: ['M12 2v2', 'M12 20v2', 'm4.93 4.93 1.41 1.41', 'm17.66 17.66 1.41 1.41', 'M2 12h2', 'M20 12h2', 'm6.34 17.66-1.41 1.41', 'm19.07 4.93-1.41 1.41'],
  },
  droplet: { paths: ['M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C7 11.1 6 13 6 15a7 7 0 0 0 6 7z'] },
  shield: { paths: ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z', 'm9 12 2 2 4-4'] },
  bolt: { paths: ['M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'] },
  flame: { paths: ['M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'] },
  leaf: { paths: ['M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z', 'M2 21c0-3 1.85-5.36 5.08-6'] },
};
const ICON_FOR = ['sun', 'droplet', 'shield', 'bolt', 'flame', 'leaf'];
// short names for the mobile tab rail, where six labels share one line
const SHORT = ['Gluta', 'Collagen', 'Astax', 'Vit C', 'NAC', 'Poly'];

// Icon SVGs, animated while visible (only the active node shows one).
function Icon({ name, color = '#E23A34', size = 26 }) {
  const fb = { transformBox: 'fill-box' };
  const paths = ICONS[name].paths;
  let kids;

  if (name === 'sun') {
    kids = [
      <circle key="c" cx={12} cy={12} r={4} style={{ ...fb, transformOrigin: 'center', animation: 'ico-sun-core 2.6s ease-in-out infinite' }} />,
      <g key="rays" style={{ ...fb, transformOrigin: 'center', animation: 'ico-sun-rays 14s linear infinite' }}>
        {paths.map((d, i) => <path key={i} d={d} />)}
      </g>,
    ];
  } else if (name === 'droplet') {
    kids = [<g key="g" style={{ ...fb, transformOrigin: 'center', animation: 'ico-bob 2.4s ease-in-out infinite' }}>{paths.map((d, i) => <path key={i} d={d} />)}</g>];
  } else if (name === 'shield') {
    kids = [
      <path key="0" d={paths[0]} style={{ ...fb, transformOrigin: 'center', animation: 'ico-shine 3s ease-in-out infinite' }} />,
      <path key="1" d={paths[1]} style={{ strokeDasharray: 16, animation: 'ico-draw 3s ease-in-out infinite' }} />,
    ];
  } else if (name === 'bolt') {
    kids = [<g key="g" style={{ ...fb, transformOrigin: 'center', animation: 'ico-bolt 1.7s ease-in-out infinite' }}>{paths.map((d, i) => <path key={i} d={d} />)}</g>];
  } else if (name === 'flame') {
    kids = [
      <path key="0" d={paths[0]} style={{ ...fb, transformOrigin: 'center bottom', animation: 'ico-flame .7s ease-in-out infinite alternate' }} />,
      <path key="core" d="M12 20a3 3 0 0 0 3-3c0-1.6-1.2-2.6-1.6-3.6-.6 1-1.4 1.7-2.2 2.4-.7.6-1.2 1.3-1.2 2.2a2 2 0 0 0 2 2z" fill={color} stroke="none" style={{ ...fb, transformOrigin: 'center bottom', animation: 'ico-flame-core .5s ease-in-out infinite alternate' }} />,
    ];
  } else { // leaf
    kids = [<g key="g" style={{ ...fb, transformOrigin: 'center bottom', animation: 'ico-sway 2.6s ease-in-out infinite alternate' }}>{paths.map((d, i) => <path key={i} d={d} />)}</g>];
  }

  return (
    <svg
      className="am-ico" viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}
    >
      {kids}
    </svg>
  );
}

// Swap to the mobile layout on phone / small-tablet widths.
function useIsMobile(bp = 767) {
  const query = `(max-width:${bp}px)`;
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return isMobile;
}

/* ============================ DESKTOP ============================ */

function nodeStyle(idx, active) {
  const a = (ANGLES[idx] * Math.PI) / 180;
  const x = Math.cos(a) * R;
  const y = Math.sin(a) * R;
  return {
    position: 'absolute',
    left: `calc(50% + ${x}%)`,
    top: `calc(50% + ${y}%)`,
    transform: 'translate(-50%,-50%) scale(var(--ns))',
    '--ns': active ? 1.08 : 1,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
    padding: '9px 14px 13px',
    minWidth: '124px',   // fits the shared 96px dose track on the shortest label
    borderRadius: '2px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background .3s,color .3s,border-color .3s,transform .3s',
    background: active ? '#E23A34' : 'rgba(23,17,14,.82)',
    color: active ? '#fff' : '#EDE4D3',
    border: active ? '1px solid #E23A34' : '1px solid rgba(23,17,14,.5)',
    boxShadow: active ? '0 10px 30px rgba(226,58,52,.35)' : '0 6px 16px rgba(0,0,0,.28)',
    zIndex: active ? 3 : 2,
  };
}

function auraStyle(active) {
  return {
    position: 'absolute', left: '50%', top: '50%', width: '130px', height: '130px',
    transform: `translate(-50%,-50%) scale(${active ? 1 : 0.4})`,
    borderRadius: '50%',
    background: 'radial-gradient(circle,rgba(198,162,76,.5),rgba(201,154,52,.16) 54%,transparent 72%)',
    opacity: active ? 1 : 0,
    transition: 'opacity .4s ease,transform .45s cubic-bezier(.23,1,.32,1)',
    pointerEvents: 'none', zIndex: 0,
  };
}

function popStyle(active, upper) {
  const ty = active ? '0' : upper ? '-8px' : '8px';
  return {
    position: 'absolute', left: '50%',
    ...(upper ? { top: 'calc(100% + 14px)' } : { bottom: 'calc(100% + 14px)' }),
    transform: `translateX(-50%) translateY(${ty})`,
    opacity: active ? 1 : 0,
    transition: 'opacity .4s ease,transform .45s cubic-bezier(.23,1,.32,1)',
    pointerEvents: 'none', zIndex: 6, textAlign: 'center',
  };
}

function iconWrapStyle(active) {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '54px', height: '54px', margin: '0 auto', borderRadius: '50%',
    background: 'rgba(23,17,14,.9)', border: '1px solid rgba(198,162,76,.5)',
    boxShadow: '0 8px 22px rgba(0,0,0,.5), 0 0 20px rgba(226,58,52,.25)',
    transform: active ? 'scale(1)' : 'scale(.7)',
    transition: 'transform .45s cubic-bezier(.23,1,.32,1)',
  };
}

function IngredientsDesktop() {
  const [active, setActive] = useState(0);
  const [fmt, setFmt] = useState('coffee');

  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const pouchRef = useRef(null);
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const dustRef = useRef(null);
  const subRef = useRef(null);
  const nameRef = useRef(null);
  const descRef = useRef(null);
  const underlineRef = useRef(null);
  const progressRef = useRef(null);
  const firstDetail = useRef(true);
  const progAnimRef = useRef(null);   // current detail progress-bar animation
  const pausedRef = useRef(false);    // true while the user hovers/focuses the orbit

  // pause / resume the progress-driven auto-advance while the user explores
  const pauseCycle = () => { pausedRef.current = true; if (progAnimRef.current) progAnimRef.current.pause(); };
  const resumeCycle = () => { pausedRef.current = false; if (progAnimRef.current) { try { progAnimRef.current.play(); } catch { /* ignore */ } } };

  // ring + center-pouch drift loop (disabled under reduced motion). The ingredient
  // auto-advance is driven by the detail progress bar filling (see the [active] effect).
  useEffect(() => {
    const reduce = prefersReduce();
    if (reduce) return;
    const t0 = performance.now();
    let raf = 0;
    const loop = () => {
      const t = (performance.now() - t0) * 0.001;
      if (ring1Ref.current) ring1Ref.current.style.transform = `rotate(${t * 5}deg)`;
      if (ring2Ref.current) ring2Ref.current.style.transform = `rotate(${-t * 3.5}deg)`;
      if (pouchRef.current)
        pouchRef.current.style.transform =
          `translate(-50%,-50%) translateY(${(Math.sin(t * 0.9) * 9).toFixed(2)}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // detail card: stagger sub/name/desc + gold underline wipe + progress sweep on change
  useEffect(() => {
    const reduce = prefersReduce();
    if (reduce) { if (underlineRef.current) underlineRef.current.style.width = '64%'; firstDetail.current = false; return; }
    if (!firstDetail.current) {
      [subRef.current, nameRef.current, descRef.current].forEach((el, k) => {
        if (el) el.animate(
          [{ opacity: 0, transform: 'translateY(14px)', filter: 'blur(5px)' }, { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' }],
          { duration: 560, delay: k * 90, easing: EASE, fill: 'both' });
      });
    }
    if (underlineRef.current) underlineRef.current.animate([{ width: '0%' }, { width: '64%' }], { duration: 640, delay: 120, easing: EASE, fill: 'both' });
    if (progressRef.current) {
      if (progAnimRef.current) progAnimRef.current.cancel();
      const bar = progressRef.current.animate([{ width: '0%' }, { width: '100%' }], { duration: 3400, easing: 'linear', fill: 'forwards' });
      bar.onfinish = () => setActive((v) => (v + 1) % ING.length); // bar full -> next ingredient (loops)
      if (pausedRef.current) bar.pause();
      progAnimRef.current = bar;
    }
    firstDetail.current = false;
  }, [active]);

  // center pouch fades in as the section enters (receives the flown hero pouch)
  useEffect(() => {
    const reduce = prefersReduce();
    let queued = false;
    const setO = () => {
      queued = false;
      if (!pouchRef.current) return;
      if (reduce) { pouchRef.current.style.opacity = '1'; return; }
      const vh = window.innerHeight || 1;
      const ir = sectionRef.current ? sectionRef.current.getBoundingClientRect() : { top: 0 };
      const o = Math.max(0, Math.min(1, (vh - ir.top) / (vh * 0.55)));
      pouchRef.current.style.opacity = o.toFixed(3);
    };
    const onScroll = () => { if (queued) return; queued = true; requestAnimationFrame(setO); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    setO();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  // scroll-triggered reveals: headings rise; the orbit builds one node at a time
  // (fly out from the pouch, in a fixed order) and the detail card cascades in.
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const reduce = prefersReduce();
    const stage = stageRef.current;
    const cardEls = [subRef.current, nameRef.current, descRef.current];
    if (!reduce) {
      if (stage) stage.querySelectorAll('.orbit-node').forEach((n) => { n.style.opacity = '0'; });
      cardEls.forEach((el) => { if (el) el.style.opacity = '0'; });
    }
    const EO = 'cubic-bezier(.2,1,.3,1)';
    const runOrbit = () => {
      if (stage) stage.style.opacity = '1';   // reveal the orbit container itself (nodes fly in inside it)
      if (reduce || !stage) {
        if (stage) stage.querySelectorAll('.orbit-node').forEach((n) => { n.style.opacity = '1'; });
        cardEls.forEach((el) => { if (el) el.style.opacity = '1'; });
        return;
      }
      const nodes = [...stage.querySelectorAll('.orbit-node')];
      const sr = stage.getBoundingClientRect();
      const cx = sr.left + sr.width / 2, cy = sr.top + sr.height / 2;
      // appearance order: Glutathione, Polypodium, Collagen, N-Acetyl Cysteine, Astaxanthin, Vitamin C
      [0, 5, 1, 4, 2, 3].forEach((idx, pos) => {
        const n = nodes[idx];
        if (!n) return;
        const nr = n.getBoundingClientRect();
        const dx = (cx - (nr.left + nr.width / 2)).toFixed(1);
        const dy = (cy - (nr.top + nr.height / 2)).toFixed(1);
        const a = n.animate(
          [{ opacity: 0, transform: `translate(-50%,-50%) translate(${dx}px,${dy}px) scale(.35)` },
           { opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }],
          { duration: 1400, delay: 300 + pos * 260, easing: EO, fill: 'both' });
        a.onfinish = () => { a.cancel(); n.style.opacity = '1'; };
      });
      cardEls.forEach((el, k) => {
        if (!el) return;
        const a = el.animate(
          [{ opacity: 0, transform: 'translateX(-28px)', filter: 'blur(4px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
          { duration: 1000, delay: 400 + k * 220, easing: EO, fill: 'both' });
        a.onfinish = () => { a.cancel(); el.style.opacity = '1'; };
      });
    };
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        if (el === stage) { io.unobserve(el); return; }   // orbit handled by the section trigger below
        const delay = 200 + parseFloat(el.getAttribute('data-reveal-delay') || '0') * 1000 * 2.2;
        el.animate(
          [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 1300, delay, easing: EASE, fill: 'both' });
        io.unobserve(el);
      });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    // fire the orbit build + card cascade as soon as the section scrolls into view
    let ran = false;
    const maybeRun = () => {
      if (ran) return;
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      if (r.top < vh * 0.6 && r.bottom > vh * 0.4) {
        ran = true; runOrbit(); window.removeEventListener('scroll', maybeRun);
      }
    };
    window.addEventListener('scroll', maybeRun, { passive: true });
    maybeRun();
    return () => { io.disconnect(); window.removeEventListener('scroll', maybeRun); };
  }, []);

  // particle halo — 12 luminous motes orbit the core at varied radii/speeds
  useEffect(() => {
    if (prefersReduce()) return;
    const stage = stageRef.current;
    if (!stage || stage.querySelector('[data-spark]')) return;
    for (let i = 0; i < 12; i++) {
      const arm = document.createElement('span');
      arm.setAttribute('data-spark', '');
      const rad = 26 + Math.random() * 24;
      const dur = 6 + Math.random() * 8;
      const gold = Math.random() > 0.5;
      arm.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;animation:halo-spin ' + dur.toFixed(1) + 's linear ' + (-Math.random() * dur).toFixed(1) + 's infinite;' + (Math.random() > 0.5 ? '' : 'animation-direction:reverse;');
      const dot = document.createElement('span');
      const sz = 2.5 + Math.random() * 3;
      dot.style.cssText = 'position:absolute;left:50%;top:' + (50 - rad).toFixed(1) + '%;transform:translate(-50%,-50%);width:' + sz.toFixed(1) + 'px;height:' + sz.toFixed(1) + 'px;border-radius:50%;background:rgba(190,140,46,.9);box-shadow:0 0 7px rgba(198,162,76,.6);';
      arm.appendChild(dot);
      stage.appendChild(arm);
    }
  }, []);

  // rising gold-dust field (ambient, carries the hero dust down)
  useEffect(() => {
    if (prefersReduce()) return;
    const host = dustRef.current;
    if (!host || host.childElementCount) return;
    for (let i = 0; i < 24; i++) {
      const s = document.createElement('span');
      const sz = 2 + Math.random() * 3.5;
      s.style.cssText = 'position:absolute;bottom:' + (Math.random() * 45) + '%;left:' + (Math.random() * 100) + '%;width:' + sz.toFixed(1) + 'px;height:' + sz.toFixed(1) + 'px;border-radius:50%;background:radial-gradient(circle,rgba(74,44,23,.8),rgba(122,84,22,.12));box-shadow:0 0 6px rgba(74,44,23,.3);--dx:' + (Math.random() * 60 - 30).toFixed(0) + 'px;animation:hero-dust ' + (6 + Math.random() * 7).toFixed(1) + 's ease-in-out ' + (Math.random() * 6).toFixed(1) + 's infinite;';
      host.appendChild(s);
    }
  }, []);

  // FORMAT STEP-UP: the orbit holds still and only the figures move — doses count,
  // bars rescale to the format's own top dose, the multiplier badges land, and one
  // gold pulse ripples around the ring. React has already painted the end values,
  // so the count just replays the interval it travelled.
  // the orbit auto-advances every 3.4s; read the selection from a ref so an
  // `active` tick can never tear down a running dose count
  const activeRef = useRef(active);
  activeRef.current = active;

  const prevFmt = useRef(fmt);
  useEffect(() => {
    const from = prevFmt.current;
    prevFmt.current = fmt;
    const section = sectionRef.current;
    const stage = stageRef.current;
    // park every figure on the exact value for this format — React can't repair
    // these itself, because it renders the same string across an `active` change
    const snap = () => {
      if (stage) stage.querySelectorAll('[data-dose]').forEach((el, i) => { el.textContent = doseText(DOSE[fmt][i]); });
      const cf = section && section.querySelector('[data-card-dose]');
      if (cf) cf.textContent = doseText(DOSE[fmt][activeRef.current]);
    };
    if (from === fmt || !section || prefersReduce()) { snap(); return undefined; }
    const up = fmt === 'capsule';
    const DUR = 780;
    const a = DOSE[from][activeRef.current];
    const b = DOSE[fmt][activeRef.current];
    const rafs = [];
    const count = (el, x, y) => {
      if (!el) return;
      const t0 = performance.now();
      const tick = () => {
        const p = Math.min(1, (performance.now() - t0) / DUR);
        if (p < 1) {
          el.textContent = doseText(x + (y - x) * (1 - Math.pow(1 - p, 3)));
          rafs.push(requestAnimationFrame(tick));
        } else {
          el.textContent = doseText(y);   // land exactly on the label value
        }
      };
      tick();
    };
    const pop = (el, i) => {
      if (!el) return;
      el.animate(
        up ? [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1.25)', offset: .55 }, { opacity: 1, transform: 'scale(1)' }]
           : [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.6)' }],
        { duration: up ? 480 : 300, delay: up ? 200 + i * 70 : i * 40,
          easing: up ? 'cubic-bezier(.2,1.5,.35,1)' : 'ease-out', fill: 'both' });
    };
    count(section.querySelector('[data-card-dose]'), a, b);
    pop(section.querySelector('[data-card-delta]'), 0);

    if (stage) {
      const A = DOSE[from], B = DOSE[fmt];
      stage.querySelectorAll('[data-dose]').forEach((el, i) => count(el, A[i], B[i]));
      stage.querySelectorAll('[data-delta]').forEach((el, i) => pop(el, i));
      stage.querySelectorAll('[data-bar]').forEach((el, i) => el.animate(
        [{ width: barPct(A[i]) }, { width: barPct(B[i]) }],
        { duration: DUR + 140, delay: i * 55, easing: EASE, fill: 'both' }));
    }
    // one gold pulse rippling around the ring, so the whole orbit registers the change
    if (stage) stage.querySelectorAll('.orbit-node').forEach((n, i) => n.animate([
      { boxShadow: '0 6px 16px rgba(0,0,0,.28)' },
      { boxShadow: '0 6px 16px rgba(0,0,0,.28), 0 0 0 2px rgba(246,227,154,.55)', offset: .45 },
      { boxShadow: '0 6px 16px rgba(0,0,0,.28)' },
    ], { duration: 700, delay: 120 + i * 70, easing: 'ease-out' }));
    return () => { rafs.forEach(cancelAnimationFrame); snap(); };
  }, [fmt]);

  const cur = ING[active];

  return (
    <section id="ingredients" ref={sectionRef} className="fullpage" style={{
      position: 'relative', padding: 'clamp(72px,10vh,140px) clamp(20px,5vw,46px)',
      background: '#d3c29c', overflow: 'hidden',
      fontFamily: "'Space Grotesk',system-ui,sans-serif",
    }}>
      {/* seam fades — top from the hero, bottom into Origin — so the sections read as one space */}
      {/* seam fades removed — kraft fills edge to edge */}
      <div ref={dustRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }} />
      <span aria-hidden="true" className="am-noise" style={{ opacity: 0.02, zIndex: 0 }} />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'grid', gridTemplateColumns: 'minmax(0,0.9fr) minmax(0,1.1fr)',
        gap: 'clamp(28px,5vw,80px)', alignItems: 'center', maxWidth: '1240px', margin: '0 auto',
      }}>
        {/* LEFT: heading + editorial detail card */}
        <div>
          {/* format switch — governs the whole orbit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div role="group" aria-label="Choose format" style={{
              display: 'inline-flex', border: '1px solid rgba(23,17,14,.28)', borderRadius: '999px',
              overflow: 'hidden', background: 'rgba(23,17,14,.06)',
            }}>
              {FMTS.map((k) => (
                <button
                  key={k} type="button" onClick={() => setFmt(k)} aria-pressed={fmt === k}
                  style={{
                    border: 0, cursor: 'pointer', padding: '9px 18px', fontFamily: "'Space Grotesk',sans-serif",
                    fontSize: '13px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
                    background: fmt === k ? '#C11A22' : 'transparent',
                    color: fmt === k ? '#fff' : '#8a5f1c',
                    transition: 'background .25s,color .25s',
                  }}
                >{FORMATS[k].label}</button>
              ))}
            </div>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '15px', letterSpacing: '.02em', color: '#8a5f1c' }}>{FORMATS[fmt].serving}</span>
          </div>
          <h2 style={{
            margin: 0, fontFamily: "'Anton',sans-serif", fontWeight: 400, textTransform: 'uppercase',
            fontSize: 'clamp(40px,5.5vw,78px)', lineHeight: 0.9, letterSpacing: '-.01em', color: '#221a12',
          }}>
            <span className="ih-w" data-reveal data-reveal-delay="0" style={{ display: 'inline-block', opacity: 0 }}>Six</span>{' '}
            <span className="ih-w" data-reveal data-reveal-delay=".08" style={{ display: 'inline-block', opacity: 0 }}>actives,</span><br />
            <span className="ih-w" data-reveal data-reveal-delay=".16" style={{ display: 'inline-block', opacity: 0, color: '#C11A22' }}>one</span>{' '}
            <span className="ih-w" data-reveal data-reveal-delay=".24" style={{ display: 'inline-block', opacity: 0, color: '#C11A22' }}>{FORMATS[fmt].word}</span>
          </h2>

          <div style={{
            position: 'relative', marginTop: 'clamp(28px,4vh,44px)', borderTop: '1px solid rgba(23,17,14,.2)',
            paddingTop: '26px', minHeight: '210px',
          }}>
            <span ref={progressRef} aria-hidden="true" style={{ position: 'absolute', top: '-1px', left: 0, height: '2px', width: 0, background: 'linear-gradient(90deg,#E23A34,#C6A24C)', boxShadow: '0 0 8px rgba(226,58,52,.5)' }} />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
              <span ref={subRef} style={{
                fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '15px',
                letterSpacing: '.02em', color: '#8a5f1c',
              }}>{cur.s}</span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '13px', letterSpacing: '.1em', color: '#8a5f1c', whiteSpace: 'nowrap' }}>{String(active + 1).padStart(2, '0')}<span style={{ color: '#b3a789' }}> / 06</span></span>
            </div>
            <h3 ref={nameRef} style={{
              margin: '12px 0 0', fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800,
              fontSize: 'clamp(30px,3.8vw,52px)', lineHeight: 1.02, letterSpacing: '-.01em', color: '#221a12',
            }}>{cur.k}</h3>
            <span ref={underlineRef} aria-hidden="true" style={{ display: 'block', height: '2px', width: 0, marginTop: '8px', background: 'linear-gradient(90deg,#8a5f1c,transparent)' }} />
            <span style={{
              display: 'inline-block', marginTop: '14px', fontFamily: "'Bricolage Grotesque',sans-serif",
              fontWeight: 600, fontSize: '13px', color: '#8a5f1c',
              border: '1px solid rgba(138,95,28,.4)', borderRadius: '3px', padding: '5px 10px',
            }}>{cur.b}</span>
            <p ref={descRef} style={{
              margin: '16px 0 0', fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(15px,1.5vw,18px)',
              lineHeight: 1.6, color: '#4a3c28', maxWidth: '440px',
            }}>{cur.d}</p>
            {/* dose of the selected active, on a scale shared by all six in this format */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '18px', maxWidth: '440px' }}>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '13px', letterSpacing: '.1em', color: '#8a5f1c', whiteSpace: 'nowrap' }}>PER {fmt === 'capsule' ? 'CAPSULE' : 'SACHET'}</span>
              <span data-card-dose style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: '20px', color: '#221a12', whiteSpace: 'nowrap' }}>{doseText(DOSE[fmt][active])}</span>
              <span data-card-delta style={{ opacity: fmt === 'capsule' ? 1 : 0, fontFamily: "'Space Mono',monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '.04em', color: '#221a12', background: 'linear-gradient(180deg,#F6E39A,#C99A34)', borderRadius: '2px', padding: '2px 5px', whiteSpace: 'nowrap' }}>{multText(active)}</span>
              <span aria-hidden="true" style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'rgba(23,17,14,.15)', overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', width: barPct(DOSE[fmt][active]), borderRadius: '2px', background: 'linear-gradient(90deg,#8a5f1c,#C99A34)', transition: 'width .6s cubic-bezier(.23,1,.32,1)' }} />
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: orbit stage */}
        <div
          ref={stageRef}
          data-reveal
          data-reveal-delay=".15"
          onMouseEnter={pauseCycle}
          onMouseLeave={resumeCycle}
          onFocus={pauseCycle}
          onBlur={resumeCycle}
          style={{ position: 'relative', aspectRatio: '1', width: '100%', maxWidth: '560px', margin: '0 auto', opacity: 0 }}
        >
          {/* rotating rings */}
          <div ref={ring1Ref} style={{ position: 'absolute', inset: '4%', border: '1px dashed rgba(23,17,14,.22)', borderRadius: '50%' }} />
          <div ref={ring2Ref} style={{ position: 'absolute', inset: '18%', border: '1px solid rgba(198,162,76,.45)', borderRadius: '50%', animation: 'ring-glow 4.5s ease-in-out infinite' }} />
          {/* gold glow, centered directly behind the pouch */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: '52%', height: '52%', transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'radial-gradient(circle,rgba(198,162,76,.34),rgba(201,154,52,.12) 50%,transparent 72%)', filter: 'blur(22px)', zIndex: 1, animation: 'glow-pulse 6s ease-in-out infinite' }} />

          {/* center pouch */}
          <div ref={pouchRef} style={{ position: 'absolute', left: '50%', top: '50%', width: '30%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 2 }}>
            <img src={POUCH} alt="AMAZTRA pouch" style={{ display: 'block', width: '100%', filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.6))', opacity: fmt === 'coffee' ? 1 : 0, transition: 'opacity .42s ease' }} />
            <img src={FORMATS.capsule.obj} alt="AMAZTRA capsule box" style={{ position: 'absolute', left: 0, top: '50%', width: '100%', transform: 'translateY(-50%)', filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.6))', opacity: fmt === 'capsule' ? 1 : 0, transition: 'opacity .42s ease' }} />
          </div>

          {/* ingredient nodes */}
          {ING.map((ing, idx) => {
            const isActive = idx === active;
            const upper = Math.sin((ANGLES[idx] * Math.PI) / 180) < 0;
            return (
              <button
                key={ing.k}
                type="button"
                className="orbit-node"
                onMouseEnter={() => setActive(idx)}
                onFocus={() => setActive(idx)}
                onClick={() => setActive(idx)}
                style={nodeStyle(idx, isActive)}
              >
                <span aria-hidden="true" style={auraStyle(isActive)} />
                <span style={popStyle(isActive, upper)}>
                  <span style={iconWrapStyle(isActive)}><Icon name={ICON_FOR[idx]} /></span>
                </span>
                <span style={{
                  position: 'relative', zIndex: 2, fontFamily: "'Marcellus',serif", fontWeight: 400,
                  fontSize: '11px', letterSpacing: '.03em', textTransform: 'uppercase',
                }}>{ing.k}</span>
                <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span data-dose style={{ fontFamily: "'Space Mono',monospace", fontSize: '11px', fontWeight: 700, color: isActive ? '#fff' : '#C6A24C' }}>{doseText(DOSE[fmt][idx])}</span>
                  <span data-delta style={{
                    opacity: fmt === 'capsule' ? 1 : 0, fontFamily: "'Space Mono',monospace", fontSize: '9px',
                    fontWeight: 700, letterSpacing: '.04em', color: '#141210',
                    background: 'linear-gradient(180deg,#F6E39A,#C99A34)', borderRadius: '2px', padding: '0 4px',
                  }}>{multText(idx)}</span>
                </span>
                {/* dose bar, pinned inside the node's bottom edge so it costs no height */}
                <span aria-hidden="true" style={{ position: 'absolute', left: '50%', marginLeft: '-48px', width: '96px', bottom: '6px', height: '2px', borderRadius: '2px', background: 'rgba(237,228,211,.18)', overflow: 'hidden', zIndex: 2 }}>
                  <span data-bar style={{ display: 'block', height: '100%', width: barPct(DOSE[fmt][idx]), borderRadius: '2px', background: 'linear-gradient(90deg,#C99A34,#F6E39A)' }} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================ MOBILE ============================ */

function tabStyle(active) {
  return {
    flex: 1, padding: '13px 0', border: 0, cursor: 'pointer', borderRadius: '2px',
    fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '12px',
    letterSpacing: '.1em', textTransform: 'uppercase',
    transition: 'background .25s,color .25s',
    background: active ? '#E23A34' : 'transparent',
    color: active ? '#fff' : 'rgba(34,26,18,.5)',
  };
}

function mobileIconWrap(active, size) {
  return {
    display: active ? 'inline-flex' : 'none', alignItems: 'center', justifyContent: 'center',
    width: `${size}px`, height: `${size}px`, borderRadius: '50%', flexShrink: 0,
    background: 'rgba(23,17,14,.9)', border: '1px solid rgba(198,162,76,.5)',
    boxShadow: '0 6px 18px rgba(0,0,0,.5), 0 0 16px rgba(226,58,52,.25)',
  };
}

function mobileNodeStyle(idx, active) {
  const a = (ANGLES[idx] * Math.PI) / 180;
  const Rm = 40;
  return {
    position: 'absolute',
    left: `calc(50% + ${Math.cos(a) * Rm}%)`,
    top: `calc(50% + ${Math.sin(a) * Rm}%)`,
    transform: 'translate(-50%,-50%) scale(var(--ns))',
    '--ns': active ? 1.06 : 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: active ? '6px' : '0',
    fontFamily: "'Marcellus',serif", fontWeight: 400, fontSize: '9px',
    letterSpacing: '.03em', textTransform: 'uppercase',
    padding: '7px 10px', borderRadius: '2px', cursor: 'pointer', whiteSpace: 'nowrap',
    transition: 'all .3s',
    background: active ? '#E23A34' : 'rgba(23,17,14,.82)',
    color: active ? '#fff' : '#EDE4D3',
    border: active ? '1px solid #E23A34' : '1px solid rgba(23,17,14,.5)',
    boxShadow: active ? '0 8px 22px rgba(226,58,52,.35)' : '0 6px 16px rgba(0,0,0,.28)',
    zIndex: active ? 3 : 2,
  };
}

function IngredientsMobile() {
  const [active, setActive] = useState(0);
  const [fmt, setFmt] = useState('coffee');
  const [held, setHeld] = useState(false);
  const cur = ING[active];
  const reduce = prefersReduce();
  const barRef = useRef(null);
  const nameRef = useRef(null);
  const railRef = useRef(null);
  const firstRun = useRef(true);

  // auto-advance driven by the progress bar filling (matches desktop); tap or
  // scrub a tab to jump. Holding the rail parks the rotation on that ingredient.
  useEffect(() => {
    if (reduce || held) return;
    const bar = barRef.current;
    if (!bar) return;
    const a = bar.animate([{ width: '0%' }, { width: '100%' }], { duration: 3600, easing: 'linear', fill: 'forwards' });
    a.onfinish = () => setActive((v) => (v + 1) % ING.length);
    return () => a.cancel();
  }, [active, reduce, held]);

  // Press and drag along the rail to scrub through the six actives. touch-action
  // pan-y keeps the page's vertical scroll-snap while we take the sideways drag.
  const pickAt = (clientX) => {
    const rail = railRef.current;
    if (!rail) return;
    const r = rail.getBoundingClientRect();
    const i = Math.floor(((clientX - r.left) / r.width) * ING.length);
    setActive(Math.min(ING.length - 1, Math.max(0, i)));
  };
  // a ref, not the state, drives the drag: state lands a render later and the
  // first moves after the press would be dropped
  const heldRef = useRef(false);
  const scrubStart = (e) => {
    heldRef.current = true;
    setHeld(true);
    pickAt(e.clientX);
    // capture so the drag keeps tracking even if the finger leaves the rail
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
  };
  const scrubMove = (e) => { if (heldRef.current) pickAt(e.clientX); };
  const scrubEnd = () => { heldRef.current = false; setHeld(false); };

  // the same sideways drag works across the pouch stage
  const swipeFrom = useRef(null);
  const swipeStart = (e) => { swipeFrom.current = e.clientX; };
  const swipeEnd = (e) => {
    const from = swipeFrom.current;
    swipeFrom.current = null;
    if (from == null) return;
    const dx = e.clientX - from;
    if (Math.abs(dx) < 40) return;
    setActive((v) => (v + (dx < 0 ? 1 : ING.length - 1)) % ING.length);
  };

  // crossfade + rise the name/detail on each change
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    if (reduce || !nameRef.current) return;
    nameRef.current.animate(
      [{ opacity: 0, transform: 'translateY(16px)', filter: 'blur(5px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
      { duration: 520, easing: EASE, fill: 'both' });
  }, [active, reduce]);

  return (
    <section id="ingredients" className="fullpage" style={{
      position: 'relative',
      background: '#d3c29c', overflow: 'hidden',
      padding: 'clamp(48px,8vh,80px) clamp(22px,6vw,30px) clamp(40px,6vh,60px)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Space Grotesk',system-ui,sans-serif",
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div role="group" aria-label="Choose format" style={{ display: 'inline-flex', border: '1px solid rgba(23,17,14,.28)', borderRadius: '999px', overflow: 'hidden', background: 'rgba(23,17,14,.06)' }}>
          {FMTS.map((k) => (
            <button
              key={k} type="button" className="tap" onClick={() => setFmt(k)} aria-pressed={fmt === k}
              style={{
                border: 0, cursor: 'pointer', padding: '11px 16px', minHeight: '44px',
                fontFamily: "'Space Grotesk',sans-serif", fontSize: '12px', fontWeight: 600,
                letterSpacing: '.1em', textTransform: 'uppercase',
                background: fmt === k ? '#C11A22' : 'transparent',
                color: fmt === k ? '#fff' : '#8a5f1c', transition: 'background .25s,color .25s',
              }}
            >{FORMATS[k].label}</button>
          ))}
        </div>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '13px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#8a5f1c' }}>Six actives, one {FORMATS[fmt].word.replace('.', '')}</span>
      </div>

      {/* pouch + spinning ring + active icon */}
      <div onPointerDown={swipeStart} onPointerUp={swipeEnd} onPointerCancel={swipeEnd} style={{ position: 'relative', flex: 1, minHeight: 'clamp(280px,40vh,380px)', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'pan-y' }}>
        <span aria-hidden="true" style={{ position: 'absolute', width: '82%', aspectRatio: '1', borderRadius: '50%', background: 'radial-gradient(circle,rgba(198,162,76,.4),rgba(201,154,52,.14) 50%,transparent 72%)', filter: 'blur(20px)', animation: reduce ? 'none' : 'glow-pulse 6s ease-in-out infinite' }} />
        <span aria-hidden="true" style={{ position: 'absolute', width: '90%', aspectRatio: '1', border: '1px solid rgba(23,17,14,.28)', borderRadius: '50%', animation: reduce ? 'none' : 'halo-spin 30s linear infinite' }} />
        <span aria-hidden="true" style={{ position: 'absolute', width: '66%', aspectRatio: '1', border: '1px dashed rgba(23,17,14,.2)', borderRadius: '50%', animation: reduce ? 'none' : 'halo-spin 22s linear infinite reverse' }} />
        <img key={fmt} src={FORMATS[fmt].obj} alt={fmt === 'capsule' ? 'AMAZTRA capsule box' : 'AMAZTRA pouch'} style={{ position: 'relative', width: '58%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.45))', animation: reduce ? 'none' : 'ing-float 6s ease-in-out infinite', pointerEvents: 'none' }} />
        <span key={active} style={{
          position: 'absolute', top: '2%', left: '50%', transform: 'translateX(-50%)',
          width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(23,17,14,.9)',
          border: '1px solid rgba(198,162,76,.5)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 22px rgba(0,0,0,.35), 0 0 20px rgba(226,58,52,.2)',
        }}><Icon name={ICON_FOR[active]} color="#E23A34" size={26} /></span>
      </div>

      {/* rotating detail */}
      <div>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '14px', letterSpacing: '.02em', color: '#8a5f1c' }}>{cur.s}</span>
        <h3 ref={nameRef} style={{ margin: '8px 0 0', fontFamily: "'Anton',sans-serif", textTransform: 'uppercase', fontSize: 'clamp(40px,12vw,54px)', lineHeight: 0.9, letterSpacing: '-.01em', color: '#221a12' }}>{cur.k}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: '17px', color: '#221a12' }}>{doseText(DOSE[fmt][active])}</span>
          {fmt === 'capsule' ? (
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '.04em', color: '#221a12', background: 'linear-gradient(180deg,#F6E39A,#C99A34)', borderRadius: '2px', padding: '2px 5px' }}>{multText(active)}</span>
          ) : null}
          <span style={{ flex: 1, height: '3px', borderRadius: '2px', background: 'rgba(23,17,14,.15)', overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: barPct(DOSE[fmt][active]), borderRadius: '2px', background: 'linear-gradient(90deg,#C99A34,#8a5f1c)', transition: 'width .6s cubic-bezier(.23,1,.32,1)' }} />
          </span>
        </div>
        <p style={{ margin: '12px 0 0', fontSize: '15px', lineHeight: 1.55, color: '#4a3c28', minHeight: '68px' }}>{cur.d}</p>

        {/* progress rail through all six */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '18px' }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '12px', color: '#8a5f1c' }}>{String(active + 1).padStart(2, '0')}</span>
          <div style={{ flex: 1, height: '3px', borderRadius: '999px', background: 'rgba(23,17,14,.15)', overflow: 'hidden' }}>
            <span ref={barRef} style={{ display: 'block', height: '100%', width: reduce ? '100%' : '0%', background: 'linear-gradient(90deg,#E23A34,#C6A24C)' }} />
          </div>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '12px', color: '#b3a789' }}>06</span>
        </div>

        {/* labelled tabs: tap one, or press and drag across them to scrub */}
        <div
          ref={railRef}
          onPointerDown={scrubStart}
          onPointerMove={scrubMove}
          onPointerUp={scrubEnd}
          onPointerCancel={scrubEnd}
          style={{ display: 'flex', gap: '6px', marginTop: '16px', touchAction: 'pan-y', cursor: held ? 'grabbing' : 'pointer' }}
        >
          {ING.map((ing, idx) => (
            <button
              key={ing.k}
              type="button"
              className="tap"
              aria-label={ing.k}
              aria-pressed={idx === active}
              onClick={() => setActive(idx)}
              style={{
                flex: 1, minWidth: 0, border: 0, padding: '10px 0', background: 'none', cursor: 'inherit',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px',
              }}
            >
              <span style={{
                fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600,
                fontSize: 'clamp(8px,2.3vw,9.5px)', letterSpacing: '.04em', textTransform: 'uppercase',
                whiteSpace: 'nowrap', lineHeight: 1,
                color: idx === active ? '#221a12' : '#8a5f1c',
                opacity: idx === active ? 1 : 0.6, transition: 'color .3s, opacity .3s',
              }}>{SHORT[idx]}</span>
              <span style={{
                display: 'block', width: '100%', height: '7px', borderRadius: '999px',
                background: idx === active ? '#C11A22' : 'rgba(23,17,14,.2)',
                boxShadow: idx === active ? '0 3px 10px rgba(193,26,34,.35)' : 'none',
                transition: 'background .3s, box-shadow .3s',
              }} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================================= */

export default function Ingredients() {
  const isMobile = useIsMobile(767);
  return isMobile ? <IngredientsMobile /> : <IngredientsDesktop />;
}
