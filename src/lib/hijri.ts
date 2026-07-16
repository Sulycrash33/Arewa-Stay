// Gregorian <-> Hijri conversion using the tabular (arithmetic) Islamic
// calendar, the same well-established algorithm used by most calendar
// libraries (sometimes called the "Kuwaiti algorithm"). This is a
// calculated approximation: it can differ by a day from a given country's
// official moon-sighting announcement for Ramadan/Eid. We say so plainly
// in the UI rather than presenting it as religious authority.

const HIJRI_MONTHS = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
];

export interface HijriDate { year: number; month: number; day: number; }

function gregorianToJulianDay(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
}

function julianDayToGregorian(jd: number): { year: number; month: number; day: number } {
  jd = Math.floor(jd);
  const a = jd + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

export function gregorianToHijri(date: Date): HijriDate {
  const jd = gregorianToJulianDay(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  let l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  l2 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l2) / 709);
  const day = l2 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day };
}

export function hijriToGregorian(h: HijriDate): Date {
  const jd = h.day + Math.ceil(29.5 * (h.month - 1)) + (h.year - 1) * 354 + Math.floor((3 + 11 * h.year) / 30) + 1948440 - 385;
  const g = julianDayToGregorian(jd);
  return new Date(g.year, g.month - 1, g.day);
}

export function formatHijri(date: Date): string {
  const h = gregorianToHijri(date);
  return `${h.day} ${HIJRI_MONTHS[h.month - 1]} ${h.year} AH`;
}

export interface IslamicEvent { name: string; start: Date; end: Date; }

/** Ramadan, Eid al-Fitr, and Eid al-Adha date ranges falling within (or
 * overlapping) the given Gregorian year, calculated, not moon-sighting
 * confirmed. Checks the Hijri years that could plausibly overlap. */
export function getIslamicEventsForYear(gregorianYear: number): IslamicEvent[] {
  const events: IslamicEvent[] = [];
  const approxHijriYear = gregorianToHijri(new Date(gregorianYear, 5, 1)).year;

  for (const hYear of [approxHijriYear - 1, approxHijriYear, approxHijriYear + 1]) {
    const ramadanStart = hijriToGregorian({ year: hYear, month: 9, day: 1 });
    const ramadanEnd = hijriToGregorian({ year: hYear, month: 9, day: 29 });
    const eidFitr = hijriToGregorian({ year: hYear, month: 10, day: 1 });
    const eidAdhaStart = hijriToGregorian({ year: hYear, month: 12, day: 9 });
    const eidAdhaEnd = hijriToGregorian({ year: hYear, month: 12, day: 13 });

    if (ramadanStart.getFullYear() === gregorianYear || ramadanEnd.getFullYear() === gregorianYear) {
      events.push({ name: 'Ramadan', start: ramadanStart, end: ramadanEnd });
    }
    if (eidFitr.getFullYear() === gregorianYear) {
      events.push({ name: 'Eid al-Fitr', start: eidFitr, end: eidFitr });
    }
    if (eidAdhaStart.getFullYear() === gregorianYear) {
      events.push({ name: 'Eid al-Adha', start: eidAdhaStart, end: eidAdhaEnd });
    }
  }
  return events.sort((a, b) => a.start.getTime() - b.start.getTime());
}

/** Does the given stay range overlap any Ramadan/Eid period? Returns the
 * first matching event, if any, so the booking UI can show festival pricing. */
export function findOverlappingIslamicEvent(checkIn: Date, checkOut: Date): IslamicEvent | null {
  const years = new Set([checkIn.getFullYear(), checkOut.getFullYear()]);
  for (const year of years) {
    for (const event of getIslamicEventsForYear(year)) {
      if (checkIn <= event.end && checkOut >= event.start) return event;
    }
  }
  return null;
}
