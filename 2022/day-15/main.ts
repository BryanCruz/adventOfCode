import { readFileSync } from "fs";
import { parseInput } from "./parse";
import {
  Point,
  PolarPoint,
  manhattanDistance,
  range,
  Line,
} from "../../common";

export {};

const main = (vs: string[], y: number) => {
  const sensorsAndBeacons = parseInput(vs);
  const rings = parsePolarPoints(sensorsAndBeacons);

  const segment = mergeSegments(
    rings
      .map((ring) => getSegmentsWithNoBeacon(ring, y))
      .filter((seg) => seg !== null)
  )[0];

  const beaconsInY = new Set(
    sensorsAndBeacons
      .filter(({ beacon }) => beacon.y === y)
      .map(({ beacon }) => beacon.x)
  );

  return segment.b.x - segment.a.x - beaconsInY.size + 1;
};

const main2 = (vs: string[], min: number, max: number) => {
  const sensorsAndBeacons = parseInput(vs);
  const rings = parsePolarPoints(sensorsAndBeacons);

  for (let y = min; y <= max; y++) {
    const segment = mergeSegments(
      rings
        .map((ring) => getSegmentsWithNoBeacon(ring, y))
        .filter((seg) => seg !== null)
    );
    if (segment.length > 1) {
      const point = { y, x: segment[0].b.x + 1 };
      return getTuningFrequency(point);
    }
  }

  for (let y = max; y >= min; y--) {
    console.log(y);
    const segments = rings
      .map((ring) => getSegmentsWithNoBeacon(ring, y))
      .filter((seg) => seg !== null);

    const minX = Math.max(min, Math.min(...segments.map((seg) => seg.a.x)));
    const maxX = Math.min(max, Math.max(...segments.map((seg) => seg.b.x)));

    const r = range(minX, maxX).find(
      (x) => segments.filter((seg) => seg.a.x <= x && x <= seg.b.x).length === 0
    );

    if (r !== undefined) {
      return getTuningFrequency({ x: r, y });
    }
  }
};

const mergeSegments = (lines: Line[]): Line[] => {
  lines.sort((segA, segB) => segA.a.x - segB.a.x);
  const newLines = [];
  for (let i = 0; i < lines.length; i++) {
    const [segA, segB] = [lines[i], lines[i + 1]];
    if (segB !== undefined && segB.a.x <= segA.b.x) {
      segB.a.x = segA.a.x;
      segB.b.x = Math.max(segA.b.x, segB.b.x);
    } else {
      newLines.push(segA);
    }
  }
  return newLines;
};

const getTuningFrequency = (point: Point): number =>
  point.x * 4000000 + point.y;

const getSegmentsWithNoBeacon = (ring: PolarPoint, y: number): Line => {
  const yDistance = Math.abs(y - ring.center.y);
  if (ring.radius < yDistance) {
    return null;
  }
  const xDistance = ring.radius - yDistance;
  return {
    a: { x: ring.center.x - xDistance, y },
    b: { x: ring.center.x + xDistance, y },
  };
};

const parsePolarPoints = (
  sensorsAndBeacons: { sensor: Point; beacon: Point }[]
): PolarPoint[] =>
  sensorsAndBeacons.map(({ sensor, beacon }) => ({
    center: sensor,
    radius: manhattanDistance(sensor, beacon),
  }));

const [vt, v] = ["inputT.txt", "input.txt"].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split(/\r?\n/)
);

console.log("First Half");
console.log("test", main(vt, 10));
console.log("final", main(v, 2000000));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt, 0, 20));
console.log("final", main2(v, 0, 4000000));
