/**
 * The gold frame of the hero's door, drawn on the logo's own grid.
 *
 * The emblem is a square-kufic composition on 15 modules: bars and gaps share one
 * width, arcs are concentric. The frame lays the emblem's lower calligraphy, rows 11
 * to 21 taken cell by cell, along a band that climbs the left jamb, follows the top
 * of the arch and comes down the right jamb, between two gold fillets.
 *
 * Band coordinates: `s` runs along the band, from the left foot over the keystone to
 * the right foot, measured on the band's middle line; `t` runs across it, from the
 * photo's edge (0) outwards (`depth`).
 */

export type FrameLayer = {
  /** The gold. */
  d: string;
  /** The band under this layer's gold: on phones it hides the edge of the photo. */
  under: string;
  /** Bounding box in frame pixels, so each layer stays a small GPU texture. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** 1 on the keystone, towards 0 at the feet: the order in which the gold appears. */
  rise: number;
};

export type DoorFrameDrawing = {
  width: number;
  height: number;
  depth: number;
  layers: FrameLayer[];
};

/**
 * `width` and `height` are those of the frame's box: the photo plus the band on its
 * sides and top. `depth` is the band's thickness. Returns null when nothing fits.
 */
export function drawDoorFrame(
  width: number,
  height: number,
  depth: number,
): DoorFrameDrawing | null {
  const band = bandGeometry(width, height, depth);
  if (!band) return null;

  const pieces = friezePieces(band);
  const layers = groupPieces(band, pieces);
  return { width, height, depth, layers };
}

/** The frame's silhouette as a standalone SVG document: the mask of the light. */
export function frameSilhouette(drawing: DoorFrameDrawing) {
  const d = drawing.layers.map((layer) => layer.d).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${drawing.width}" height="${drawing.height}" viewBox="0 0 ${drawing.width} ${drawing.height}"><path d="${d}"/></svg>`;
}

// Band ---------------------------------------------------------------------

type Band = {
  depth: number;
  /** Photo inside the band. */
  photoWidth: number;
  photoHeight: number;
  /** Radius of the photo's top corners: `border-radius: 999px 999px 0 0` resolves to this. */
  radius: number;
  /** Lengths along the middle line. */
  jamb: number;
  quarter: number;
  top: number;
  length: number;
  floor: number;
};

function bandGeometry(width: number, height: number, depth: number): Band | null {
  const photoWidth = width - 2 * depth;
  const photoHeight = height - depth;
  if (!(depth > 1 && photoWidth > 4 * depth && photoHeight > depth)) return null;

  const radius = Math.min(photoWidth / 2, photoHeight);
  const jamb = photoHeight - radius;
  const quarter = (Math.PI / 2) * (radius + depth / 2);
  const top = photoWidth - 2 * radius;
  return {
    depth,
    photoWidth,
    photoHeight,
    radius,
    jamb,
    quarter,
    top,
    length: 2 * jamb + 2 * quarter + top,
    floor: height,
  };
}

/** A point of the band, in frame pixels. */
function bandPoint(band: Band, s: number, t: number): [number, number] {
  const { depth, radius, jamb, quarter, top } = band;
  const middle = radius + depth / 2;
  const centreY = depth + radius;

  if (s <= jamb) return [depth - t, band.floor - s];

  let along = s - jamb;
  if (along <= quarter) {
    const angle = Math.PI - along / middle;
    return [
      depth + radius + (radius + t) * Math.cos(angle),
      centreY - (radius + t) * Math.sin(angle),
    ];
  }

  along -= quarter;
  if (along <= top) return [depth + radius + along, depth - t];

  along -= top;
  if (along <= quarter) {
    const angle = Math.PI / 2 - along / middle;
    return [
      depth + band.photoWidth - radius + (radius + t) * Math.cos(angle),
      centreY - (radius + t) * Math.sin(angle),
    ];
  }

  along -= quarter;
  return [depth + band.photoWidth + t, centreY + along];
}

type Polygon = { d: string; minX: number; minY: number; maxX: number; maxY: number };

/** A band rectangle as one polygon. On a curve its long edges are sampled every few pixels. */
function polygon(band: Band, s0: number, s1: number, t0: number, t1: number): Polygon {
  const start = Math.max(s0, -1);
  const end = Math.min(s1, band.length + 1);
  // A run of a tile cut by the floor: nothing left to draw.
  if (end <= start) return { d: "", minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  const curveStart = band.jamb;
  const curveEnd = band.length - band.jamb;
  const isStraight =
    end <= curveStart ||
    start >= curveEnd ||
    (band.top > 0 &&
      start >= curveStart + band.quarter &&
      end <= curveStart + band.quarter + band.top);
  // An 8 px chord on these radii strays by less than a twentieth of a pixel.
  const steps = isStraight ? 1 : Math.max(1, Math.ceil((end - start) / 8));

  const outer: [number, number][] = [];
  const inner: [number, number][] = [];
  for (let index = 0; index <= steps; index++) {
    const s = start + ((end - start) * index) / steps;
    outer.push(bandPoint(band, s, t1));
    inner.push(bandPoint(band, s, t0));
  }

  const points = outer.concat(inner.reverse());
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let d = "";
  points.forEach(([x, y], index) => {
    d += `${index === 0 ? "M" : "L"}${round(x)} ${round(y)}`;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });
  return { d: `${d}Z`, minX, minY, maxX, maxY };
}

// Frieze -------------------------------------------------------------------

/** `start` and `end`: the stretch of band the piece's fillets cover. */
type Piece = Polygon & { s: number; start: number; end: number };

/**
 * Tiles of calligraphy, one of them centred on the keystone. Each tile carries its
 * share of the two fillets, so the band can appear piece by piece.
 */
function friezePieces(band: Band): Piece[] {
  const cell = band.depth / BAND_ROWS;
  let count = Math.max(3, Math.round(band.length / (TILE_PERIOD * cell)));
  if (count % 2 === 0) count += 1;
  const step = band.length / (count * TILE_PERIOD);
  const tileLength = TILE_PERIOD * step;
  const tileWidth = TILE_COLUMNS * step;

  const pieces: Piece[] = [];
  const reach = Math.ceil(count / 2) + 1;
  for (let k = -reach; k <= reach; k++) {
    const start = band.length / 2 + k * tileLength - tileWidth / 2;
    const end = start + tileWidth;
    if (end < 0 || start > band.length) continue;

    const parts = TILE_RUNS.map((run) =>
      polygon(
        band,
        start + run.c0 * step,
        start + run.c1 * step,
        // Row 0 is the top of the letters: it faces outwards, as in the logo.
        band.depth - cell * (2 + run.r1),
        band.depth - cell * (2 + run.r0),
      ),
    );
    // Fillets: cut in the middle of the gap between two tiles, and overlapping a hair
    // so neighbouring layers never show a seam.
    const filletStart = start - step / 2 - SEAM_OVERLAP;
    const filletEnd = end + step / 2 + SEAM_OVERLAP;
    parts.push(polygon(band, filletStart, filletEnd, -FILLET_OVERLAP, cell));
    parts.push(polygon(band, filletStart, filletEnd, band.depth - cell, band.depth));

    pieces.push({ ...merge(parts), s: (start + end) / 2, start: filletStart, end: filletEnd });
  }
  return pieces;
}

/** Pieces gathered in a few layers along the band, symmetric about the keystone. */
function groupPieces(band: Band, pieces: Piece[]): FrameLayer[] {
  const slice = band.length / LAYER_COUNT;
  const groups: Piece[][] = Array.from({ length: LAYER_COUNT }, () => []);
  pieces.forEach((piece) => {
    const index = Math.min(LAYER_COUNT - 1, Math.max(0, Math.floor(piece.s / slice)));
    groups[index].push(piece);
  });

  const half = band.length / 2;
  return groups.flatMap((group, index) => {
    if (group.length === 0) return [];
    const gold = merge(group);
    const under = polygon(
      band,
      Math.min(...group.map((piece) => piece.start)),
      Math.max(...group.map((piece) => piece.end)),
      -BACKING_OVERLAP,
      band.depth,
    );
    const box = merge([gold, under]);
    const centre = (index + 0.5) * slice;
    return [
      {
        d: gold.d,
        under: under.d,
        x: Math.floor(box.minX) - 1,
        y: Math.floor(box.minY) - 1,
        width: Math.ceil(box.maxX - box.minX) + 3,
        height: Math.ceil(box.maxY - box.minY) + 3,
        rise: 1 - Math.min(1, Math.abs(centre - half) / half),
      },
    ];
  });
}

/** A tenth of a pixel is finer than any screen draws, and halves the path data. */
function round(value: number) {
  return Math.round(value * 10) / 10;
}

function merge(parts: Polygon[]): Polygon {
  return parts.reduce<Polygon>(
    (all, part) => ({
      d: all.d + part.d,
      minX: Math.min(all.minX, part.minX),
      minY: Math.min(all.minY, part.minY),
      maxX: Math.max(all.maxX, part.maxX),
      maxY: Math.max(all.maxY, part.maxY),
    }),
    { d: "", minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );
}

/** Maximal runs of gold cells, across and down: two neighbouring cells always share one. */
function cellRuns(grid: string[]) {
  const runs: { c0: number; c1: number; r0: number; r1: number }[] = [];
  const rows = grid.length;
  const columns = grid[0].length;
  const isGold = (row: number, column: number) => grid[row]?.[column] === "#";

  for (let row = 0; row < rows; row++) {
    let column = 0;
    while (column < columns) {
      if (grid[row][column] !== "#") {
        column++;
        continue;
      }
      const first = column;
      while (column < columns && grid[row][column] === "#") column++;
      if (column - first > 1) runs.push({ c0: first, c1: column, r0: row, r1: row + 1 });
    }
  }

  for (let column = 0; column < columns; column++) {
    let row = 0;
    while (row < rows) {
      if (grid[row][column] !== "#") {
        row++;
        continue;
      }
      const first = row;
      while (row < rows && grid[row][column] === "#") row++;
      // A lone cell already drawn by its row needs no second polygon.
      const isCoveredAcross = row - first === 1 && (isGold(first, column - 1) || isGold(first, column + 1));
      if (!isCoveredAcross) runs.push({ c0: column, c1: column + 1, r0: first, r1: row });
    }
  }
  return runs;
}

// Static content -------------------------------------------------------------

/**
 * Rows 11 to 21 of the emblem (public/brand/emblem.svg), on its 15-module grid.
 * This is the logo's own calligraphy: never redraw or invent a letter here.
 */
const KUFIC_TILE = [
  "#.#.#.#.#.#####",
  "#.#.#.#.#.....#",
  "#.#############",
  "#.#...#.#......",
  "#.#.#.#.#.#.###",
  "#.#.#.#...#.#.#",
  "###.#.#.#.#.###",
  "....#.....#...#",
  "###.#.###.#.#.#",
  "#...#.#.#.#.#.#",
  "#########.#.###",
];

const TILE_RUNS = cellRuns(KUFIC_TILE);
const TILE_COLUMNS = KUFIC_TILE[0].length;
/** A tile and the one-module gap before the next. */
const TILE_PERIOD = TILE_COLUMNS + 1;
/** Across the band: fillet, gap, eleven rows of calligraphy, gap, fillet. */
const BAND_ROWS = KUFIC_TILE.length + 4;
/** Layers of the reveal. Odd, so that one sits on the keystone. */
const LAYER_COUNT = 17;
const SEAM_OVERLAP = 0.35;
/** The inner fillet and the backing reach under the photo's edge: no hairline between them. */
const FILLET_OVERLAP = 0.75;
const BACKING_OVERLAP = 0.5;
