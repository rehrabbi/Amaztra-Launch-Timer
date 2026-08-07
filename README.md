# Amaztra Launch Timer

A soft-launch / waitlist site for **AMAZTRA** (a beauty-from-within coffee and capsule), built around a **live countdown to the August 18, 2026 launch**. Visitors watch the timer, learn the gist, and join the email waitlist.

This is a **separate site** from the product landing page at https://amaztra.vercel.app. That page stays live and is linked from here as "Visit AMAZTRA Page". This launch timer should deploy to its **own URL**, not replace the product page.

---

## What it is

A single-page, centered, immersive scroll experience:

**Hero (live countdown)** to **Story** to **The honest part** to **Visit AMAZTRA Page (invite)** to **Join the Waitlist** to **Footer**.

The goal is anticipation plus signups. Full product detail (ingredients, FAQ, how it works) intentionally lives on the product page, not here; this site points people there.

## Tech stack

- **Vite + React 18**, hand-written CSS (design tokens in `src/index.css`).
- **GSAP + ScrollTrigger** for section pinning and scroll reveals. No smooth-scroll library: native scroll is kept so keyboard scrolling works.
- **No backend.** The waitlist form posts to a Formspree-compatible endpoint.

## Run it

```bash
npm install
npm run dev       # http://localhost:5502
npm run build     # production build to dist/
npm run preview
```

## Project structure

- `src/main.jsx` — entry. CSS load order matters: `index.css` then `sections.css` then `immersive.css`.
- `src/App.jsx` — composes the sections, inits motion, handles deep-link scroll.
- `src/content.js` — **all copy and config** (launch date, CTA labels, landing URL). Edit copy here first.
- `src/lib/` — `motion.js` (GSAP setup + `scrollToId`), `useGsap.js`, `useCountdown.js`, `hooks.js` (reveal / reduced-motion / media query), `waitlist.js` (form submit).
- `src/sections/` — `Header`, `Hero`, `Story`, `Trust`, `MoreInfo`, `Join`, `Footer`, `StickyCta`, `WaitlistForm`, `Ph` (placeholder marker), `icons`.
- `src/index.css` — design tokens + base + form / accordion / reveal utilities.
- `src/sections.css`, `src/immersive.css` — section layout (immersive loads last and wins the cascade).

## Design rules (keep these)

- **Warm-light editorial.** Ivory background, ink text, **red is the only interactive accent**, gold is decorative. **Cinzel** display + **Space Grotesk** body.
- **No em dashes** anywhere: code, copy, comments, commit messages. Use commas, colons, periods.
- **Original copy only.** Do not reuse hooks or sentences from the product landing page. Only plain product facts are shared here.
- **Only the two real products** (coffee pouch + capsule pack) as imagery, at their true proportions (no stretching).
- Motion respects `prefers-reduced-motion`: GSAP effects are skipped and static fallbacks render.
- **Everything is centered.**

## Commit rules (important)

- Author: **Jireh Rabbi R. Bernardo <jirehrabbi1202@gmail.com>**.
- **Zero AI attribution.** Plain human commit messages. No "Co-Authored-By", no "Generated with", no mention of any assistant in messages, code, comments, filenames, or docs. Scan the diff before every commit.

---

## What to do next (for the next session)

### Required before launch

1. **Wire the waitlist backend.** Set `VITE_WAITLIST_ENDPOINT` in a local `.env` (see `.env.example`) and in the deploy host. Use a Formspree form (`https://formspree.io/f/xxxxxxx`) or any compatible JSON endpoint. Until it is set, the form validates input and shows "Signups are not open just yet"; it **never fakes a successful signup**. A local `.env` scaffold already exists, waiting for the endpoint.
2. **Deploy to its own URL** (Vercel or Netlify, static `dist/`). Do **not** point it at `amaztra.vercel.app`; that address is the product page. Once the real URL is known, update `canonical` and `og:url` in `index.html` (they currently point at the product page, which tells search engines to treat this as a duplicate of it).
3. **Confirm the launch moment.** The countdown targets `2026-08-18T00:00:00` in the visitor's local time (`LAUNCH_ISO` in `src/content.js`). Confirmed as local midnight.

### Done

- **Analytics:** a privacy-friendly `waitlist_signup` event fires on successful signup, with no email or PII. See `src/lib/analytics.js` (provider-agnostic: forwards to Plausible / Umami / GA / Vercel Analytics if present, and always emits a DOM `CustomEvent`). Wired in `src/lib/waitlist.js`.
- **Add to calendar:** the hero countdown has "Add to calendar" links (Google + universal `.ics`) for August 18. See `src/lib/calendar.js` and `src/sections/AddToCalendar.jsx`.
- **Pruned unused assets.** Removed every unused image and **all** videos from `public/assets`. Kept the three displayed images **and their `.png` siblings**, which `src/imgFallback.js` uses as a WebP fallback: `amaztra-box`, `pouch/clean-front`, `apc-logo` (both `.webp` and `.png` each), plus favicon/icons and `og-image.jpg`.
- **robots.txt** added at `public/robots.txt`.
- **Lighthouse (desktop preset, production build):** Performance 99, Accessibility 100, Best Practices 100, SEO 100. Main JS weight is GSAP (~97 kB gzipped).
- **Mobile checked** at 375px: no horizontal overflow, countdown and calendar links fit.

### Recommended additions (still open)

- **Social image:** replace `public/og-image.jpg` with a launch-timer-specific image (the current one is from the product page). Titles/OG tags are in `index.html`.
- **Duplicate handling:** server-side dedupe needs the backend; the form currently dedupes per browser via `localStorage`.
- **Perf polish (optional, already 99):** the Google Fonts stylesheet is render-blocking (~400 ms); consider `preconnect` + async swap. GSAP is the bulk of the JS.

### Known limitations

- **Deep-link precision:** loading a fresh page at an anchor like `/#more` can land slightly off because the pinned Story section shifts element offsets (a ScrollTrigger behavior). In-page nav clicks are unaffected.
- There are currently **no placeholders** on the page. If a brand timeline is re-added later, use the `Ph` component so placeholders stay clearly marked.

---

## Quick reference

- **Launch date:** August 18, 2026 (`LAUNCH_ISO`, `LAUNCH_DATE_LABEL` in `src/content.js`).
- **Primary CTA:** "Join the Waitlist" (`CTA_LABEL`).
- **Secondary CTA:** "Visit AMAZTRA Page" (`VISIT_LABEL`) linking to `LANDING_URL` (https://amaztra.vercel.app).
- **Section order:** Hero, Story, Trust, MoreInfo, Join, Footer.
