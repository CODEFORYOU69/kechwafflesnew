import {
  CLOSURE_NOTICE,
  GIRLS_ONLY,
  frenchClock,
  type CafeSchedule,
  type OpeningDay,
} from "./site-content";

/**
 * Date logic for the café's own clock. Call these after mount only: the server and
 * the visitor do not share a time, and rendering them on the server breaks hydration.
 */

export type CasablancaNow = {
  year: number;
  month: number;
  day: number;
  /** 0 is Sunday. */
  weekday: number;
  minutes: number;
};

export function casablancaNow(date: Date = new Date()): CasablancaNow {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Casablanca",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    year: Number(read("year")),
    month: Number(read("month")),
    day: Number(read("day")),
    weekday: WEEKDAYS.indexOf(read("weekday")),
    minutes: Number(read("hour")) * 60 + Number(read("minute")),
  };
}

export type OpenStatus = {
  isOpen: boolean;
  /** Example: « Ouvert · jusqu’à 2h » or « Fermé · ouvre mardi à 11h · Girls Only ». */
  label: string;
};

export function getOpenStatus(schedule: CafeSchedule, date: Date = new Date()): OpenStatus {
  if (schedule.isTemporarilyClosed) return { isOpen: false, label: CLOSURE_NOTICE.status };
  const now = casablancaNow(date);
  const today = dayFor(schedule.days, now.weekday);
  const yesterday = dayFor(schedule.days, (now.weekday + 6) % 7);

  const isOpenFromYesterday =
    yesterday.closesAt !== null && now.minutes < yesterday.closesAt - MINUTES_PER_DAY;
  const isOpenToday =
    today.opensAt !== null &&
    today.closesAt !== null &&
    now.minutes >= today.opensAt &&
    now.minutes < today.closesAt;

  if (isOpenFromYesterday || isOpenToday) {
    const closing = isOpenFromYesterday ? yesterday : today;
    return {
      isOpen: true,
      label: withGirlsOnly(
        `Ouvert · jusqu’à ${frenchClock(closing.closesAt as number)}`,
        closing,
      ),
    };
  }

  if (today.opensAt !== null && now.minutes < today.opensAt) {
    return { isOpen: false, label: withGirlsOnly(`Fermé · ouvre à ${frenchClock(today.opensAt)}`, today) };
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const next = dayFor(schedule.days, (now.weekday + offset) % 7);
    if (next.opensAt !== null) {
      const when = offset === 1 ? "demain" : next.day.toLowerCase();
      return {
        isOpen: false,
        label: withGirlsOnly(`Fermé · ouvre ${when} à ${frenchClock(next.opensAt)}`, next),
      };
    }
  }

  return { isOpen: false, label: "Fermé" };
}

export type UpcomingDay = {
  weekday: number;
  /** Example: « mardi 10 novembre », « mardi 1er décembre ». */
  label: string;
  isToday: boolean;
};

/** The next date of each weekday, today included until the café closes. */
export function upcomingWeekdays(
  days: OpeningDay[],
  weekdays: number[],
  date: Date = new Date(),
): UpcomingDay[] {
  const now = casablancaNow(date);
  // Before closing time the café is still running yesterday's evening, if there was one.
  const yesterday = dayFor(days, (now.weekday + 6) % 7);
  const isStillYesterday =
    yesterday.closesAt !== null && now.minutes < yesterday.closesAt - MINUTES_PER_DAY;
  const startWeekday = isStillYesterday ? (now.weekday + 6) % 7 : now.weekday;
  const startDay = isStillYesterday ? now.day - 1 : now.day;

  const upcoming = weekdays.map((weekday) => {
    const offset = (weekday - startWeekday + 7) % 7;
    const target = new Date(Date.UTC(now.year, now.month - 1, startDay + offset));
    return {
      weekday,
      offset,
      label: DATE_LABEL.format(target).replace(" 1 ", " 1er "),
      isToday: offset === 0,
    };
  });

  return upcoming
    .sort((first, second) => first.offset - second.offset)
    .map(({ weekday, label, isToday }) => ({ weekday, label, isToday }));
}

/** Those days the café is reserved for women: the status has to say so. */
function withGirlsOnly(label: string, day: OpeningDay) {
  return GIRLS_ONLY.days.includes(day.day) ? `${label} · Girls Only` : label;
}

function dayFor(days: OpeningDay[], weekday: number): OpeningDay {
  return days.find((entry) => entry.weekday === weekday) as OpeningDay;
}

const MINUTES_PER_DAY = 24 * 60;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DATE_LABEL = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
