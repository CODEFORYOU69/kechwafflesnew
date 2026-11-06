import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";
import styles from "./AICafeSection.module.css";

/**
 * The emblem's square kufic redrawn as a one-line circuit. Every stroke of the logo
 * sits on a lattice two modules apart, so its centre lines are already traces: the
 * arches get quantised into steps, stroke ends become pads, the flame becomes pixels.
 *
 * - `section`: the door stands on the terminal, its strokes plug into the window's top.
 * - `bus`: the same current leaves the terminal towards the three pillars.
 * - `hero`: the large version of /cafe-ia. Traced on load rather than on scroll, because
 *   it is already on screen when the page opens.
 */
export function KuficCircuit({
  variant,
  className,
}: {
  variant: "section" | "bus" | "hero";
  className?: string;
}) {
  if (variant === "bus") {
    return (
      <div className={cn(styles.circuit, styles.circuitBus, className)} aria-hidden="true">
        <Schematic drawing={BUS} />
      </div>
    );
  }

  const [wide, narrow] = variant === "hero" ? [HERO_WIDE, HERO_NARROW] : [DOOR_WIDE, DOOR_NARROW];

  return (
    <div
      className={cn(
        styles.circuit,
        variant === "hero" ? styles.circuitOnLoad : styles.circuitOnScroll,
        className,
      )}
      aria-hidden="true"
    >
      <Schematic drawing={narrow} className={styles.circuitNarrow} />
      <Schematic drawing={wide} className={styles.circuitWide} />
    </div>
  );
}

/** The last period of a title, in the colour of the pads: the headline joins the circuit. */
export function AccentedPeriod({ line }: { line: string }) {
  if (!line.endsWith(".")) return line;
  return (
    <>
      {line.slice(0, -1)}
      <span className="text-zellige-400">.</span>
    </>
  );
}

function Schematic({ drawing, className }: { drawing: Drawing; className?: string }) {
  const { viewBox, origin, unit, traces, nodes, pad, flame, pins } = drawing;

  return (
    <svg viewBox={`0 0 ${viewBox[0]} ${viewBox[1]}`} className={className} focusable="false">
      {traces.map((trace, index) => (
        <path
          key={index}
          d={tracePath(trace, origin, unit)}
          pathLength={1}
          className={cn(styles.trace, TONE_CLASS[trace.tone])}
          style={timingStyle(trace.draw)}
        />
      ))}

      {pins?.columns.map((column, index) => (
        <path
          key={column}
          d={tracePath({ points: [[column, pins.from], [column, pins.to]] }, origin, unit)}
          pathLength={1}
          className={cn(styles.pinLit, PIN_CLASS[index])}
          style={timingStyle(PIN_DRAW)}
        />
      ))}

      {nodes.map(({ at, kind, draw }) => {
        const [x, y] = project(at, origin, unit);
        return (
          <rect
            key={`${at[0]}:${at[1]}`}
            x={x - pad / 2}
            y={y - pad / 2}
            width={pad}
            height={pad}
            className={cn(styles.node, kind === "via" ? styles.nodeVia : styles.nodePad)}
            style={timingStyle(draw)}
          />
        );
      })}

      {flame ? <Flame origin={origin} unit={unit} /> : null}
    </svg>
  );
}

function Flame({ origin, unit }: { origin: Point; unit: number }) {
  const size = unit * FLAME_PIXEL;
  const gap = size * 0.1;
  const [left, top] = project(FLAME_ORIGIN, origin, unit);

  return (
    <g style={timingStyle(FLAME_DRAW)}>
      {FLAME_PIXELS.map(([column, row]) => (
        <rect
          key={`${column}:${row}`}
          x={left + column * size + gap / 2}
          y={top + row * size + gap / 2}
          width={size - gap}
          height={size - gap}
          className={styles.flamePixel}
        />
      ))}
    </g>
  );
}

function project(point: Point, origin: Point, unit: number): Point {
  return [origin[0] + point[0] * unit, origin[1] + point[1] * unit];
}

function tracePath(
  { points, closed }: { points: readonly Point[]; closed?: boolean },
  origin: Point,
  unit: number,
) {
  const commands = points.map((point, index) => {
    const [x, y] = project(point, origin, unit);
    return `${index === 0 ? "M" : "L"}${x} ${y}`;
  });
  return commands.join("") + (closed ? "Z" : "");
}

function pinTraces(columns: readonly number[], from: number, to: number): Trace[] {
  return columns.map((column) => ({
    tone: "zellige",
    draw: PIN_DRAW,
    points: [[column, from], [column, to]],
  }));
}

/** One schedule for both modes: % of `cover` on scroll, a delay and a duration on load. */
function timingStyle([from, to]: DrawRange) {
  return {
    "--from": `${from}%`,
    "--to": `${to}%`,
    "--start": from,
    "--span": to - from,
  } as CSSProperties;
}

/** The logo's real flame, rasterised on pixels of this share of a module. */
const FLAME_PIXEL = 0.344;
const FLAME_ORIGIN: Point = [6.03, -5.75];
const FLAME_ROWS = [
  "..#....",
  ".##.#..",
  ".####..",
  "...##..",
  "..###..",
  ".###...",
  "####.#.",
  "###.##.",
  "##..##.",
  "##.##..",
  ".###...",
  "..##...",
  "...#...",
];
const FLAME_PIXELS: Point[] = FLAME_ROWS.flatMap((row, y) =>
  [...row].flatMap((cell, x): Point[] => (cell === "#" ? [[x, y]] : [])),
);

const ARCH_DRAW: DrawRange = [6, 36];
const KUFIC_DRAW: DrawRange = [24, 44];
const BRANCH_DRAW: DrawRange = [30, 48];
const PIN_DRAW: DrawRange = [44, 52];
const FLAME_DRAW: DrawRange = [32, 40];

/** One meander, as in the logo: inner arch, middle arch, outer arch, then the kufic. */
const ARCHES: Trace = {
  tone: "signal",
  draw: ARCH_DRAW,
  points: [
    [4, -2], [4, -6], [5, -6], [5, -7], [9, -7], [9, -6], [10, -6], [10, -4],
    [12, -4], [12, -6], [11, -6], [11, -8], [9, -8], [9, -9], [5, -9], [5, -8],
    [3, -8], [3, -6], [2, -6], [2, -2], [0, -2], [0, -7], [1, -7], [1, -9],
    [2, -9], [2, -10], [4, -10], [4, -11], [10, -11], [10, -10], [12, -10],
    [12, -9], [13, -9], [13, -7], [14, -7], [14, -2], [10, -2], [10, 0], [14, 0],
    [14, 2], [2, 2],
  ],
};

const KUFIC: Trace[] = [
  { tone: "zellige", draw: KUFIC_DRAW, points: [[2, 0], [2, 6], [0, 6], [0, 0]] },
  { tone: "zellige", draw: KUFIC_DRAW, points: [[4, 2], [4, 0]] },
  { tone: "zellige", draw: KUFIC_DRAW, points: [[6, 0], [6, 6]] },
  { tone: "zellige", draw: KUFIC_DRAW, points: [[8, 0], [8, 4]] },
  {
    tone: "zellige",
    draw: KUFIC_DRAW,
    points: [[2, 8], [0, 8], [0, 10], [8, 10], [8, 8], [6, 8], [6, 10]],
  },
  { tone: "zellige", draw: KUFIC_DRAW, points: [[4, 4], [4, 10]] },
  { tone: "zellige", draw: KUFIC_DRAW, points: [[10, 4], [10, 10]] },
  {
    tone: "zellige",
    draw: KUFIC_DRAW,
    closed: true,
    points: [[12, 4], [14, 4], [14, 6], [12, 6]],
  },
  { tone: "zellige", draw: KUFIC_DRAW, points: [[14, 6], [14, 10], [12, 10], [12, 8]] },
];

const KUFIC_NODES: CircuitNode[] = [
  { at: [4, -2], kind: "pad", draw: [8, 12] },
  { at: [0, 0], kind: "pad", draw: [40, 44] },
  { at: [4, 0], kind: "pad", draw: [38, 42] },
  { at: [6, 0], kind: "pad", draw: [36, 40] },
  { at: [8, 0], kind: "pad", draw: [36, 40] },
  { at: [2, 0], kind: "pad", draw: [36, 40] },
  { at: [2, 2], kind: "via", draw: [34, 38] },
  { at: [4, 2], kind: "via", draw: [34, 38] },
  { at: [6, 2], kind: "via", draw: [33, 37] },
  { at: [8, 2], kind: "via", draw: [32, 36] },
  { at: [8, 4], kind: "pad", draw: [38, 42] },
  { at: [6, 6], kind: "pad", draw: [40, 44] },
  { at: [8, 6], kind: "pad", draw: [40, 44] },
  { at: [4, 4], kind: "pad", draw: [40, 44] },
  { at: [10, 4], kind: "pad", draw: [40, 44] },
  { at: [2, 8], kind: "pad", draw: [40, 44] },
  { at: [12, 8], kind: "pad", draw: [40, 44] },
  { at: [6, 10], kind: "via", draw: [40, 44] },
];

/** The strokes that reach the foot of the logo plug into the terminal, one per request. */
const PIN_COLUMNS = [0, 4, 8, 10, 14];

const DOOR_WIDE: Drawing = {
  // 1200 units for the 12 columns, and a lattice module of a quarter of a column.
  viewBox: [1200, 600],
  origin: [850, 287.5],
  unit: 25,
  pad: 7,
  flame: true,
  pins: { columns: PIN_COLUMNS, from: 10, to: 12.8 },
  traces: [
    ARCHES,
    ...KUFIC,
    ...pinTraces(PIN_COLUMNS, 10, 12.8),
    // Behind the title, then off the left edge of the screen.
    { tone: "zellige", draw: BRANCH_DRAW, points: [[0, 0], [-4, 0], [-4, -3], [-70, -3]] },
    { tone: "cream", draw: BRANCH_DRAW, points: [[-14, -3], [-14, -8], [-22, -8]] },
    // Under the intro, down the left gutter, into the side of the terminal.
    {
      tone: "zellige",
      draw: BRANCH_DRAW,
      points: [[0, 4], [-2, 4], [-2, 7], [-30, 7], [-30, 13.6], [-26, 13.6]],
    },
    { tone: "cream", draw: BRANCH_DRAW, points: [[0, 2], [-7, 2]] },
    { tone: "cream", draw: BRANCH_DRAW, points: [[0, 8], [-3, 8], [-3, 9.5], [-22, 9.5]] },
    { tone: "cream", draw: BRANCH_DRAW, points: [[-3, 9.5], [-3, 11], [-12, 11]] },
    // Off the right edge.
    { tone: "cream", draw: BRANCH_DRAW, points: [[14, 5], [36, 5]] },
    { tone: "cream", draw: BRANCH_DRAW, points: [[14, 8], [17, 8], [17, -3], [36, -3]] },
  ],
  nodes: [
    ...KUFIC_NODES,
    { at: [-14, -3], kind: "via", draw: [40, 44] },
    { at: [-22, -8], kind: "pad", draw: [44, 48] },
    { at: [-7, 2], kind: "pad", draw: [44, 48] },
    { at: [-30, 7], kind: "via", draw: [42, 46] },
    { at: [-22, 9.5], kind: "pad", draw: [44, 48] },
    { at: [-12, 11], kind: "pad", draw: [44, 48] },
    { at: [-3, 9.5], kind: "via", draw: [40, 44] },
  ],
};

/** Phones: the door alone on the terminal, and one wire climbing back behind the title. */
const DOOR_NARROW: Drawing = {
  viewBox: [327, 216],
  origin: [159, 144],
  unit: 12,
  pad: 5,
  flame: true,
  pins: { columns: [2, 4, 6, 8, 14], from: 2, to: 6.2 },
  traces: [
    ARCHES,
    { tone: "zellige", draw: KUFIC_DRAW, points: [[2, 0], [2, 2]] },
    { tone: "zellige", draw: KUFIC_DRAW, points: [[4, 0], [4, 2]] },
    { tone: "zellige", draw: KUFIC_DRAW, points: [[6, 0], [6, 2]] },
    { tone: "zellige", draw: KUFIC_DRAW, points: [[8, 0], [8, 2]] },
    ...pinTraces([2, 4, 6, 8, 14], 2, 6.2),
    // The drawing is right-aligned: from the right edge these stay in place at any width,
    // and running off the left edge they never stop short on a tablet.
    { tone: "cream", draw: BRANCH_DRAW, points: [[14, -7], [14, -28], [-70, -28]] },
    { tone: "cream", draw: BRANCH_DRAW, points: [[2, 4], [-70, 4]] },
  ],
  nodes: [
    { at: [4, -2], kind: "pad", draw: [8, 12] },
    { at: [2, 0], kind: "pad", draw: [36, 40] },
    { at: [4, 0], kind: "pad", draw: [38, 42] },
    { at: [6, 0], kind: "pad", draw: [36, 40] },
    { at: [8, 0], kind: "pad", draw: [36, 40] },
    { at: [2, 4], kind: "via", draw: [40, 44] },
  ],
};

const HERO_WIDE: Drawing = {
  viewBox: [1200, 900],
  origin: [672, 396],
  unit: 36,
  pad: 9,
  flame: true,
  pins: { columns: PIN_COLUMNS, from: 10, to: 14.2 },
  traces: [
    ARCHES,
    ...KUFIC,
    ...pinTraces(PIN_COLUMNS, 10, 14.2),
    // Above the intro, which moves with the height of the screen.
    { tone: "zellige", draw: BRANCH_DRAW, points: [[0, 0], [-4, 0], [-4, -8], [-40, -8]] },
    { tone: "cream", draw: BRANCH_DRAW, points: [[-4, -3], [-6.5, -3]] },
    // Into the side of the terminal, which sits right under this drawing.
    {
      tone: "zellige",
      draw: BRANCH_DRAW,
      points: [[0, 8], [-3, 8], [-3, 13], [-15.9, 13], [-15.9, 14.6], [-13.1, 14.6]],
    },
    { tone: "cream", draw: BRANCH_DRAW, points: [[14, 5], [40, 5]] },
  ],
  nodes: [
    ...KUFIC_NODES,
    { at: [-6.5, -3], kind: "pad", draw: [44, 48] },
    { at: [-4, -3], kind: "via", draw: [40, 44] },
  ],
};

const HERO_NARROW: Drawing = {
  viewBox: [327, 362],
  origin: [89, 187],
  unit: 17,
  pad: 5,
  flame: true,
  traces: [ARCHES, ...KUFIC],
  nodes: KUFIC_NODES,
};

/** Under the terminal, in grid units: a unit of 1 keeps the numbers readable. */
const BUS: Drawing = {
  viewBox: [1200, 88],
  origin: [0, 0],
  unit: 1,
  pad: 7,
  traces: [
    { tone: "zellige", draw: [4, 22], points: [[260, 0], [260, 36], [0, 36], [0, 88]] },
    { tone: "zellige", draw: [6, 20], points: [[300, 0], [300, 88]] },
    { tone: "zellige", draw: [8, 22], points: [[600, 0], [600, 88]] },
    { tone: "cream", draw: [10, 24], points: [[900, 0], [900, 88]] },
  ],
  nodes: [
    { at: [0, 88], kind: "pad", draw: [20, 26] },
    { at: [300, 88], kind: "pad", draw: [18, 24] },
    { at: [600, 88], kind: "pad", draw: [20, 26] },
    { at: [900, 88], kind: "via", draw: [22, 28] },
  ],
};

const TONE_CLASS: Record<Tone, string> = {
  signal: styles.toneSignal,
  zellige: styles.toneZellige,
  cream: styles.toneCream,
};

const PIN_CLASS = [styles.pin0, styles.pin1, styles.pin2, styles.pin3, styles.pin4];

type Point = readonly [x: number, y: number];
type DrawRange = readonly [from: number, to: number];
type Tone = "signal" | "zellige" | "cream";
type Trace = { points: readonly Point[]; tone: Tone; draw: DrawRange; closed?: boolean };
type CircuitNode = { at: Point; kind: "pad" | "via"; draw: DrawRange };
type Drawing = {
  viewBox: Point;
  origin: Point;
  /** Size of one lattice module, in viewBox units. */
  unit: number;
  /** Side of a node, in viewBox units. */
  pad: number;
  flame?: boolean;
  /** Pins lit by the terminal's current request, through the `:has()` rules. */
  pins?: { columns: readonly number[]; from: number; to: number };
  traces: readonly Trace[];
  nodes: readonly CircuitNode[];
};
