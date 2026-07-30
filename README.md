<div align="center">

# &#9749; AMAZTRA

### Beauty you can brew and take.

A cinematic single-page site for **AMAZTRA**, a beauty-from-within supplement by
Amazing Pharma Corporation, made in two formats: an instant-coffee sachet and a
daily capsule, sharing the same six actives.

<p>
  <img alt="Vite 5" src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white">
  <img alt="React 18" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black">
  <img alt="Custom CSS" src="https://img.shields.io/badge/styling-custom%20CSS-C6A24C">
  <img alt="Deploy Vercel" src="https://img.shields.io/badge/deploy-Vercel-000000?logo=vercel&logoColor=white">
  <img alt="Reduced motion ready" src="https://img.shields.io/badge/a11y-reduced--motion-2ea44f">
</p>

</div>

---

## Overview

AMAZTRA reads top to bottom as one continuous story: a loader hands off to a
cinematic hero, the page moves one full screen per scroll, and each section carries
a single signature motion. It is built with **Vite 5** and **React 18**, styled
entirely in scoped inline styles plus a shared set of `@keyframes` in
`src/index.css`. No CSS framework.

Every content section ships a **dedicated mobile layout** alongside the desktop one,
and every animation has a full `prefers-reduced-motion` fallback.

## Highlights

- **One story, one scroll.** A scroll navigator (`src/nav.js`) plus CSS scroll-snap
  advance exactly one section per scroll on both desktop and mobile.
- **Two formats, one system.** Coffee and capsule are shown side by side, and the
  Origin and What's Inside sections switch between them with a toggle.
- **Motion with a safety net.** Reveals use `IntersectionObserver` + the Web
  Animations API; ambient loops and reveals stand down under reduced motion.
- **Tuned media.** Clips are served as web-encoded MP4s with WebP imagery and lazy
  loading; the full-quality source clips are archived out of the build.

## The page

| # | Section | Signature motion |
|---|---------|------------------|
| 1 | **Intro** loader | A tablet flattens and zooms through into the hero on a single scroll, with a "Scroll to Enter" cue. |
| 2 | **Hero** | "Beauty you can brew and take" masthead; one scroll flies the box and pouch to centre, plays the lifestyle clip, and opens branded doors onto the story. Carries the order button. |
| 3 | **Origin** (`Story`) | "Beauty shouldn't feel like work, it should brew." The lines rise, a red strike wipes the crossed-out word, and a Coffee / Capsule toggle cross-dissolves the copy and clip. |
| 4 | **Ritual** | The morning reframed as an order card whose steps pop-fill in sequence. |
| 5 | **Two Ways** (`TwoWays`) | Coffee and capsule as matching cards, so neither reads as the add-on. |
| 6 | **Ingredients** | Six actives in an orbit on desktop, a swipeable rotator on mobile, with relative bars and a capsule multiplier. |
| 7 | **What's Inside** (`WhatsInside`) | The printed label, with a Coffee / Capsule tab pair and a tap-to-zoom nutrition panel. |
| 8 | **Payoff** (`Benefits`) | A dark poster with a lit gold "GLOW" and a compounding results chart that draws in on scroll. |
| 9 | **Good to Know** (`Faq`) | A self-playing SMS thread on desktop; a tap-a-question chat on mobile. |
| 10 | **Final CTA** (`FinalCta`) | The closing "Formula Map": layered pouch, box, blister and sachet, two crossfading models, and the shop call to action. |

## Tech stack

| Area | Choice |
|------|--------|
| Build | Vite 5 (dev server + production build) |
| UI | React 18 (`createRoot`) |
| Styling | Scoped inline styles + shared keyframes in `src/index.css` (no framework) |
| Motion | `IntersectionObserver` + Web Animations API, `cubic-bezier(.23,1,.32,1)` easing |
| Fonts | Anton, Bricolage Grotesque, Cinzel, Space Grotesk (Google Fonts) |
| Media | Web-encoded MP4 + WebP, lazy-loaded; originals archived in `media-originals/` |

## Project structure

```
index.html                  # fonts + root mount
src/
  main.jsx                  # React entry
  App.jsx                   # intro gate + section composition
  nav.js                    # scroll navigator, section handoffs, branded doors
  data.js                   # ingredients, dose data, pouch path, outbound links
  index.css                 # resets, keyframes, shared helpers, responsive rules
  imgFallback.js            # WebP with a graceful fallback
  useLazyVideo.js           # load clips only as they come into view
  components/
    Intro.jsx               # tablet loader, one-scroll flatten + hand-off
    Hero.jsx                # masthead scene, product duo, order button
    Story.jsx               # Origin, Coffee/Capsule toggle
    Ritual.jsx              # order-card morning
    TwoWays.jsx             # coffee and capsule, side by side
    Ingredients.jsx         # orbit (desktop) / rotator (mobile)
    WhatsInside.jsx         # printed label + nutrition panel
    Benefits.jsx            # Payoff poster + results chart
    Faq.jsx                 # Good to Know chat
    FinalCta.jsx            # Formula Map closing scene
public/assets/
  img/                      # WebP + PNG product art
  video/                    # web-tuned .mp4 clips + poster stills
media-originals/            # full-quality source clips, kept out of the build
```

## Getting started

```bash
npm install
npm run dev        # http://localhost:5502
```

Production build:

```bash
npm run build      # outputs to dist/
npm run preview    # serve the build locally
```

## Deployment

The site is a static build and deploys to **Vercel**. Connect the repository once
(Framework: Vite, Build: `npm run build`, Output: `dist`), and every push to `main`
ships to production while pull requests get their own preview URL.

## Before launch

- **Shop link:** `LINKS.shop` in `src/data.js` is a placeholder. Set the real store URL.
- **Nutrition facts:** the figures in `WhatsInside.jsx` are transcribed from the packs.
  Re-check them against the current approved label.
- **Compliance:** AMAZTRA is a food supplement with no approved therapeutic claims.
  Keep the copy responsible: it supports a beauty-from-within routine, it is not a cure.

---

<div align="center">

Amazing Pharma Corporation, Antipolo City, Rizal, Philippines. All rights reserved.

</div>
