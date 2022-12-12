import { Coordinate, Direction, Grid } from "./types";

export const getKey = ([row, column]: Coordinate): string => `${row}:${column}`;

export const getDirectionToCoordinateChange = (
  direction: Direction
): Coordinate => {
  const directionToCoordinateChange: { [key in Direction]: Coordinate } = {
    U: [-1, 0],
    D: [1, 0],
    L: [0, -1],
    R: [0, 1],
  };
  return directionToCoordinateChange[direction];
};

export const sumCoordinates = (
  [a1, a2]: Coordinate,
  [b1, b2]: Coordinate
): Coordinate => [a1 + b1, a2 + b2];

export const isCoordinateWithinBoundaries = (
  [row, column]: Coordinate,
  grid: Grid
): boolean =>
  row >= 0 && row < grid.length && column >= 0 && column < grid[0].length;

export const flatten = <T>(collection: T[][]): T[] =>
  collection.reduce((flattened, curr) => [...flattened, ...curr]);
