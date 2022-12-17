import { readFileSync } from "fs";
import { parseInput, parsePoint, unparsePoint } from "./parse";
import { Line, Point } from "./types";
import { off } from "process";
import { flatten } from "../../common";

export {};

const main = (vs: string[]) => {
  const lines = parseInput(vs);
  const filledPoints = getFilledPointsGrid(lines);
  const blockingYByX = getBlockingYByX(filledPoints);

  let i = 0;
  while (project(500, filledPoints, blockingYByX, 0)) i++;
  return i;
};

const main2 = (vs: string[]) => {
  const lines = parseInput(vs);
  const floorLine: Line = {
    a: {
      x: Math.round(getMinOrMax(lines, Math.min, (point) => point.x) / 2),
      y: 2 + getMinOrMax(lines, Math.max, (point) => point.y),
    },
    b: {
      x: getMinOrMax(lines, Math.max, (point) => point.x) * 2,
      y: 2 + getMinOrMax(lines, Math.max, (point) => point.y),
    },
  };
  lines.push(floorLine);

  const filledPoints = getFilledPointsGrid(lines);
  const blockingYByX = getBlockingYByX(filledPoints);

  let i = 1;
  while (project(500, filledPoints, blockingYByX, 0)) i++;
  return i;
};

const project = (
  x: number,
  filledPoints: Set<string>,
  blockingYByX: number[][],
  offset: number
): boolean => {
  const blockingY = blockingYByX[x] && blockingYByX[x].find((y) => y >= offset);

  if (blockingY === undefined) {
    return false;
  }

  const restPoint: Point = { x, y: blockingY - 1 };
  const fallLeft: Point = { x: x - 1, y: blockingY };
  const left: Point = { x: x - 1, y: restPoint.y };
  const fallRight: Point = { x: x + 1, y: blockingY };
  const right: Point = { x: x + 1, y: restPoint.y };

  if (!filledPoints.has(unparsePoint(fallLeft))) {
    return project(x - 1, filledPoints, blockingYByX, blockingY);
  }
  if (!filledPoints.has(unparsePoint(fallRight))) {
    return project(x + 1, filledPoints, blockingYByX, blockingY);
  }

  filledPoints.add(unparsePoint(restPoint));
  blockingYByX[x].push(restPoint.y);
  blockingYByX[x] = blockingYByX[x].sort((a, b) => a - b);

  return restPoint.x !== 500 || restPoint.y !== 0;
};

const getMinOrMax = (
  lines: Line[],
  minOrMax: (...number: number[]) => number,
  getXorY: (point: Point) => number
): number =>
  minOrMax(...flatten(lines.map((line) => [getXorY(line.a), getXorY(line.b)])));

const getBlockingYByX = (filledPoints: Set<string>): number[][] => {
  const blockingYByX = [] as number[][];

  const xs = new Set<number>();

  filledPoints.forEach((pointStr) => {
    const { x, y } = parsePoint(pointStr);
    if (!blockingYByX[x]) {
      blockingYByX[x] = [];
    }
    blockingYByX[x].push(y);
    xs.add(x);
  });

  xs.forEach((x) => blockingYByX[x].sort((a, b) => a - b));

  return blockingYByX;
};

const getFilledPointsGrid = (lines: Line[]): Set<string> => {
  const points = new Set<string>();

  lines.forEach((line) => {
    const [changeX, changeY] = getDirection(line);
    const { a, b } = line;

    for (let x = a.x, y = a.y; ; x += changeX, y += changeY) {
      points.add(unparsePoint({ x, y }));
      if (x === b.x && y === b.y) {
        break;
      }
    }
  });

  return points;
};

const getDirection = (line: Line): [number, number] => {
  const { a, b } = line;
  let [changeX, changeY] = [0, 0];

  if (a.x === b.x) {
    changeY = (b.y - a.y) / Math.abs(b.y - a.y);
  } else {
    changeX = (b.x - a.x) / Math.abs(b.x - a.x);
  }

  return [changeX, changeY];
};

const [vt, v] = ["inputT.txt", "input.txt"].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split(/\r?\n/)
);

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
