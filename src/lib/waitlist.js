// Waitlist submission. Posts to a Formspree-compatible JSON endpoint set in
// VITE_WAITLIST_ENDPOINT (a public form URL, not a secret). If no endpoint is
// configured we return 'unconfigured' and NEVER fake a successful signup.
//
// Set it in a local .env file (see .env.example):
//   VITE_WAITLIST_ENDPOINT=https://formspree.io/f/xxxxxxx

import { track } from './analytics.js';

const ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT || '';
const STORE_KEY = 'amaztra_waitlist_email';

export const isWaitlistConfigured = () => Boolean(ENDPOINT);

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function alreadyJoined(email) {
  try {
    return localStorage.getItem(STORE_KEY) === email.trim().toLowerCase();
  } catch {
    return false;
  }
}

function remember(email) {
  try {
    localStorage.setItem(STORE_KEY, email.trim().toLowerCase());
  } catch {
    /* storage may be unavailable; non-fatal */
  }
}

// Returns one of: 'ok' | 'duplicate' | 'invalid' | 'error' | 'unconfigured'
export async function submitWaitlist(email, meta = {}) {
  const clean = (email || '').trim();
  if (!EMAIL_RE.test(clean)) return 'invalid';
  if (alreadyJoined(clean)) return 'duplicate';
  if (!ENDPOINT) return 'unconfigured';

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: clean, source: 'soft-launch', ...meta }),
    });
    if (res.ok) {
      remember(clean);
      // Privacy-friendly: record that a signup happened, with no email or PII.
      track('waitlist_signup', { form: meta.form || 'default' });
      return 'ok';
    }
    // Formspree returns 422 with an errors array for rejected submissions.
    return 'error';
  } catch {
    return 'error';
  }
}
