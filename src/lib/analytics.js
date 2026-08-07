// Privacy-friendly, provider-agnostic analytics. We do not bundle or load any
// tracker here. This simply forwards a named event to whatever tool the deploy
// host has already put on the page (Plausible, Umami, GA/gtag, Vercel Analytics),
// and always dispatches a DOM CustomEvent so anything can listen. No personal
// data is sent: we pass the event name and coarse, non-identifying props only.
//
// To actually record events, add ONE of these to the page (e.g. in index.html
// or via the host dashboard): Plausible, Umami, Google Analytics, or Vercel
// Analytics. If none is present, track() is a harmless no-op beyond the event.

export function track(event, props = {}) {
  try {
    // 1) Always emit a DOM event, so custom listeners can react.
    window.dispatchEvent(new CustomEvent('amaztra:' + event, { detail: props }));

    // 2) Plausible / Umami share a compatible call shape.
    if (typeof window.plausible === 'function') window.plausible(event, { props });
    if (window.umami && typeof window.umami.track === 'function') window.umami.track(event, props);

    // 3) Google Analytics (gtag).
    if (typeof window.gtag === 'function') window.gtag('event', event, props);

    // 4) Vercel Analytics custom events.
    if (window.va && typeof window.va === 'function') window.va('event', { name: event, ...props });
  } catch {
    /* analytics must never break the app */
  }
}
