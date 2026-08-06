import { useId, useState } from 'react';
import { submitWaitlist, isWaitlistConfigured, EMAIL_RE } from '../lib/waitlist.js';
import { CTA_LABEL } from '../content.js';
import { Check, Arrow } from './icons.jsx';

const MESSAGES = {
  invalid: { tone: 'error', text: 'Please enter a valid email address.' },
  duplicate: { tone: 'ok', text: 'You are already on the list. Thank you.' },
  error: { tone: 'error', text: 'Something went wrong. Please try again in a moment.' },
  unconfigured: { tone: 'error', text: 'Signups are not open just yet. Please check back soon.' },
};

// Accessible waitlist form with full states: idle, validating, loading,
// success, duplicate, error, and not-configured. Never fakes a success.
export default function WaitlistForm({ id = 'default', dark = false }) {
  const inputId = useId();
  const msgId = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | ok | duplicate | invalid | error | unconfigured
  const [hp, setHp] = useState(''); // honeypot

  const done = status === 'ok' || status === 'duplicate';
  const invalid = status === 'invalid' || status === 'error';
  const msg = MESSAGES[status];

  async function onSubmit(e) {
    e.preventDefault();
    if (status === 'loading' || done) return;
    if (hp) return; // bot filled the honeypot; ignore silently
    if (!EMAIL_RE.test(email.trim())) {
      setStatus('invalid');
      return;
    }
    setStatus('loading');
    const result = await submitWaitlist(email, { form: id });
    setStatus(result);
  }

  if (done) {
    return (
      <div className={`wl wl--done${dark ? ' wl--dark' : ''}`} role="status" aria-live="polite">
        <span className="wl__tick" aria-hidden="true"><Check size={20} /></span>
        <div>
          <p className="wl__done-title">
            {status === 'duplicate' ? 'You are already on the list.' : 'You are on the list.'}
          </p>
          <p className="wl__done-sub">We will send one gentle note the moment AMAZTRA opens.</p>
        </div>
      </div>
    );
  }

  return (
    <form className={`wl${dark ? ' wl--dark' : ''}`} onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor={inputId}>Email address</label>
        <div className="wl__row">
          <input
            id={inputId}
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (status !== 'idle' && status !== 'loading') setStatus('idle'); }}
            aria-invalid={invalid}
            aria-describedby={msg ? msgId : undefined}
            disabled={status === 'loading'}
            required
          />
          {/* honeypot: hidden from users + assistive tech, catches bots */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="wl__hp"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? (
              <>
                <span className="spinner" aria-hidden="true" />
                <span>Joining</span>
              </>
            ) : (
              <>
                <span>{CTA_LABEL}</span>
                <Arrow size={17} />
              </>
            )}
          </button>
        </div>
        <p id={msgId} className="field__msg" data-tone={msg ? msg.tone : undefined} role="status" aria-live="polite">
          {msg ? msg.text : ''}
        </p>
      </div>
      {import.meta.env.DEV && !isWaitlistConfigured() && (
        <p className="wl__hint">Dev note: VITE_WAITLIST_ENDPOINT not set, so live signups are disabled.</p>
      )}
    </form>
  );
}
