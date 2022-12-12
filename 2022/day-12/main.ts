import { readFileSync } from "fs";
import {
  Coordinate,
  directions,
  flatten,
  getDirectionToCoordinateChange,
  getKey,
  Grid,
  isCoordinateWithinBoundaries,
  sumCoordinates,
} from "../../common";
import { parseInput } from "./parse";

export {};

const main = (vs: string[]) => {
  const [start, finish, grid] = parseInput(vs);
  return bfs(grid, finish!, [start!]);
};

const main2 = (vs: string[]) => {
  const [_, finish, grid] = parseInput(vs);

  const possibleStarts = flatten(
    grid.map(
      (line, row) =>
        line
          .map((value, column) => (value === 0 ? [row, column] : undefined))
          .filter((result) => result) as Coordinate[]
    )
  );

  return bfs(grid, finish!, possibleStarts);
};

const bfs = (grid: Grid, start: Coordinate, targets: Coordinate[]): number => {
  const toVisitQueue: [Coordinate, number][] = [[start!, 0]];
  const alreadyInQueue = new Set<string>([getKey(start!)]);
  const targetsSet = new Set<string>(targets.map(getKey));
  const targetsMinSteps = [] as number[];

  while (true) {
    if (toVisitQueue.length === 0) {
      return Math.min(...targetsMinSteps);
    }

    const [toVisit, steps] = toVisitQueue.shift()!;

    if (targetsSet.has(getKey(toVisit))) {
      targetsMinSteps.push(steps);
    }

    directions.forEach((direction) => {
      const nextCoordinate = sumCoordinates(
        toVisit,
        getDirectionToCoordinateChange(direction)
      );

      if (
        isCoordinateWithinBoundaries(nextCoordinate, grid) &&
        isMovementValid(toVisit, nextCoordinate, grid) &&
        !alreadyInQueue.has(getKey(nextCoordinate))
      ) {
        toVisitQueue.push([nextCoordinate, steps + 1]);
        alreadyInQueue.add(getKey(nextCoordinate));
      }
    });
  }
};

const isMovementValid = (
  [rowFrom, colFrom]: Coordinate,
  [rowTo, colTo]: Coordinate,
  grid: Grid
): boolean => {
  const difference = grid[rowFrom][colFrom] - grid[rowTo][colTo];
  return difference <= 1;
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
