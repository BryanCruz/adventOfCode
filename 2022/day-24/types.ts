import { Coordinate, Direction } from "../../common";

export type Input = {
  start: Coordinate;
  finish: Coordinate;
  storms: Storm[];
};

export type Storm = {
  coordinate: Coordinate;
  type: Direction;
};
