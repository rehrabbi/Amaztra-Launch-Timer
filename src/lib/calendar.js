// Build "add to calendar" links for the launch. The launch is a local-time
// moment (midnight, August 18, 2026), so we model it as an all-day event on
// that date, which reads correctly in every calendar app regardless of zone.
import { LAUNCH_ISO, LAUNCH_DATE_LABEL } from '../content.js';

const TITLE = 'AMAZTRA opens';
const DETAILS = 'AMAZTRA opens today. You joined the waitlist, so you are first in.';

// YYYYMMDD for the launch day and the day after (all-day events are end-exclusive).
function dayStamps() {
  const start = new Date(LAUNCH_ISO);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const ymd = (d) =>
    String(d.getFullYear()) +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0');
  return { start: ymd(start), end: ymd(end) };
}

// Google Calendar template link (opens in a new tab). Good one-click path.
export function googleCalendarUrl() {
  const { start, end } = dayStamps();
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: TITLE,
    dates: `${start}/${end}`,
    details: DETAILS,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

// Universal .ics as a data: URL, for Apple Calendar, Outlook, and imports.
export function icsDataUrl() {
  const { start, end } = dayStamps();
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AMAZTRA//Launch Timer//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:amaztra-launch-${start}@amaztra`,
    `SUMMARY:${TITLE}`,
    `DESCRIPTION:${DETAILS}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(lines.join('\r\n'));
}

export const CALENDAR_FILENAME = 'amaztra-launch.ics';
export const CALENDAR_LABEL = `Add ${LAUNCH_DATE_LABEL} to your calendar`;
