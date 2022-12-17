import { flatten } from "../../common";
import { Line, Point } from "./types";

export const parseInput = (lines: string[]): Line[] =>
  flatten(
    lines.map((line) => line.split(" -> ").map(parsePoint)).map(parseLine)
  );

export const parsePoint = (point: string): Point => {
  const [x, y] = point.split(",").map((v) => Number(v));
  return { x, y };
};

export const unparsePoint = ({ x, y }: Point): string => `${x},${y}`;

const parseLine = (points: Point[]): Line[] =>
  points.slice(1).reduce(
    ({ previousPoint, lines }, currPoint) => ({
      previousPoint: currPoint,
      lines: lines.concat([{ a: previousPoint, b: currPoint }]),
    }),
    {
      previousPoint: points[0],
      lines: [] as Line[],
    }
  ).lines;
