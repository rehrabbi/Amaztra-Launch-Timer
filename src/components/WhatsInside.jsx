import { useEffect, useRef, useState } from 'react';

const prefersReduce = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const EASE = 'cubic-bezier(.23,1,.32,1)';

/* ============================================================================
   Both printed labels, transcribed from the real packs.
   coffee  - 16 g sachet, 10-sachet pouch  (%REVRNI)
   capsule - 500 mg capsule, 30-capsule box (%REI/RNI)
   ========================================================================== */

const NF_COFFEE = {
  servingSize: '1 sachet (16 g)',
  servings: '10 sachets',
  pctLabel: '%REVRNI*',
  rows: [
    { name: 'Calories (kcal) 72', extra: 'Calories from fat 22', pct: '<3%', head: true },
    { name: 'Total Fat', value: '2 g' },
    { name: 'Saturated Fat', value: '2 g', sub: true },
    { name: 'Unsaturated Fat', value: '0 g', sub: true },
    { name: 'Trans Fat', value: '0 g', sub: true },
    { name: 'Cholesterol', value: '0 mg' },
    { name: 'Sodium', value: '1 mg' },
    { name: 'Total Carbohydrates', value: '11 g' },
    { name: 'Dietary Fiber', value: '3 g', sub: true },
    { name: 'Sugar', value: '0 g', sub: true },
    { name: 'Protein', value: '3 g', pct: '5%' },
  ],
  footnote: '*Percent REVRNI values are based on the Recommended Energy and Nutrient Intakes Philippines, 2015 Edition for Male aged 19-29 years old.',
};

const NF_CAPSULE = {
  servingSize: '1 capsule (500 mg)',
  servings: '30 capsules',
  pctLabel: '%REI/RNI*',
  rows: [
    { name: 'Calories (kcal) 2', extra: 'Calories from fat 0', pct: '<2%', head: true },
    { name: 'Total Fat', value: '0 g' },
    { name: 'Saturated Fat', value: '0 g', sub: true },
    { name: 'Unsaturated Fat', value: '0 g', sub: true },
    { name: 'Trans Fat', value: '0 g', sub: true },
    { name: 'Cholesterol', value: '0 mg' },
    { name: 'Sodium', value: '1 mg' },
    { name: 'Total Carbohydrates', value: '0 g' },
    { name: 'Dietary Fiber', value: '0 g', sub: true },
    { name: 'Sugar', value: '0 g', sub: true },
    { name: 'Protein', value: '0 g', pct: '<2%' },
  ],
  footnote: '*Percent REI/RNI values are based on the Recommended Energy and Nutrient Intakes Philippines, 2015 Edition for Male aged 19-29 years old.',
};

const MFG = 'AMAZING PHARMA CORPORATION · Unit 2 Onicare Bldg., Block 22 Lot 1C Villa Consolacion Subd., Brgy. San Jose, Antipolo City, Rizal.';

const LABELS = {
  coffee: {
    tab: 'Coffee',
    kind: 'Coffee · 16 g sachet',
    nf: NF_COFFEE,
    kcal: 72,
    unit: ['kcal', 'per', 'sachet'],
    macros: [['Fat', '2 g'], ['Carbs', '11 g'], ['Sugar', '0 g'], ['Protein', '3 g']],
    lede: 'Six actives, real coffee, and nothing to hide. Every ingredient and the full nutrition panel are printed right on the pack. Tap it to read the whole label.',
    pack: 'assets/img/pouch/back-full.png',
    packAlt: 'Back of the AMAZTRA pouch showing ingredients and nutrition facts',
    // the pouch art carries its own transparent padding, so it is pulled up and left
    packBox: { width: 'min(400px,94vw)', marginTop: '0', marginLeft: '0', align: 'center', self: 'center' },
    ingredients: 'Non-Dairy Creamer [Glucose Syrup, Hydrogenated Vegetable Fat (Palm Kernel oil), Stabilizers (Dipotassium Phosphate, Sodium Tripolyphosphate), Sodium Caseinate, Emulsifiers (Mono & Diglycerides of Fatty Acids, Sodium Stearoyl Lactylate), Anti-Caking Agent (Silicon Dioxide), and Color (Riboflavin)], Coffee Powder, Maltodextrin (filler), Caramel Flavor (artificial food flavor), Stevia Leaves Powder (Stevia rebaudiana bertoni), Glutathione, Collagen (Fish), Sodium Ascorbate, Polypodium Leucotomos Leaf Extract, N-Acetyl Cysteine, and Astaxanthin.',
    blocks: [
      { h: 'Allergen Information', b: 'May contain milk derivatives. Contains Fish.' },
      { h: 'Directions', b: 'Empty one sachet into a cup. Add 150 ml hot water. Stir well to dissolve. Serve and enjoy!' },
      { h: 'Precaution', b: 'For adult use only. Not intended for children, pregnant, and lactating women.' },
      { h: 'Storage', b: 'Store in a cool dry place away from direct sunlight, moisture and heat.' },
      { h: 'Manufactured for', b: MFG },
    ],
    specs: [
      ['LOT NO.', 'FR-4000015851134'],
      ['MFG. DATE', '22 JUN 2025'],
      ['EXPIRY DATE', '22 DEC 2027'],
      ['NET WT', '160 g · 10 × 16 g'],
    ],
    footRow: ['NET WT', '160 g · 10 × 16 g'],
  },
  capsule: {
    tab: 'Capsule',
    kind: 'Capsule · 500 mg',
    nf: NF_CAPSULE,
    kcal: 2,
    unit: ['kcal', 'per', 'capsule'],
    macros: [['Fat', '0 g'], ['Carbs', '0 g'], ['Sugar', '0 g'], ['Protein', '0 g']],
    lede: 'The same six actives, no coffee and nothing else along for the ride: zero fat, zero carbs, zero sugar. One capsule a day, and the whole label is printed on the box.',
    pack: 'assets/img/capsule-back.png',
    packAlt: 'Back of the AMAZTRA capsule box showing ingredients and nutrition facts',
    // the box shot is trimmed to its own edges, so it needs no negative offset
    packBox: { width: 'min(250px,80%)', marginTop: '0', marginLeft: '0', align: 'center', self: 'center' },
    ingredients: 'Glutathione, Collagen (Fish), Sodium Ascorbate, Polypodium Leucotomos Leaf Extract, N-Acetyl-Cysteine, Silicon Dioxide (anti-caking agent), Astaxanthin, and Gelatine Capsule (Bovine).',
    blocks: [
      { h: 'Allergen Information', b: 'Contains Fish.' },
      { h: 'Directions', b: 'Take 1 capsule a day.' },
      { h: 'Manufactured for', b: MFG },
    ],
    specs: [
      ['SERVING', '1 capsule (500 mg)'],
      ['PER BOX', '30 capsules'],
    ],
    footRow: ['PER BOX', '30 capsules'],
  },
};

const ORDER = ['coffee', 'capsule'];

function NutritionFactsBox({ nf }) {
  const line = '1px solid #17110e';
  return (
    <div style={{ border: '2px solid #17110e', background: '#fff', color: '#17110e', padding: '12px 14px', fontFamily: "'Arial','Helvetica',sans-serif", lineHeight: 1.2 }}>
      <div style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-.01em', borderBottom: line, paddingBottom: '3px' }}>Nutrition Facts</div>
      <div style={{ fontSize: '12px', padding: '4px 0 0' }}>Serving Size: {nf.servingSize}</div>
      <div style={{ fontSize: '12px', padding: '1px 0 5px', borderBottom: '6px solid #17110e' }}>No. of Servings per container: {nf.servings}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, padding: '4px 0', borderBottom: line }}>
        <span>Amount per serving</span><span>{nf.pctLabel}</span>
      </div>
      {nf.rows.map((r, i) => (
        <div key={r.name} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px',
          fontSize: '12.5px', padding: '5px 0',
          paddingLeft: r.sub ? '16px' : 0,
          borderBottom: r.head ? '6px solid #17110e' : (i < nf.rows.length - 1 ? line : 'none') }}>
          <span style={{ fontWeight: r.sub ? 400 : 700 }}>
            {r.head ? <span style={{ fontWeight: 800 }}>{r.name}</span> : r.name}
            {r.extra ? <span style={{ fontWeight: 400, marginLeft: '10px' }}>{r.extra}</span> : null}
            {r.value ? <span style={{ fontWeight: 400 }}>&nbsp;{r.value}</span> : null}
          </span>
          <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{r.pct || ''}</span>
        </div>
      ))}
      <div style={{ fontSize: '9.5px', lineHeight: 1.35, color: '#3a2c1a', paddingTop: '7px' }}>{nf.footnote}</div>
    </div>
  );
}

/* Coffee / Capsule tabs - the printed-tab treatment used by both layouts. */
function FormatTabs({ fmt, onFmt, small }) {
  return (
    <div role="tablist" aria-label="Choose a format" style={{ display: 'flex', gap: '6px', width: 'fit-content' }}>
      {ORDER.map((k) => {
        const on = k === fmt;
        return (
          <button key={k} type="button" role="tab" aria-selected={on} onClick={() => onFmt(k)} style={{
            padding: small ? '10px 16px' : '11px 20px', minHeight: '44px',
            border: '1px solid #17110e', borderRadius: '2px', cursor: on ? 'default' : 'pointer',
            fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600,
            fontSize: small ? '12.5px' : '13px', letterSpacing: '.08em', textTransform: 'uppercase',
            background: on ? '#17110e' : 'transparent', color: on ? '#efe6d4' : '#17110e',
            transition: 'background .28s ease, color .28s ease' }}>
            {LABELS[k].tab}
          </button>
        );
      })}
    </div>
  );
}

/* Shared “What's on the pack” modal - renders whichever label is active. */
function LabelModal({ open, onClose, reduce, fmt, onFmt }) {
  const L = LABELS[fmt];
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) {
      document.addEventListener('keydown', onKey);
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
    }
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div id="label-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label="AMAZTRA product label" style={{
        position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: 'clamp(16px,4vh,48px) clamp(14px,4vw,40px)', overflowY: 'auto',
        background: 'rgba(12,10,9,.86)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        animation: reduce ? 'none' : 'am-rise .3s ease' }}>
      <div onClick={(e) => e.stopPropagation()} style={{
          position: 'relative', width: 'min(920px,100%)', margin: 'auto',
          background: '#f4ede0', borderRadius: '14px', overflow: 'hidden',
          boxShadow: '0 40px 90px rgba(0,0,0,.6)', border: '1px solid rgba(122,84,22,.3)',
          animation: reduce ? 'none' : 'nf-pop .45s cubic-bezier(.34,1.4,.5,1)' }}>
        <div style={{ background: '#C11A22', padding: '18px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: '18px', letterSpacing: '.14em', color: '#F6E39A' }}>AMAZTRA</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', letterSpacing: '.24em', color: 'rgba(255,246,230,.85)', textTransform: 'uppercase', marginTop: '3px' }}>{L.kind}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div role="tablist" aria-label="Choose a format" style={{ display: 'flex', gap: '5px' }}>
              {ORDER.map((k) => {
                const on = k === fmt;
                return (
                  <button key={k} type="button" role="tab" aria-selected={on} onClick={() => onFmt(k)} style={{
                    padding: '9px 14px', minHeight: '44px', border: '1px solid rgba(246,227,154,.55)', borderRadius: '2px',
                    cursor: on ? 'default' : 'pointer', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600,
                    fontSize: '12px', letterSpacing: '.08em', textTransform: 'uppercase',
                    background: on ? '#F6E39A' : 'transparent', color: on ? '#7a1119' : '#F6E39A',
                    transition: 'background .28s ease, color .28s ease' }}>
                    {LABELS[k].tab}
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={onClose} aria-label="Close" style={{
              width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(246,227,154,.5)',
              background: 'rgba(23,17,14,.25)', color: '#F6E39A', fontSize: '22px', lineHeight: 1, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>&times;</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'clamp(22px,3vw,34px)', padding: 'clamp(24px,3.4vw,36px)' }}>
          <div>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: '15px', letterSpacing: '.02em', color: '#221a12', textTransform: 'uppercase' }}>Ingredients</div>
            <p style={{ margin: '9px 0 0', fontSize: '13px', lineHeight: 1.62, color: '#4a3c28' }}>{L.ingredients}</p>
            {L.blocks.map((blk) => (
              <div key={blk.h} style={{ marginTop: '18px' }}>
                <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: '13px', letterSpacing: '.02em', color: '#221a12', textTransform: 'uppercase' }}>{blk.h}</div>
                {blk.h === 'Manufactured for' ? (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: '8px' }}>
                    <img src="assets/img/apc-logo.png" alt="Amazing Pharma Corporation logo" style={{ width: '52px', height: '52px', flexShrink: 0, objectFit: 'contain' }} />
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.55, color: '#4a3c28' }}>{blk.b}</p>
                  </div>
                ) : (
                  <p style={{ margin: '6px 0 0', fontSize: '13px', lineHeight: 1.55, color: '#4a3c28' }}>{blk.b}</p>
                )}
              </div>
            ))}
          </div>
          <div>
            <NutritionFactsBox nf={L.nf} />
            <div style={{ marginTop: '16px', fontFamily: "'Space Mono',monospace", fontSize: '11px', color: '#6b5a44', lineHeight: 1.7 }}>
              {L.specs.map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}><span style={{ color: '#8a5f1c' }}>{k}</span><span>{v}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Shared switch motion - "the reprint".
   The label frame never moves: a gold print head sweeps down the column, the
   figures and spec rows wipe out line by line behind it, and the new label
   prints back in. Distinct from Two Formats' split and the orbit's step-up. */
function useReprint({ printRef, headRef, packRef, fmt, setFmt, reduce, onSwapped }) {
  const busy = useRef(false);
  const swap = (next) => {
    if (next === fmt || busy.current) return;
    if (reduce) { setFmt(next); return; }
    const host = printRef.current;
    const rows = host ? [...host.querySelectorAll('[data-print]')] : [];
    const head = headRef.current;
    const pack = packRef.current;
    busy.current = true;

    if (head) {
      head.style.opacity = '1';
      const h = host ? host.offsetHeight : 320;
      const a = head.animate(
        [{ transform: 'translateY(0)' }, { transform: `translateY(${h}px)` }],
        { duration: 620, easing: 'cubic-bezier(.4,0,.5,1)', fill: 'both' });
      a.onfinish = () => { a.cancel(); head.style.opacity = '0'; };
    }
    rows.forEach((r, i) => {
      const a = r.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 0 100%)' }],
        { duration: 240, delay: i * 62, easing: 'cubic-bezier(.5,0,.5,1)', fill: 'both' });
      a.onfinish = () => { a.cancel(); r.style.clipPath = 'inset(0 0 0 100%)'; };
    });
    if (pack) {
      const a = pack.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(14px) scale(.965)' }],
        { duration: 420, easing: 'cubic-bezier(.5,0,.6,1)', fill: 'both' });
      a.onfinish = () => { a.cancel(); pack.style.opacity = '0'; };
    }

    setTimeout(() => {
      setFmt(next);
      requestAnimationFrame(() => {
        const host2 = printRef.current;
        const rows2 = host2 ? [...host2.querySelectorAll('[data-print]')] : [];
        rows2.forEach((r, i) => {
          r.style.clipPath = 'inset(0 100% 0 0)';
          const a = r.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
            { duration: 300, delay: i * 70, easing: 'cubic-bezier(.2,1,.3,1)', fill: 'both' });
          a.onfinish = () => { a.cancel(); r.style.clipPath = 'none'; };
        });
        const pack2 = packRef.current;
        if (pack2) {
          pack2.style.opacity = '1';
          const a = pack2.animate([{ opacity: 0, transform: 'translateY(-10px) scale(1.03)' }, { opacity: 1, transform: 'none' }],
            { duration: 760, delay: 90, easing: 'cubic-bezier(.2,1,.3,1)', fill: 'both' });
          a.onfinish = () => { a.cancel(); pack2.style.opacity = '1'; pack2.style.transform = 'none'; };
        }
        if (onSwapped) onSwapped(next);
        busy.current = false;
      });
    }, 560);
  };
  return swap;
}

/**
 * Read the label - "Peel it back." Coffee and capsule tabs swap between the two
 * real printed labels; the panel re-prints in place. Tapping the pack opens a
 * modal recreating that label in full: an accurate Nutrition Facts panel, the
 * ingredients list, and the allergen / directions / manufacturer blocks.
 */
function WhatsInsideDesktop() {
  const rootRef = useRef(null);
  const pouchRef = useRef(null);
  const peelRef = useRef(null);
  const backRef = useRef(null);
  const calRef = useRef(null);
  const ambientRef = useRef(null);
  const printRef = useRef(null);
  const headRef = useRef(null);
  const packRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [fmt, setFmt] = useState('coffee');
  const reduce = prefersReduce();
  const L = LABELS[fmt];
  const kcalRef = useRef(L.kcal);
  kcalRef.current = L.kcal;

  const countUp = (target) => {
    const cal = calRef.current;
    if (!cal) return;
    const from = parseInt(cal.textContent, 10) || 0;
    const dur = 1300, t0 = performance.now();
    const stepFn = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      cal.textContent = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(stepFn);
    };
    requestAnimationFrame(stepFn);
  };

  const swap = useReprint({
    printRef, headRef, packRef, fmt, setFmt, reduce,
    onSwapped: (next) => {
      const cal = calRef.current;
      if (cal) { cal.textContent = '0'; countUp(LABELS[next].kcal); }
    },
  });

  // Entrance: stagger every element with a blur-rise; the headline peels + stamps;
  // the pack masks in; the calorie counts up as its block arrives.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cols = root.querySelectorAll('[data-reveal]');
    const left = cols[0], right = cols[1];
    const kids = left ? [...left.children] : [];
    const pack = right ? right.querySelector('img') : null;
    const peel = peelRef.current, back = backRef.current, cal = calRef.current;
    const EO = 'cubic-bezier(.2,1,.3,1)';

    if (reduce) {
      cols.forEach((c) => { c.style.opacity = '1'; });
      kids.forEach((k) => { k.style.opacity = '1'; });
      if (pack) { pack.style.transform = 'none'; pack.style.opacity = '1'; }
      if (cal) cal.textContent = String(kcalRef.current);
      return;
    }

    cols.forEach((c) => { c.style.opacity = '1'; });
    if (right) right.style.opacity = '1';
    kids.forEach((k) => { k.style.opacity = '0'; });
    if (pack) { pack.style.animation = 'none'; pack.style.transformOrigin = 'center center'; pack.style.opacity = '0'; pack.style.transform = 'scale(.16)'; }
    if (cal) cal.textContent = '0';
    if (peel) peel.style.opacity = '0';
    if (back) back.style.opacity = '0';

    let fired = false;
    const play = () => {
      if (fired) return; fired = true;
      if (pack) {
        const a = pack.animate([
          { opacity: 0, transform: 'scale(.16)' },
          { opacity: 1, transform: 'scale(1)' },
        ], { duration: 1150, delay: 400, easing: EO, fill: 'both' });
        a.onfinish = () => { a.cancel(); pack.style.opacity = '1'; pack.style.transform = 'none'; pack.style.animation = 'am-float 9s ease-in-out infinite'; };
      }
      kids.forEach((el, i) => {
        const isHead = el.tagName === 'H2';
        el.style.opacity = '1';
        if (isHead) {
          if (peel) { peel.style.opacity = '1'; peel.style.animation = 'wi-peel 1.3s cubic-bezier(.2,1.05,.3,1) both'; }
          if (back) { back.style.opacity = '1'; back.style.animation = 'wi-stamp .9s cubic-bezier(.2,1.5,.35,1) 1.1s both'; }
          return;
        }
        const a = el.animate(
          [{ opacity: 0, transform: 'translateY(30px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
          { duration: 1300, delay: 300 + i * 240, easing: EASE, fill: 'both' });
        a.onfinish = () => { a.cancel(); el.style.opacity = '1'; };
        if (cal && el.contains(cal)) setTimeout(() => countUp(kcalRef.current), 300 + i * 240 + 200);
      });
    };

    const io = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (e.isIntersecting) { play(); io.disconnect(); }
    }), { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    io.observe(root);
    return () => io.disconnect();
  }, [reduce]);

  // ambient roasted beans drifting up behind the type + pack
  useEffect(() => {
    if (reduce) return;
    const host = ambientRef.current;
    if (host && !host.childElementCount) {
      for (let i = 0; i < 13; i++) {
        const b = document.createElement('span');
        const w = 11 + Math.random() * 10;
        b.style.cssText = 'position:absolute;bottom:-44px;left:' + (Math.random() * 100) + '%;width:' + w.toFixed(0) + 'px;height:' + (w * 0.66).toFixed(0) + 'px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#4a2c17,#2a190f);box-shadow:inset 0 0 0 1px rgba(0,0,0,.3);--dx:' + (Math.random() * 80 - 40).toFixed(0) + 'px;--r:' + (Math.random() * 60 - 30).toFixed(0) + 'deg;--r2:' + (Math.random() * 220 - 110).toFixed(0) + 'deg;animation:wi-bean ' + (11 + Math.random() * 8).toFixed(1) + 's linear ' + (Math.random() * 11).toFixed(1) + 's infinite;';
        const seam = document.createElement('span');
        seam.style.cssText = 'position:absolute;left:50%;top:12%;bottom:12%;width:1.5px;background:rgba(0,0,0,.4);transform:translateX(-50%);border-radius:2px;';
        b.appendChild(seam);
        host.appendChild(b);
      }
    }
  }, [reduce]);

  const tilt = (e) => {
    if (open || reduce) return;
    const c = pouchRef.current; if (!c) return;
    const r = c.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    c.style.transform = `perspective(1100px) rotateY(${px * 9}deg) rotateX(${-py * 9}deg) translateY(-6px) scale(1.02)`;
  };
  const untilt = () => { const c = pouchRef.current; if (c) c.style.transform = 'none'; };

  return (
    <section id="whats-inside" ref={rootRef} className="fullpage" style={{
        position: 'relative', background: '#d3c29c', justifyContent: 'flex-start',
        padding: 'clamp(48px,7vh,88px) clamp(24px,6vw,80px) clamp(56px,9vh,110px)',
        fontFamily: "'Space Grotesk',system-ui,sans-serif", overflow: 'hidden' }}>
      <div ref={ambientRef} id="wi-ambient" aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: '1180px', margin: '0 auto', display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
        gap: 'clamp(32px,6vw,72px)', alignItems: 'center' }}>

        <div data-reveal style={{ opacity: 0, order: 2 }}>
          <p style={{ margin: 0, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '13px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#8a5f1c' }}>Read the label</p>
          <h2 className="fp-head" style={{ margin: '18px 0 0', fontFamily: "'Anton',sans-serif", textTransform: 'uppercase', fontSize: 'clamp(48px,7.4vw,86px)', lineHeight: 0.86, letterSpacing: '-.015em', color: '#221a12' }}><span id="wi-peelit" ref={peelRef} style={{ display: 'inline-block', transformOrigin: 'top center', marginRight: '.24em' }}>Peel it</span><span id="wi-back" ref={backRef} style={{ display: 'inline-block', color: '#C11A22' }}>back</span></h2>

          <div style={{ margin: '24px 0 0' }}>
            <FormatTabs fmt={fmt} onFmt={swap} />
          </div>

          <div ref={printRef} style={{ position: 'relative' }}>
            <span ref={headRef} aria-hidden="true" style={{
              position: 'absolute', left: '-6px', right: '-6px', top: 0, height: '2px', opacity: 0, zIndex: 3, pointerEvents: 'none',
              background: 'linear-gradient(90deg,transparent,#C6A24C,#F6E39A,#C6A24C,transparent)',
              boxShadow: '0 0 16px rgba(246,227,154,.75)' }} />

            <p data-print style={{ margin: '22px 0 32px', maxWidth: '40ch', fontSize: 'clamp(16px,1.9vw,20px)', lineHeight: 1.6, color: '#4a3c28', textWrap: 'pretty' }}>{L.lede}</p>

            <div style={{ margin: '0 0 32px', maxWidth: '380px' }}>
              <div data-print style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span id="wi-cal" ref={calRef} style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(96px,15vw,150px)', lineHeight: 0.8, letterSpacing: '-.02em', color: '#221a12' }}>{L.kcal}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '13px', letterSpacing: '.1em', color: '#8a5f1c', marginTop: '14px', lineHeight: 1.5 }}>{L.unit[0]}<br />{L.unit[1]}<br />{L.unit[2]}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 26px', marginTop: '18px', fontFamily: "'Space Mono',monospace" }}>
                {L.macros.map(([k, v]) => (
                  <div key={k} data-print style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderTop: '1px solid rgba(122,84,22,.35)', fontSize: '13.5px', color: '#221a12' }}>
                    <span style={{ color: '#8a5f1c' }}>{k}</span><span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="button" onClick={() => setOpen(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: '11px', padding: '15px 26px', minHeight: '44px',
            border: '1px solid #17110e', borderRadius: '3px', cursor: 'pointer',
            fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '15px', letterSpacing: '.01em',
            color: '#efe6d4', background: '#17110e', boxShadow: '0 12px 26px rgba(60,40,16,.28)' }}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#F6E39A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            Read the Full Label
          </button>
        </div>

        <div data-reveal data-reveal-delay=".12" style={{ opacity: 0, order: 1, alignSelf: L.packBox.self, marginTop: L.packBox.marginTop, marginLeft: L.packBox.marginLeft, display: 'flex', flexDirection: 'column', alignItems: L.packBox.align, gap: 'clamp(6px,1vw,12px)', width: '100%' }}>
          <button type="button" ref={pouchRef} onClick={() => setOpen(true)} onMouseMove={tilt} onMouseLeave={untilt}
            aria-label="Open the AMAZTRA nutrition facts and label"
            style={{ position: 'relative', border: 0, background: 'none', padding: 0, cursor: 'pointer',
              transition: 'transform .3s ease', transformStyle: 'preserve-3d', display: 'block', width: L.packBox.width }}>
            <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '54%', width: '86%', height: '70%', transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(193,26,34,.32), transparent 66%)', filter: 'blur(30px)', zIndex: 0 }} />
            <img ref={packRef} src={L.pack} alt={L.packAlt} style={{ position: 'relative', zIndex: 1, width: '100%', display: 'block', filter: 'none', animation: reduce ? 'none' : 'am-float 9s ease-in-out infinite' }} />
            <span aria-hidden="true" style={{
              position: 'absolute', zIndex: 2, right: '50%', bottom: '8%', transform: 'translateX(50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <span style={{ position: 'relative', width: '58px', height: '58px', borderRadius: '50%',
                background: 'radial-gradient(circle at 38% 32%, rgba(52,40,30,.9), rgba(23,17,14,.82))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(23,17,14,.4), inset 0 1px 0 rgba(246,227,154,.12)',
                animation: reduce ? 'none' : 'tz-press 2.6s ease-in-out infinite' }}>
                {reduce ? null : <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(23,17,14,.4)', animation: 'tz-ring 2.2s ease-out infinite' }} />}
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#F6E39A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3M11 8v6M8 11h6" /></svg>
              </span>
              <span style={{ display: 'flex', gap: '7px' }}>
                {[0, 1, 2].map((d) => (
                  <span key={d} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#17110e', opacity: 0.3, animation: reduce ? 'none' : `tz-dot 1.5s ease-in-out ${d * 0.2}s infinite` }} />
                ))}
              </span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#5a3a20' }}>Tap to zoom</span>
            </span>
          </button>
        </div>
      </div>

      <LabelModal open={open} onClose={() => setOpen(false)} reduce={reduce} fmt={fmt} onFmt={setFmt} />
    </section>
  );
}

/* ============================ MOBILE ============================ */

function useIsMobile(bp = 767) {
  const q = `(max-width:${bp}px)`;
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

function WhatsInsideMobile() {
  const rootRef = useRef(null);
  const calRef = useRef(null);
  const packRef = useRef(null);
  const printRef = useRef(null);
  const headRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [fmt, setFmt] = useState('coffee');
  const reduce = prefersReduce();
  const L = LABELS[fmt];
  const kcalRef = useRef(L.kcal);
  kcalRef.current = L.kcal;

  const countUp = (target) => {
    const cal = calRef.current;
    if (!cal) return;
    const from = parseInt(cal.textContent, 10) || 0;
    const dur = 1300, t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      cal.textContent = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const swap = useReprint({
    printRef, headRef, packRef, fmt, setFmt, reduce,
    onSwapped: (next) => {
      const cal = calRef.current;
      if (cal) { cal.textContent = '0'; countUp(LABELS[next].kcal); }
    },
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = [...root.querySelectorAll('[data-r]')];
    const cal = calRef.current, pack = packRef.current;
    if (reduce) { els.forEach((el) => { el.style.opacity = '1'; }); if (pack) { pack.style.opacity = '1'; pack.style.transform = 'none'; } if (cal) cal.textContent = String(kcalRef.current); return; }
    els.forEach((el) => { el.style.opacity = '0'; });
    if (pack) { pack.style.opacity = '0'; pack.style.transform = 'scale(1.7) rotate(-6deg)'; }
    if (cal) cal.textContent = '0';
    let fired = false;
    const play = () => {
      if (fired) return; fired = true;
      els.forEach((el, i) => {
        el.style.opacity = '1';
        el.animate([{ opacity: 0, transform: 'translateY(26px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 1000, delay: 150 + i * 160, easing: EASE, fill: 'both' });
        if (cal && el.contains(cal)) setTimeout(() => countUp(kcalRef.current), 150 + i * 160 + 150);
      });
      if (pack) { pack.style.opacity = '1'; pack.style.transform = 'none'; pack.animate([{ opacity: 0, transform: 'scale(1.7) rotate(-6deg)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 700, easing: 'cubic-bezier(.2,1.5,.35,1)', fill: 'both' }); }
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { play(); io.disconnect(); } }), { rootMargin: '-30% 0px -30% 0px', threshold: 0 });
    io.observe(root);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <section id="whats-inside" ref={rootRef} className="fullpage" style={{ position: 'relative', minHeight: '100dvh', background: '#d3c29c', overflow: 'hidden', padding: 'clamp(32px,4.5vh,48px) clamp(24px,7vw,32px) clamp(20px,3vh,32px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', fontFamily: "'Space Grotesk',system-ui,sans-serif" }}>
      <p data-r style={{ opacity: reduce ? 1 : 0, margin: 0, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '13px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#8a5f1c' }}>Read the label</p>
      <h2 data-r style={{ opacity: reduce ? 1 : 0, margin: '14px 0 0', fontFamily: "'Anton',sans-serif", textTransform: 'uppercase', fontSize: 'clamp(52px,16vw,68px)', lineHeight: 0.84, letterSpacing: '-.015em', color: '#221a12' }}>Peel it <span style={{ color: '#C11A22' }}>back</span></h2>

      <div data-r style={{ opacity: reduce ? 1 : 0, marginTop: '16px' }}>
        <FormatTabs fmt={fmt} onFmt={swap} small />
      </div>

      <div ref={printRef} style={{ position: 'relative' }}>
        <span ref={headRef} aria-hidden="true" style={{
          position: 'absolute', left: '-4px', right: '-4px', top: 0, height: '2px', opacity: 0, zIndex: 3, pointerEvents: 'none',
          background: 'linear-gradient(90deg,transparent,#C6A24C,#F6E39A,#C6A24C,transparent)',
          boxShadow: '0 0 16px rgba(246,227,154,.75)' }} />
        <div data-r data-print style={{ opacity: reduce ? 1 : 0, display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: '12px' }}>
          <span ref={calRef} style={{ fontFamily: "'Anton',sans-serif", fontSize: 'clamp(104px,30vw,132px)', lineHeight: 0.78, letterSpacing: '-.02em', color: '#221a12' }}>{L.kcal}</span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '13px', letterSpacing: '.1em', color: '#8a5f1c', marginTop: '12px', lineHeight: 1.5 }}>{L.unit[0]}<br />{L.unit[1]}<br />{L.unit[2]}</span>
        </div>
        <div data-r style={{ opacity: reduce ? 1 : 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 26px', marginTop: '10px', fontFamily: "'Space Mono',monospace" }}>
          {L.macros.map(([k, v]) => (
            <div key={k} data-print style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderTop: '1px solid rgba(122,84,22,.35)', fontSize: '13.5px', color: '#221a12' }}><span style={{ color: '#8a5f1c' }}>{k}</span><span>{v}</span></div>
          ))}
        </div>
      </div>

      <div data-r style={{ opacity: reduce ? 1 : 0, position: 'relative', flex: '1 1 0', height: 0, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2px 0' }}>
        <button type="button" onClick={() => setOpen(true)} aria-label="Open the AMAZTRA nutrition facts and label" style={{ position: 'relative', border: 0, background: 'none', padding: 0, cursor: 'pointer', width: 'auto', maxWidth: '92%', alignSelf: 'stretch' }}>
          <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '54%', width: '86%', height: '70%', transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'radial-gradient(circle,rgba(193,26,34,.3),transparent 66%)', filter: 'blur(26px)', zIndex: 0 }} />
          <img ref={packRef} src={L.pack} alt={L.packAlt} style={{ position: 'relative', zIndex: 1, height: '100%', width: 'auto', maxWidth: '100%', display: 'block', animation: reduce ? 'none' : 'am-float 9s ease-in-out infinite' }} />
          <span aria-hidden="true" style={{ position: 'absolute', zIndex: 2, left: '50%', top: '52%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span style={{ position: 'relative', width: '52px', height: '52px', borderRadius: '50%', background: 'radial-gradient(circle at 38% 32%, rgba(52,40,30,.9), rgba(23,17,14,.82))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(23,17,14,.4)', animation: reduce ? 'none' : 'tz-press 2.6s ease-in-out infinite' }}>
              {reduce ? null : <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(23,17,14,.4)', animation: 'tz-ring 2.2s ease-out infinite' }} />}
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#F6E39A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3M11 8v6M8 11h6" /></svg>
            </span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#5a3a20' }}>Tap to zoom</span>
          </span>
        </button>
      </div>

      <button data-r type="button" onClick={() => setOpen(true)} style={{ opacity: reduce ? 1 : 0, alignSelf: 'center', width: 'fit-content', marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '9px', padding: '12px 20px', minHeight: '44px', border: 0, borderRadius: '3px', cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: '14px', color: '#efe6d4', background: '#17110e', boxShadow: '0 12px 26px rgba(60,40,16,.28)' }}>
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#F6E39A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
        Read the Full Label
      </button>
      <LabelModal open={open} onClose={() => setOpen(false)} reduce={reduce} fmt={fmt} onFmt={setFmt} />
    </section>
  );
}

export default function WhatsInside() {
  const isMobile = useIsMobile(767);
  return isMobile ? <WhatsInsideMobile /> : <WhatsInsideDesktop />;
}
