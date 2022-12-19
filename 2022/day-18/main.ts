import { readFileSync } from "fs";
import { parseInput, Point3D, unparsePoint as getKey } from "./parse";

export {};

type UnionSet = {
  parent: UnionSet;
  value: Point3D;
};

const main = (vs: string[]) => {
  const points = parseInput(vs);

  const pointsSet = new Set(points.map(getKey));

  let total = points.length * 6;
  points.forEach((point) => {
    const neighbours = getNeighbours(point);
    neighbours.forEach((neighbour) => {
      if (pointsSet.has(getKey(neighbour))) {
        total--;
      }
    });
  });
  return total;
};

const main2 = (vs: string[]) => {
  const points = parseInput(vs);
  const pointsSet = new Set(points.map(getKey));

  const [minX, minY, minZ] = [
    (p) => p.x - 1,
    (p) => p.y - 1,
    (p) => p.z - 1,
  ].map((fn) => getMinOrMax(Math.min, fn, points));

  const [maxX, maxY, maxZ] = [
    (p) => p.x + 1,
    (p) => p.y + 1,
    (p) => p.z + 1,
  ].map((fn) => getMinOrMax(Math.max, fn, points));

  let initialPoint: Point3D = {
    x: minX,
    y: minY,
    z: minZ,
  };

  let totalSurface = 0;

  const pointsToVisit = [initialPoint];
  const inQueue = new Set<string>(pointsToVisit.map(getKey));

  while (pointsToVisit.length > 0) {
    const pointToVisit = pointsToVisit.shift()!;

    const neighbours = getNeighbours(pointToVisit);

    neighbours.forEach((neighbour) => {
      if (inQueue.has(getKey(neighbour))) {
        return;
      }

      if (
        neighbour.x < minX ||
        neighbour.x > maxX ||
        neighbour.y < minY ||
        neighbour.y > maxY ||
        neighbour.z < minZ ||
        neighbour.z > maxZ
      ) {
        return;
      }

      if (pointsSet.has(getKey(neighbour))) {
        totalSurface++;
        return;
      }

      inQueue.add(getKey(neighbour));
      pointsToVisit.push(neighbour);
    });
  }

  return totalSurface;
};

const getMinOrMax = (
  minOrMaxFn: (...values: number[]) => number,
  getCoordinate: (point: Point3D) => number,
  points: Point3D[]
) => minOrMaxFn(...points.map(getCoordinate));

const getNeighbours = (point: Point3D): Point3D[] => {
  const differences = [-1, 0, 1];
  const neighboursSet = new Set<string>([getKey(point)]);
  const neighbours = [] as Point3D[];

  differences.forEach((x) =>
    differences.forEach((y) =>
      differences.forEach((z) => {
        if (Math.abs(x) + Math.abs(y) + Math.abs(z) > 1) {
          return;
        }

        const neighbour = {
          x: point.x + x,
          y: point.y + y,
          z: point.z + z,
        };

        if (neighboursSet.has(getKey(neighbour))) {
          return;
        }
        neighbours.push(neighbour);
        neighboursSet.add(getKey(neighbour));
      })
    )
  );

  return neighbours;
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
