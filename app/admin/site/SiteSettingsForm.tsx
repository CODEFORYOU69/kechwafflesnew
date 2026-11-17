"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { GIRLS_ONLY, WEEK, hoursLabel } from "@/lib/site-content";
import {
  HOME_SECTIONS,
  clockToMinutes,
  closingAfter,
  minutesToClock,
  type SiteSettings,
} from "@/lib/site-settings";
import { cn } from "@/lib/utils";
import { useMemo, useState, type ReactNode } from "react";

/**
 * One form, one save: the sections, the closure and the hours go to the site together.
 * Times are typed as on a clock; a closing at or before the opening is the next morning.
 */
export function SiteSettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const [saved, setSaved] = useState(initialSettings);
  const [sections, setSections] = useState(initialSettings.sections);
  const [isTemporarilyClosed, setIsTemporarilyClosed] = useState(
    initialSettings.isTemporarilyClosed,
  );
  const [days, setDays] = useState(() => toDayRows(initialSettings));
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const draft = useMemo(
    () => toSettings(sections, isTemporarilyClosed, days),
    [sections, isTemporarilyClosed, days],
  );
  const isDirty = !draft.settings || !isSameSettings(draft.settings, saved);
  const warnings = draft.settings ? girlsOnlyWarnings(draft.settings) : [];

  function updateDay(weekday: number, change: Partial<DayRow>) {
    setDays((rows) => rows.map((row) => (row.weekday === weekday ? { ...row, ...change } : row)));
    setStatus({ kind: "idle" });
  }

  async function save() {
    if (!draft.settings) return;
    setStatus({ kind: "saving" });
    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft.settings),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus({ kind: "error", message: body.error ?? SAVE_FAILED });
        return;
      }
      setSaved(body.settings);
      setStatus({ kind: "saved" });
    } catch {
      setStatus({ kind: "error", message: SAVE_FAILED });
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
      className="space-y-6"
    >
      <Panel
        title="Sections de l’accueil"
        description="Une section masquée disparaît de la page d’accueil, avec son lien dans le menu ; les autres se renumérotent. La porte d’entrée et « Nous trouver » restent toujours affichées. Les pages dédiées (Café IA, Girls Only…) ne changent pas."
      >
        <ul className="divide-y divide-cream-50/10">
          {HOME_SECTIONS.map((section) => (
            <li key={section.id}>
              <ToggleRow
                id={`section-${section.id}`}
                label={section.label}
                hint={section.hint}
                checked={sections[section.id]}
                onChange={(checked) => {
                  setSections((current) => ({ ...current, [section.id]: checked }));
                  setStatus({ kind: "idle" });
                }}
              />
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        title="Fermeture temporaire"
        description="Activée : un bandeau « Fermé temporairement » sur toutes les pages, et la pastille d’ouverture, la FAQ et la page anglaise l’annoncent. Les horaires ci-dessous restent affichés comme horaires habituels."
      >
        <ToggleRow
          id="temporary-closure"
          label="Le café est fermé temporairement"
          hint={isTemporarilyClosed ? CLOSURE_ON : CLOSURE_OFF}
          stateLabels={["Activée", "Désactivée"]}
          checked={isTemporarilyClosed}
          onChange={(checked) => {
            setIsTemporarilyClosed(checked);
            setStatus({ kind: "idle" });
          }}
        />
      </Panel>

      <Panel
        title="Horaires d’ouverture"
        description="Heure du Maroc. Une fermeture plus tôt que l’ouverture compte pour le lendemain : 11:00 – 02:00 se lit « 11h – 2h »."
      >
        <div className="divide-y divide-cream-50/10">
          {days.map((row) => (
            <DayEditor
              key={row.weekday}
              row={row}
              onChange={(change) => updateDay(row.weekday, change)}
            />
          ))}
        </div>
        {warnings.length > 0 ? (
          <ul className="mt-4 space-y-1 rounded-md border border-gold-400/40 bg-gold-400/10 p-3 text-sm text-gold-200">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        ) : null}
      </Panel>

      {/* On a phone, room on the right for the floating WhatsApp button. */}
      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-cream-50/15 bg-espresso-900/95 p-4 pr-[4.5rem] shadow-xl sm:pr-4">
        <p role="status" aria-live="polite" className={cn("text-sm", statusColor(status, draft))}>
          {statusText(status, draft, isDirty)}
        </p>
        <Button
          type="submit"
          disabled={!draft.settings || !isDirty || status.kind === "saving"}
          className="min-h-11 px-6"
        >
          {status.kind === "saving" ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-cream-50/15 bg-espresso-900 p-5 sm:p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-cream-300">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ToggleRow({
  id,
  label,
  hint,
  stateLabels = ["Affichée", "Masquée"],
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  /** What the switch reads when on, then off. */
  stateLabels?: [string, string];
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <label htmlFor={id} className="cursor-pointer">
        <span className="block font-medium">{label}</span>
        <span className="block text-sm text-cream-300">{hint}</span>
      </label>
      <div className="flex items-center gap-3">
        <span
          className={cn("text-xs font-medium", checked ? "text-gold-400" : "text-cream-400")}
          aria-hidden="true"
        >
          {checked ? stateLabels[0] : stateLabels[1]}
        </span>
        <Switch id={id} checked={checked} onCheckedChange={onChange} />
      </div>
    </div>
  );
}

function DayEditor({
  row,
  onChange,
}: {
  row: DayRow;
  onChange: (change: Partial<DayRow>) => void;
}) {
  const preview = dayPreview(row);

  return (
    <fieldset className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 py-3 sm:grid-cols-[7rem_auto_1fr]">
      <legend className="sr-only">{row.day}</legend>
      <span className="font-medium" aria-hidden="true">
        {row.day}
      </span>
      <div className="flex items-center gap-2 justify-self-end sm:justify-self-start">
        <Switch
          id={`open-${row.weekday}`}
          checked={row.isOpen}
          onCheckedChange={(isOpen) => onChange({ isOpen })}
          aria-label={`${row.day} : ouvert`}
        />
        <span className="w-12 text-sm text-cream-300" aria-hidden="true">
          {row.isOpen ? "Ouvert" : "Fermé"}
        </span>
      </div>
      <div className="col-span-2 flex flex-wrap items-center gap-x-3 gap-y-2 sm:col-span-1">
        {row.isOpen ? (
          <>
            <TimeField
              label={`${row.day}, ouverture`}
              value={row.opens}
              onChange={(opens) => onChange({ opens })}
            />
            <span className="text-cream-400" aria-hidden="true">
              –
            </span>
            <TimeField
              label={`${row.day}, fermeture`}
              value={row.closes}
              onChange={(closes) => onChange({ closes })}
            />
          </>
        ) : null}
        <span className={cn("text-sm", preview.isError ? "text-terracotta-300" : "text-cream-300")}>
          {preview.text}
        </span>
      </div>
    </fieldset>
  );
}

function TimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Input
      type="time"
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-[7.5rem] font-mono [color-scheme:dark]"
    />
  );
}

/** « 11h – 2h, fermeture le lendemain », or what is missing. */
function dayPreview(row: DayRow) {
  if (!row.isOpen) return { text: "", isError: false };
  const hours = rowHours(row);
  if (!hours) return { text: "Heures à compléter", isError: true };
  const nextMorning = hours.closesAt > MINUTES_PER_DAY ? ", fermeture le lendemain" : "";
  return { text: `${hoursLabel(hours.opensAt, hours.closesAt)}${nextMorning}`, isError: false };
}

function rowHours(row: DayRow) {
  const opensAt = clockToMinutes(row.opens);
  const closesAt = clockToMinutes(row.closes);
  if (opensAt === null || closesAt === null) return null;
  return { opensAt, closesAt: closingAfter(opensAt, closesAt) };
}

/** The settings to send, `null` while an open day misses a time. */
function toSettings(
  sections: SiteSettings["sections"],
  isTemporarilyClosed: boolean,
  days: DayRow[],
): { settings: SiteSettings | null; incomplete: string[] } {
  const incomplete = days.filter((row) => row.isOpen && !rowHours(row)).map((row) => row.day);
  if (incomplete.length > 0) return { settings: null, incomplete };

  return {
    incomplete,
    settings: {
      sections,
      isTemporarilyClosed,
      hours: days.map((row) => {
        const hours = row.isOpen ? rowHours(row) : null;
        return {
          weekday: row.weekday,
          opensAt: hours?.opensAt ?? null,
          closesAt: hours?.closesAt ?? null,
        };
      }),
    },
  };
}

/** Field by field: the key order of a stored JSON is not the form's. */
function isSameSettings(first: SiteSettings, second: SiteSettings) {
  return (
    first.isTemporarilyClosed === second.isTemporarilyClosed &&
    HOME_SECTIONS.every((section) => first.sections[section.id] === second.sections[section.id]) &&
    WEEK.every(({ weekday }) => {
      const a = first.hours.find((day) => day.weekday === weekday);
      const b = second.hours.find((day) => day.weekday === weekday);
      return a?.opensAt === b?.opensAt && a?.closesAt === b?.closesAt;
    })
  );
}

/** The Girls Only copy names Tuesday and Thursday, with their hours when they match. */
function girlsOnlyWarnings(settings: SiteSettings) {
  const girlsDays = WEEK.filter((entry) => GIRLS_ONLY.days.includes(entry.day)).map((entry) => ({
    ...entry,
    hours: settings.hours.find((day) => day.weekday === entry.weekday),
  }));
  const closed = girlsDays.filter((day) => day.hours?.opensAt == null);
  const warnings = closed.map(
    (day) => `${day.day} est un jour Girls Only : fermé, il contredit les textes Girls Only du site.`,
  );

  const open = girlsDays.filter((day) => day.hours?.opensAt != null);
  const isShared = open.every(
    (day) =>
      day.hours?.opensAt === open[0]?.hours?.opensAt &&
      day.hours?.closesAt === open[0]?.hours?.closesAt,
  );
  if (closed.length === 0 && !isShared) {
    warnings.push(
      "Mardi et jeudi n’ont plus les mêmes horaires : les textes Girls Only n’annoncent plus d’heures.",
    );
  }
  return warnings;
}

function toDayRows(settings: SiteSettings): DayRow[] {
  return WEEK.map((entry) => {
    const hours = settings.hours.find((day) => day.weekday === entry.weekday);
    const isOpen = hours?.opensAt != null && hours.closesAt != null;
    return {
      weekday: entry.weekday,
      day: entry.day,
      isOpen,
      opens: isOpen ? minutesToClock(hours.opensAt as number) : DEFAULT_OPENS,
      closes: isOpen ? minutesToClock(hours.closesAt as number) : DEFAULT_CLOSES,
    };
  });
}

function statusText(status: Status, draft: ReturnType<typeof toSettings>, isDirty: boolean) {
  if (status.kind === "saving") return "Enregistrement en cours…";
  if (status.kind === "error") return status.message;
  if (!draft.settings) return `Heures à compléter : ${draft.incomplete.join(", ")}.`;
  if (status.kind === "saved") return "Enregistré : le site affiche les nouveaux réglages.";
  return isDirty ? "Modifications non enregistrées." : "Le site est à jour.";
}

function statusColor(status: Status, draft: ReturnType<typeof toSettings>) {
  if (status.kind === "error" || !draft.settings) return "text-terracotta-300";
  if (status.kind === "saved") return "text-gold-400";
  return "text-cream-300";
}

const MINUTES_PER_DAY = 24 * 60;
const DEFAULT_OPENS = "11:00";
const DEFAULT_CLOSES = "02:00";
const CLOSURE_ON = "Activée : le site annonce la fermeture.";
const CLOSURE_OFF = "Désactivée : le site calcule l’ouverture en direct, avec les horaires ci-dessous.";
const SAVE_FAILED = "L’enregistrement a échoué. Vérifiez la connexion et réessayez.";

type DayRow = {
  weekday: number;
  day: string;
  isOpen: boolean;
  /** « 11:00 », as the time input gives it. */
  opens: string;
  closes: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };
