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

type Memo = { [key: string]: number };

const main = (vs: string[]) => {
  const [start, finish, grid] = parseInput(vs);
  return bfs(grid, start!, finish!);
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

  return bfsWithMemo(grid, possibleStarts, finish!);
};

const bfs = (
  grid: Grid,
  start: Coordinate,
  target: Coordinate,
  memo?: Memo
): number => {
  const toVisitQueue: [Coordinate, number, Coordinate[]][] = [[start!, 0, []]];
  const alreadyInQueue = new Set<string>([getKey(start!)]);
  const startKey = getKey(start);
  const targetKey = getKey(target);

  while (true) {
    if (toVisitQueue.length === 0) {
      memo![startKey] = Number.MAX_VALUE;
      return Number.MAX_VALUE;
    }

    const [toVisit, steps, previous] = toVisitQueue.shift()!;
    const toVisitKey = getKey(toVisit);

    const isTarget = toVisitKey === targetKey;
    const isInMemo = memo && memo[toVisitKey] !== undefined;

    if (isTarget || isInMemo) {
      const baseSteps = isTarget ? 0 : memo![toVisitKey];
      if (memo) {
        previous.forEach((coordinate, i) => {
          const key = getKey(coordinate);
          const actualSteps = baseSteps + i + 1;
          memo[key] = Math.min(actualSteps, memo[key] || actualSteps + 1);
        });
      }

      if (!memo) {
        return steps + baseSteps;
      }
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
        toVisitQueue.push([
          nextCoordinate,
          steps + 1,
          [toVisit].concat(previous),
        ]);
        alreadyInQueue.add(getKey(nextCoordinate));
      }
    });
  }
};

const bfsWithMemo = (
  grid: Grid,
  possibleStarts: Coordinate[],
  target: Coordinate
) => {
  const memo: Memo = {};

  possibleStarts.forEach((start) => bfs(grid, start, target, memo));

  return Math.min(
    ...possibleStarts.map((possibleStart) => memo[getKey(possibleStart)])
  );
};

const isMovementValid = (
  [rowFrom, colFrom]: Coordinate,
  [rowTo, colTo]: Coordinate,
  grid: Grid
): boolean => {
  const difference = grid[rowFrom][colFrom] - grid[rowTo][colTo];
  return difference >= -1;
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
