"use client";

import { casablancaNow, type CasablancaNow } from "@/lib/casablanca-time";
import { GIRLS_ONLY, OPENING_HOURS, type OpeningDay } from "@/lib/site-content";
import { useEffect, useState, type CSSProperties } from "react";
import styles from "./location.module.css";

/**
 * The week as a wall of modules, one square per hour of service. Rendered without the
 * clock on the server: the row in force and the « now » line land after mount, in the
 * café's own time zone.
 */
export function HoursBoard() {
  const [moment, setMoment] = useState<ServiceMoment | null>(null);

  useEffect(() => {
    function update() {
      setMoment(serviceMoment(casablancaNow()));
    }

    update();
    const timer = setInterval(update, MINUTE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ "--track-columns": HOUR_STARTS.length } as CSSProperties}>
      <div className={styles.scale} aria-hidden="true">
        <div className={styles.scaleTrack}>
          {SCALE_MARKS.map((minutes) => (
            <span key={minutes} style={{ left: `${trackPosition(minutes) * 100}%` }}>
              {(minutes / 60) % 24}h
            </span>
          ))}
        </div>
      </div>

      <dl>
        {OPENING_HOURS.map((day, row) => {
          const isCurrent = moment?.weekday === day.weekday;

          return (
            <div
              key={day.weekday}
              className={styles.row}
              data-current={isCurrent ? "" : undefined}
            >
              <dt className={styles.day}>
                {day.day}
                {isCurrent ? (
                  <span className={styles.dayTag}>
                    {moment.isNight ? TONIGHT_LABEL : GIRLS_ONLY.todayLabel}
                  </span>
                ) : null}
                {GIRLS_ONLY.days.includes(day.day) ? (
                  <span className={styles.dayTag}>Girls Only</span>
                ) : null}
              </dt>
              <dd className={styles.hours}>{day.label}</dd>
              <dd className={styles.track} aria-hidden="true">
                {HOUR_STARTS.map((start, column) => (
                  <span
                    key={start}
                    className={styles.cell}
                    style={
                      {
                        "--fill": hourCoverage(day, start),
                        "--order": row * 2 + column,
                      } as CSSProperties
                    }
                  />
                ))}
                {isCurrent && moment.position !== null ? (
                  <span className={styles.now} style={{ left: `${moment.position * 100}%` }} />
                ) : null}
              </dd>
            </div>
          );
        })}
      </dl>
      <p className={styles.hoursNote}>{GIRLS_ONLY.closedNote}</p>
    </div>
  );
}

/** The night belongs to the day it started on: at 1h on a Wednesday, Tuesday is still running. */
function serviceMoment(now: CasablancaNow): ServiceMoment {
  const yesterdayWeekday = (now.weekday + 6) % 7;
  const yesterday = OPENING_HOURS.find((day) => day.weekday === yesterdayWeekday);
  const isNight = yesterday?.closesAt != null && now.minutes < yesterday.closesAt - MINUTES_PER_DAY;
  const minutes = isNight ? now.minutes + MINUTES_PER_DAY : now.minutes;

  return {
    weekday: isNight ? yesterdayWeekday : now.weekday,
    isNight,
    position: minutes >= TRACK_START && minutes <= TRACK_END ? trackPosition(minutes) : null,
  };
}

function trackPosition(minutes: number) {
  return (minutes - TRACK_START) / (TRACK_END - TRACK_START);
}

/** Share of that hour the café is open, 0 to 1. Friday opens at 18h30: half a module. */
function hourCoverage(day: OpeningDay, start: number) {
  if (day.opensAt === null || day.closesAt === null) return 0;
  const overlap = Math.min(day.closesAt, start + 60) - Math.max(day.opensAt, start);
  return Math.max(0, overlap) / 60;
}

const MINUTE_MS = 60_000;
const MINUTES_PER_DAY = 24 * 60;

const OPEN_DAYS = OPENING_HOURS.filter((day) => day.opensAt !== null);

// The earliest opening to the latest closing, so the wall follows the real hours.
const TRACK_START = Math.min(...OPEN_DAYS.map((day) => day.opensAt as number));
const TRACK_END = Math.max(...OPEN_DAYS.map((day) => day.closesAt as number));

const HOUR_STARTS = Array.from(
  { length: (TRACK_END - TRACK_START) / 60 },
  (_, index) => TRACK_START + index * 60,
);

const SCALE_MARKS = [TRACK_START, 14 * 60, 18 * 60, 22 * 60, TRACK_END];

const TONIGHT_LABEL = "Cette nuit";

type ServiceMoment = {
  weekday: number;
  isNight: boolean;
  /** Where now falls on the wall, 0 to 1. `null` outside the hours it shows. */
  position: number | null;
};
