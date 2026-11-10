"use client";

import { casablancaNow, getOpenStatus } from "@/lib/casablanca-time";
import { GIRLS_ONLY, OPENING_HOURS, TEMPORARY_CLOSURE } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { useSyncExternalStore } from "react";

/**
 * The café's live state as a pill. The server and the visitor do not share a clock,
 * so nothing is rendered until mount: the box keeps its place, and the live region
 * already exists when the label lands in it.
 */
export function OpenStatus({
  tone = "light",
  className,
}: {
  /** The background it sits on. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const minute = useCafeMinute();
  const status = minute === null ? null : getOpenStatus(new Date(minute * MINUTE_MS));
  const colors = PILL_COLORS[tone];

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={cn("inline-flex min-h-9 max-w-full min-w-[calc(26ch+3rem)] font-mono text-xs", className)}
    >
      {status ? (
        <span
          className={cn(
            "inline-flex min-h-9 items-center gap-2.5 rounded-full border px-3.5 font-medium whitespace-nowrap animate-in fade-in duration-700",
            status.isOpen ? colors.open : colors.closed,
          )}
        >
          <StatusDot isOpen={status.isOpen} color={colors.dot} />
          {status.label}
        </span>
      ) : null}
    </div>
  );
}

/**
 * The seven days as a real table, with the row in force picked out after mount.
 * Fixed row heights and a column of spare room: picking it out shifts nothing.
 */
export function OpeningHoursTable({
  labelledBy,
  className,
}: {
  labelledBy?: string;
  className?: string;
}) {
  const minute = useCafeMinute();
  // Closed for a while, no day is « today »: the table shows the usual week.
  const current =
    minute === null || TEMPORARY_CLOSURE ? null : currentServiceDay(new Date(minute * MINUTE_MS));

  return (
    <table
      aria-labelledby={labelledBy}
      className={cn(
        "w-full border-collapse border-y-2 border-espresso-950 font-mono text-[0.9375rem] leading-none lg:text-base",
        className,
      )}
    >
      <tbody>
        {OPENING_HOURS.map((entry) => {
          const isCurrent = current?.weekday === entry.weekday;
          const isClosed = entry.opensAt === null;

          return (
            <tr
              key={entry.weekday}
              aria-current={isCurrent ? "date" : undefined}
              className={cn(
                "h-[3.25rem] border-b border-espresso-950/15 last:border-b-0 lg:h-14",
                isClosed && !isCurrent && CLOSED_HATCH,
                isCurrent && "bg-terracotta-700 text-cream-50",
              )}
            >
              <th
                scope="row"
                className={cn(
                  "pl-3 text-left font-normal whitespace-nowrap",
                  isClosed && !isCurrent && "text-terracotta-700",
                  (isCurrent || isClosed) && "font-semibold",
                )}
              >
                {entry.day}
                {isCurrent ? (
                  <span className="text-eyebrow ml-3 text-gold-200 max-[359px]:sr-only">
                    {current.label}
                  </span>
                ) : null}
                {GIRLS_ONLY.days.includes(entry.day) ? (
                  <span className="text-eyebrow ml-3 max-[359px]:sr-only">Girls Only</span>
                ) : null}
              </th>
              <td
                className={cn(
                  "pr-3 text-right whitespace-nowrap",
                  isClosed && !isCurrent && "text-terracotta-700",
                  (isCurrent || isClosed) && "font-semibold",
                )}
              >
                {entry.label}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function StatusDot({ isOpen, color }: { isOpen: boolean; color: string }) {
  if (!isOpen) {
    return (
      <span className="size-2 rounded-full border-[1.5px] border-current" aria-hidden="true" />
    );
  }

  return (
    <span className="relative size-2" aria-hidden="true">
      <span
        className={cn(
          "absolute inset-0 rounded-full opacity-60 animate-ping motion-reduce:hidden",
          color,
        )}
      />
      <span className={cn("absolute inset-0 rounded-full", color)} />
    </span>
  );
}

/** The current minute, `null` on the server and during hydration. */
function useCafeMinute() {
  return useSyncExternalStore(subscribeToMinutes, currentMinute, serverMinute);
}

function subscribeToMinutes(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;

  // Re-aimed at each minute boundary: the pill flips at 18h30 sharp, timers drift or not.
  function schedule() {
    timer = setTimeout(() => {
      onChange();
      schedule();
    }, MINUTE_MS - (Date.now() % MINUTE_MS));
  }

  schedule();
  // Background tabs throttle timers: catch up as soon as the tab is back.
  document.addEventListener("visibilitychange", onChange);

  return () => {
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", onChange);
  };
}

function currentMinute() {
  return Math.floor(Date.now() / MINUTE_MS);
}

function serverMinute() {
  return null;
}

/**
 * The night belongs to the day it started on: at 1h on a Monday the Sunday row is the
 * one in force, the same answer `getOpenStatus` gives. Only then is the label not « today ».
 */
function currentServiceDay(date: Date) {
  const now = casablancaNow(date);
  const yesterday = OPENING_HOURS.find((entry) => entry.weekday === (now.weekday + 6) % 7);
  const isNightOfYesterday =
    yesterday?.closesAt != null && now.minutes < yesterday.closesAt - MINUTES_PER_DAY;

  return isNightOfYesterday
    ? { weekday: (now.weekday + 6) % 7, label: TONIGHT_LABEL }
    : { weekday: now.weekday, label: TODAY_LABEL };
}

const MINUTE_MS = 60_000;
const MINUTES_PER_DAY = 24 * 60;

const TODAY_LABEL = "Aujourd’hui";
const TONIGHT_LABEL = "Cette nuit";

// Hatching means « no access » on a floor plan: closed reads at a glance, colour or not.
const CLOSED_HATCH =
  "bg-[repeating-linear-gradient(135deg,hsl(var(--terracotta-700)/0.16)_0_1px,transparent_1px_7px)]";

const PILL_COLORS = {
  light: {
    open: "border-terracotta-700 bg-terracotta-700 text-cream-50",
    closed: "border-espresso-950/30 text-espresso-950",
    dot: "bg-cream-50",
  },
  dark: {
    open: "border-gold-400 bg-gold-400 text-espresso-950",
    closed: "border-cream-50/30 text-cream-50",
    dot: "bg-espresso-950",
  },
};
