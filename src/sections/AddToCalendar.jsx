import { googleCalendarUrl, icsDataUrl, CALENDAR_FILENAME, CALENDAR_LABEL } from '../lib/calendar.js';
import { track } from '../lib/analytics.js';

// Small, unobtrusive "add to calendar" affordance for the launch day.
// Google is the one-click path; the .ics link covers Apple, Outlook, and the rest.
export default function AddToCalendar() {
  return (
    <p className="atc">
      <a
        className="atc__link"
        href={googleCalendarUrl()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('add_to_calendar', { kind: 'google' })}
      >
        {CALENDAR_LABEL}
      </a>
      <a
        className="atc__ics"
        href={icsDataUrl()}
        download={CALENDAR_FILENAME}
        onClick={() => track('add_to_calendar', { kind: 'ics' })}
      >
        Apple, Outlook (.ics)
      </a>
    </p>
  );
}
