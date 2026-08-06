import { useEffect, useState } from 'react';

function parts(targetMs) {
  const diff = Math.max(0, targetMs - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    done: diff === 0,
  };
}

// Live countdown to an ISO date string (interpreted in the visitor's local time).
// Updates every second. Purely informational, so it runs under reduced motion too.
export function useCountdown(iso) {
  const targetMs = new Date(iso).getTime();
  const [t, setT] = useState(() => parts(targetMs));
  useEffect(() => {
    const id = setInterval(() => setT(parts(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  return t;
}
