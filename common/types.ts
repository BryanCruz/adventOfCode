export type Coordinate = [number, number];

export type Grid = number[][];

export const directions = ["U", "L", "D", "R"];
export type Direction = typeof directions[number];

export type Point = {
  x: number;
  y: number;
};

export type PolarPoint = {
  center: Point;
  radius: number;
};

export type Line = {
  a: Point;
  b: Point;
};
