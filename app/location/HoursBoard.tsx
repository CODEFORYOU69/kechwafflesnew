"use client";

import { casablancaNow, type CasablancaNow } from "@/lib/casablanca-time";
import { GIRLS_ONLY, type CafeSchedule, type OpeningDay } from "@/lib/site-content";
import { useEffect, useState, type CSSProperties } from "react";
import styles from "./location.module.css";

/**
 * The week as a wall of modules, one square per hour of service. Rendered without the
 * clock on the server: the row in force and the « now » line land after mount, in the
 * café's own time zone.
 */
export function HoursBoard({ schedule }: { schedule: CafeSchedule }) {
  const { days, isTemporarilyClosed } = schedule;
  const [moment, setMoment] = useState<ServiceMoment | null>(null);
  const track = boardTrack(days);

  useEffect(() => {
    // Closed for a while: no row in force, no « now » line on hours that do not run.
    if (isTemporarilyClosed) return;
    const { start, end } = boardTrack(days);
    function update() {
      setMoment(serviceMoment(days, casablancaNow(), start, end));
    }

    update();
    const timer = setInterval(update, MINUTE_MS);
    return () => clearInterval(timer);
  }, [days, isTemporarilyClosed]);

  return (
    <div style={{ "--track-columns": track.hourStarts.length } as CSSProperties}>
      <div className={styles.scale} aria-hidden="true">
        <div className={styles.scaleTrack}>
          {track.scaleMarks.map((minutes) => (
            <span
              key={minutes}
              style={{ left: `${trackPosition(minutes, track.start, track.end) * 100}%` }}
            >
              {(minutes / 60) % 24}h
            </span>
          ))}
        </div>
      </div>

      <dl>
        {days.map((day, row) => {
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
                {track.hourStarts.map((start, column) => (
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
function serviceMoment(
  days: OpeningDay[],
  now: CasablancaNow,
  start: number,
  end: number,
): ServiceMoment {
  const yesterdayWeekday = (now.weekday + 6) % 7;
  const yesterday = days.find((day) => day.weekday === yesterdayWeekday);
  const isNight = yesterday?.closesAt != null && now.minutes < yesterday.closesAt - MINUTES_PER_DAY;
  const minutes = isNight ? now.minutes + MINUTES_PER_DAY : now.minutes;

  return {
    weekday: isNight ? yesterdayWeekday : now.weekday,
    isNight,
    position: minutes >= start && minutes <= end ? trackPosition(minutes, start, end) : null,
  };
}

function trackPosition(minutes: number, start: number, end: number) {
  return (minutes - start) / (end - start);
}

/**
 * The earliest opening to the latest closing, on whole hours, so the wall follows the real
 * hours. A week with no open day keeps the usual span, 11h to 2h.
 */
function boardTrack(days: OpeningDay[]) {
  const open = days.filter((day) => day.opensAt !== null && day.closesAt !== null);
  const start = open.length
    ? Math.floor(Math.min(...open.map((day) => day.opensAt as number)) / 60) * 60
    : DEFAULT_TRACK_START;
  const end = open.length
    ? Math.ceil(Math.max(...open.map((day) => day.closesAt as number)) / 60) * 60
    : DEFAULT_TRACK_END;
  const hourStarts = Array.from({ length: (end - start) / 60 }, (_, index) => start + index * 60);
  // Every four hours from 14h, inside the wall, between its two ends.
  const between = SCALE_STEPS.filter((minutes) => minutes > start + 60 && minutes < end - 60);

  return { start, end, hourStarts, scaleMarks: [start, ...between, end] };
}

/** Share of that hour the café is open, 0 to 1. Friday opens at 18h30: half a module. */
function hourCoverage(day: OpeningDay, start: number) {
  if (day.opensAt === null || day.closesAt === null) return 0;
  const overlap = Math.min(day.closesAt, start + 60) - Math.max(day.opensAt, start);
  return Math.max(0, overlap) / 60;
}

const MINUTE_MS = 60_000;
const MINUTES_PER_DAY = 24 * 60;

const DEFAULT_TRACK_START = 11 * 60;
const DEFAULT_TRACK_END = 26 * 60;
const SCALE_STEPS = [14 * 60, 18 * 60, 22 * 60, 26 * 60, 30 * 60, 34 * 60, 38 * 60];

const TONIGHT_LABEL = "Cette nuit";

type ServiceMoment = {
  weekday: number;
  isNight: boolean;
  /** Where now falls on the wall, 0 to 1. `null` outside the hours it shows. */
  position: number | null;
};
