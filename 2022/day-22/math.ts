import {
  Direction,
  directions,
  Down,
  InstructionTurn,
  Left,
  Right,
  Up,
} from "./types";

export const getNextDirection = (
  direction: Direction,
  instruction: InstructionTurn
): Direction =>
  ((directions.findIndex((d) => d === direction)! +
    (instruction === "L" ? -1 : +1) +
    directions.length) %
    directions.length) as Direction;

export const getChangeX = (directionS: Direction): number => {
  const direction = Number(directionS);
  switch (direction) {
    case Left:
      return -1;
    case Right:
      return 1;
  }
  return 0;
};

export const getChangeY = (directionS: Direction): number => {
  const direction = Number(directionS);
  switch (direction) {
    case Up:
      return -1;
    case Down:
      return 1;
  }
  return 0;
};

export const getInverse = (direction: Direction): Direction =>
  ((direction + 2) % 4) as Direction;

export const getDirName = (directionS: Direction): string => {
  const direction = Number(directionS);
  switch (direction) {
    case Up:
      return "up";
    case Left:
      return "left";
    case Right:
      return "right";
    case Down:
      return "down";
  }

  console.log(direction === Up);
  console.log(direction === Left);
  console.log(direction === Right);
  console.log(direction === Down);
  throw Error(
    `could not find ${direction} in ${Right}, ${Left}, ${Up}, ${Down}`
  );
};

directions.forEach((direction) => {
  if (getNextDirection(getNextDirection(direction, "L"), "R") !== direction) {
    throw Error("a");
  }
  if (getNextDirection(getNextDirection(direction, "R"), "L") !== direction) {
    throw Error("b");
  }
});
