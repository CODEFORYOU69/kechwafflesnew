"use client";

import { Reveal } from "@/components/motion/Reveal";
import { casablancaNow, upcomingWeekdays, type UpcomingDay } from "@/lib/casablanca-time";
import { GIRLS_ONLY, OPENING_HOURS } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import styles from "./GirlsOnlySection.module.css";

/**
 * The week as an arcade: seven doors on the wall, two of them lit. The doors are in
 * the server HTML. Today and the next date wait for mount, in space already reserved,
 * so nothing shifts and nothing mismatches.
 */
export function WeekStrip() {
  const calendar = useCafeCalendar();
  const next = calendar?.rendezVous[0];
  const [nextWeekday, nextDate] = next ? splitDayLabel(next.label) : [NBSP, NBSP];

  return (
    <div className={styles.strip}>
      <div className={styles.stripInfo}>
        <p className={cn("text-eyebrow", styles.stripLabel)}>{GIRLS_ONLY.weekLabel}</p>
        <p className={styles.next} data-ready={next ? "" : undefined}>
          <span className={cn("text-eyebrow", styles.nextLabel)}>
            {next ? (next.isToday ? GIRLS_ONLY.todayLabel : GIRLS_ONLY.nextLabel) : NBSP}
          </span>{" "}
          <span className={styles.nextDate}>
            <span>{nextWeekday}</span> <span>{nextDate}</span>
          </span>
        </p>
      </div>

      <Reveal y={24} className={styles.arcadeWrap}>
        <ol className={styles.arcade} aria-label={WEEK_LIST_LABEL}>
          {OPENING_HOURS.map((entry, index) => {
            const isLit = GIRLS_ONLY.days.includes(entry.day);
            const isToday = calendar?.todayWeekday === entry.weekday;

            return (
              <li
                key={entry.weekday}
                className={styles.door}
                data-lit={isLit ? "" : undefined}
                aria-current={isToday ? "date" : undefined}
              >
                <span className={styles.doorFrame}>
                  {isLit ? (
                    <span
                      className={styles.doorLight}
                      style={{ transitionDelay: `${0.25 + index * 0.08}s` }}
                    />
                  ) : null}
                  <span className={styles.doorText}>
                    <span className={styles.doorName} aria-hidden="true">
                      {entry.short}
                    </span>
                    <span className="sr-only">
                      {isLit ? `${entry.day}, ${GIRLS_ONLY_NAME}` : entry.day}
                    </span>
                    <span className={styles.doorHours}>
                      <span className="sr-only">, </span>
                      {entry.label}
                    </span>
                  </span>
                </span>
                {isToday ? (
                  <span className={cn("text-eyebrow", styles.doorToday)}>
                    {GIRLS_ONLY.todayLabel}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </Reveal>
    </div>
  );
}

/** The café's clock, read after mount only. `null` on the server and during hydration. */
function useCafeCalendar() {
  const [calendar, setCalendar] = useState<CafeCalendar | null>(null);

  useEffect(() => {
    function refresh() {
      setCalendar(readCalendar());
    }

    refresh();
    // A tab left open overnight would otherwise keep offering a date that has passed.
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, []);

  return calendar;
}

function readCalendar(): CafeCalendar {
  const now = casablancaNow();
  // Before 2 a.m. the library still counts yesterday as the café's day.
  const todayWeekday = upcomingWeekdays(ALL_WEEKDAYS)[0].weekday;
  const isStillYesterday = todayWeekday !== now.weekday;

  return {
    rendezVous: upcomingWeekdays(GIRLS_WEEKDAYS),
    todayWeekday,
    minutes: isStillYesterday ? now.minutes + MINUTES_PER_DAY : now.minutes,
  };
}

/** Splits « mardi 10 novembre » into « mardi » and « 10 novembre ». */
function splitDayLabel(label: string) {
  const [weekday, ...date] = label.split(" ");
  return [weekday, date.join(" ")];
}

const NBSP = "\u00A0";
const MINUTES_PER_DAY = 24 * 60;
const GIRLS_ONLY_NAME = "Girls Only";
const WEEK_LIST_LABEL = "La semaine, du lundi au dimanche";

const GIRLS_DAYS = OPENING_HOURS.filter((entry) => GIRLS_ONLY.days.includes(entry.day));
const GIRLS_WEEKDAYS = GIRLS_DAYS.map((entry) => entry.weekday);
const ALL_WEEKDAYS = OPENING_HOURS.map((entry) => entry.weekday);

type CafeCalendar = {
  /** The Girls Only days, soonest first. */
  rendezVous: UpcomingDay[];
  /** Weekday the café is living: until 2 a.m. it is still yesterday. */
  todayWeekday: number;
  /** Minutes into the café's day: 1 a.m. reads as 25h, like the closing times. */
  minutes: number;
};
