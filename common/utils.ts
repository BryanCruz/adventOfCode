import { Coordinate, Direction, Grid, Point } from "./types";

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

export const chunkify = <T>(collection: T[], chunkSize: number): T[][] =>
  collection.reduce(
    (chunks, curr) => {
      const lastChunkIndex = chunks.length - 1;

      if (chunks[lastChunkIndex].length < chunkSize) {
        chunks[lastChunkIndex].push(curr);
        return chunks;
      }

      return chunks.concat([[curr]]);
    },
    [[]] as T[][]
  );

export const manhattanDistance = (a: Point, b: Point): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export const range = (a: number, b: number): number[] =>
  Array(b - a + 1)
    .fill(0)
    .map((_, i) => i + a);
