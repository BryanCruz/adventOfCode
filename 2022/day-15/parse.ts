import { Point } from "../../common";

export const parseInput = (
  lines: string[]
): { sensor: Point; beacon: Point }[] =>
  lines.map((line) => {
    const [sensor, beacon] = line.split(":").map(parsePoint);
    return { sensor, beacon };
  });

const parsePoint = (line: string): Point => {
  const [_, x, y] = line.match(/x=(-?\d+), y=(-?\d+)/);
  return { x: Number(x), y: Number(y) };
};
