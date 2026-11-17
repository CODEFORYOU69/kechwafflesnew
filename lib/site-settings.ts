import {
  DEFAULT_IS_TEMPORARILY_CLOSED,
  DEFAULT_WEEKLY_HOURS,
  WEEK,
  openingDays,
  type CafeSchedule,
  type DayHours,
} from "./site-content";

/**
 * What the admin sets in `/admin/site`: the home sections shown, the opening hours and the
 * temporary closure. Pure, for the form and the server alike; the database side lives in
 * `site-settings.server.ts`.
 */
export type SiteSettings = {
  sections: HomeSections;
  hours: DayHours[];
  isTemporarilyClosed: boolean;
};

/**
 * The home sections that can be hidden, in page order. Their id is their anchor on `/`. The
 * hero and « Nous trouver » always stay: the door, and where to find the café.
 */
export const HOME_SECTIONS = [
  { id: "cafe", label: "Café de spécialité", hint: "Le comptoir, les torréfactions et les signatures." },
  { id: "carte", label: "La carte", hint: "Les croffles et les pâtisseries du jour." },
  { id: "girls-only", label: "Girls Only", hint: "Les mardis et jeudis réservés aux filles." },
  { id: "cafe-ia", label: "Café IA", hint: "Le Café IA et le service informatique pour les étudiants." },
  { id: "prestations", label: "Prestations", hint: "Le corner gaufres pour les événements." },
] as const;

export type HomeSectionId = (typeof HOME_SECTIONS)[number]["id"];
export type HomeSections = Record<HomeSectionId, boolean>;

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  sections: Object.fromEntries(HOME_SECTIONS.map((section) => [section.id, true])) as HomeSections,
  hours: DEFAULT_WEEKLY_HOURS,
  isTemporarilyClosed: DEFAULT_IS_TEMPORARILY_CLOSED,
};

export function cafeSchedule(settings: SiteSettings): CafeSchedule {
  return { days: openingDays(settings.hours), isTemporarilyClosed: settings.isTemporarilyClosed };
}

/** A `/#cafe` link points at a home section: it goes when the section is hidden. */
export function isLinkShown(href: string, sections: HomeSections) {
  const section = HOME_SECTIONS.find((item) => href === `/#${item.id}`);
  return !section || sections[section.id];
}

/** « 01 », « 02 »… for the home sections shown, then « Nous trouver » right after them. */
export function homeSectionIndexes(sections: HomeSections) {
  const shown = HOME_SECTIONS.filter((section) => sections[section.id]);
  const indexes = Object.fromEntries(
    shown.map((section, position) => [section.id, twoDigits(position + 1)]),
  ) as Partial<Record<HomeSectionId, string>>;
  return { ...indexes, visite: twoDigits(shown.length + 1) };
}

/**
 * What the admin sends, checked field by field. Errors are in French, for the form: a day
 * that closes before it opens closes the next morning, so 11h – 2h is stored 660 – 1560.
 */
export function validateSiteSettings(
  input: unknown,
): { ok: true; settings: SiteSettings } | { ok: false; errors: string[] } {
  if (!isRecord(input)) return { ok: false, errors: ["Réglages illisibles."] };
  const errors: string[] = [];

  const sections = isRecord(input.sections) ? input.sections : null;
  if (!sections || HOME_SECTIONS.some((section) => typeof sections[section.id] !== "boolean")) {
    errors.push("Chaque section doit être activée ou désactivée.");
  }

  if (typeof input.isTemporarilyClosed !== "boolean") {
    errors.push("La fermeture temporaire doit être activée ou désactivée.");
  }

  const hours = Array.isArray(input.hours) ? input.hours : null;
  if (!hours || hours.length !== WEEK.length) {
    errors.push("Les horaires doivent couvrir les sept jours.");
  } else {
    for (const entry of WEEK) {
      const day = hours.find((item) => isRecord(item) && item.weekday === entry.weekday);
      const problem = day ? dayHoursProblem(day) : "horaires manquants";
      if (problem) errors.push(`${entry.day} : ${problem}.`);
    }
  }

  if (errors.length > 0 || !sections || !hours) return { ok: false, errors };

  return {
    ok: true,
    settings: {
      sections: Object.fromEntries(
        HOME_SECTIONS.map((section) => [section.id, sections[section.id] as boolean]),
      ) as HomeSections,
      hours: WEEK.map(({ weekday }) => {
        const day = hours.find((item) => item.weekday === weekday) as DayHours;
        return { weekday, opensAt: day.opensAt, closesAt: day.closesAt };
      }),
      isTemporarilyClosed: input.isTemporarilyClosed as boolean,
    },
  };
}

/**
 * The stored row, read leniently: a part that does not parse falls back to its default, so a
 * bad value never takes the site down. `null` when the admin has never saved.
 */
export function parseStoredSettings(
  row: { sections: unknown; openingHours: unknown; isTemporarilyClosed: boolean } | null,
): SiteSettings {
  if (!row) return DEFAULT_SITE_SETTINGS;

  const sections = isRecord(row.sections) ? row.sections : {};
  const hours = validateSiteSettings({
    sections: DEFAULT_SITE_SETTINGS.sections,
    hours: row.openingHours,
    isTemporarilyClosed: row.isTemporarilyClosed,
  });

  return {
    sections: Object.fromEntries(
      HOME_SECTIONS.map((section) => [
        section.id,
        typeof sections[section.id] === "boolean" ? sections[section.id] : true,
      ]),
    ) as HomeSections,
    hours: hours.ok ? hours.settings.hours : DEFAULT_SITE_SETTINGS.hours,
    isTemporarilyClosed: row.isTemporarilyClosed,
  };
}

/** « 18:30 » for a time input; past midnight counts again from 00:00. */
export function minutesToClock(minutes: number) {
  const time = minutes % MINUTES_PER_DAY;
  return `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`;
}

/** The minutes of a « 18:30 » time input, `null` when it is empty or malformed. */
export function clockToMinutes(clock: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(clock);
  if (!match) return null;
  const [hours, minutes] = [Number(match[1]), Number(match[2])];
  return hours < 24 && minutes < 60 ? hours * 60 + minutes : null;
}

/** A closing at or before the opening is the next morning. */
export function closingAfter(opensAt: number, closesAtClock: number) {
  return closesAtClock <= opensAt ? closesAtClock + MINUTES_PER_DAY : closesAtClock;
}

function dayHoursProblem(day: Record<string, unknown>) {
  const { opensAt, closesAt } = day;
  if (opensAt === null && closesAt === null) return null;
  if (!isMinute(opensAt) || opensAt >= MINUTES_PER_DAY) return "heure d’ouverture invalide";
  if (!isMinute(closesAt)) return "heure de fermeture invalide";
  if (closesAt <= opensAt || closesAt > opensAt + MINUTES_PER_DAY) {
    return "la fermeture doit suivre l’ouverture, dans les 24 heures";
  }
  return null;
}

function isMinute(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}

const MINUTES_PER_DAY = 24 * 60;
