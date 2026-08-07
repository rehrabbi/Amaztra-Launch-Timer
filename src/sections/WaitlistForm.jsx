import { useId, useState } from 'react';
import { submitWaitlist, isWaitlistConfigured, EMAIL_RE } from '../lib/waitlist.js';
import { CTA_LABEL } from '../content.js';
import { Check, Arrow } from './icons.jsx';

const MESSAGES = {
  invalidFirst: { tone: 'error', text: 'Please enter your first name.' },
  invalidLast: { tone: 'error', text: 'Please enter your last name.' },
  invalid: { tone: 'error', text: 'Please enter a valid email address.' },
  duplicate: { tone: 'ok', text: 'You are already on the list. Thank you.' },
  error: { tone: 'error', text: 'Something went wrong. Please try again in a moment.' },
  unconfigured: { tone: 'error', text: 'Signups are not open just yet. Please check back soon.' },
};

// Accessible waitlist form with full states: idle, validating, loading,
// success, duplicate, error, and not-configured. Collects a required first and
// last name plus email. Never fakes a success.
export default function WaitlistForm({ id = 'default', dark = false }) {
  const firstId = useId();
  const lastId = useId();
  const inputId = useId();
  const msgId = useId();
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | ok | duplicate | invalidFirst | invalidLast | invalid | error | unconfigured
  const [hp, setHp] = useState(''); // honeypot

  const done = status === 'ok' || status === 'duplicate';
  const firstInvalid = status === 'invalidFirst';
  const lastInvalid = status === 'invalidLast';
  const emailInvalid = status === 'invalid' || status === 'error';
  const msg = MESSAGES[status];

  const resetIfIdle = () => {
    if (status !== 'idle' && status !== 'loading') setStatus('idle');
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (status === 'loading' || done) return;
    if (hp) return; // bot filled the honeypot; ignore silently
    if (!first.trim()) {
      setStatus('invalidFirst');
      return;
    }
    if (!last.trim()) {
      setStatus('invalidLast');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setStatus('invalid');
      return;
    }
    setStatus('loading');
    const firstName = first.trim();
    const lastName = last.trim();
    const result = await submitWaitlist(email, {
      form: id,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
    });
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
      <div className="wl__names">
        <div className="field">
          <label htmlFor={firstId}>First name</label>
          <input
            id={firstId}
            type="text"
            name="firstName"
            autoComplete="given-name"
            placeholder="First name"
            value={first}
            onChange={(e) => { setFirst(e.target.value); resetIfIdle(); }}
            aria-invalid={firstInvalid}
            aria-describedby={firstInvalid ? msgId : undefined}
            disabled={status === 'loading'}
            required
          />
        </div>
        <div className="field">
          <label htmlFor={lastId}>Last name</label>
          <input
            id={lastId}
            type="text"
            name="lastName"
            autoComplete="family-name"
            placeholder="Last name"
            value={last}
            onChange={(e) => { setLast(e.target.value); resetIfIdle(); }}
            aria-invalid={lastInvalid}
            aria-describedby={lastInvalid ? msgId : undefined}
            disabled={status === 'loading'}
            required
          />
        </div>
      </div>
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
            onChange={(e) => { setEmail(e.target.value); resetIfIdle(); }}
            aria-invalid={emailInvalid}
            aria-describedby={msg && !firstInvalid && !lastInvalid ? msgId : undefined}
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
      </div>
      <p id={msgId} className="field__msg" data-tone={msg ? msg.tone : undefined} role="status" aria-live="polite">
        {msg ? msg.text : ''}
      </p>
      {import.meta.env.DEV && !isWaitlistConfigured() && (
        <p className="wl__hint">Dev note: VITE_WAITLIST_ENDPOINT not set, so live signups are disabled.</p>
      )}
    </form>
  );
}
