import { readFileSync } from "fs";

export {};

const parseInput = (vs: string[]): Array<[string, number]> =>
  vs
    .map((line) => line.split(" "))
    .map(([direction, value]) => [direction, Number(value)]);

const calculateNewCoordinatesPart1 = (
  coordinates: [number, number],
  [direction, value]: [string, number]
): [number, number] => {
  const directionsInstruction: {
    [key: string]: (
      direction: [number, number],
      value: number
    ) => [number, number];
  } = {
    up: ([x, y], value) => [x, y - value],
    down: ([x, y], value) => [x, y + value],
    forward: ([x, y], value) => [x + value, y],
  };

  return directionsInstruction[direction](coordinates, value);
};

const calculateNewCoordinatesPart2 = (
  coordinates: [number, number, number],
  [direction, value]: [string, number]
): [number, number, number] => {
  const directionsInstruction: {
    [key: string]: (
      direction: [number, number, number],
      value: number
    ) => [number, number, number];
  } = {
    up: ([aim, x, y], value) => [aim - value, x, y],
    down: ([aim, x, y], value) => [aim + value, x, y],
    forward: ([aim, x, y], value) => [aim, x + value, y + aim * value],
  };

  return directionsInstruction[direction](coordinates, value);
};

const main = (vs: string[]) => {
  const input = parseInput(vs);

  const [finalX, finalY] = input.reduce(
    (currentCoordinates, instruction) =>
      calculateNewCoordinatesPart1(currentCoordinates, instruction),
    [0, 0]
  );

  return finalX * finalY;
};

const main2 = (vs: string[]) => {
  const input = parseInput(vs);

  const [_finalAim, finalX, finalY] = input.reduce(
    (currentCoordinates, instruction) =>
      calculateNewCoordinatesPart2(currentCoordinates, instruction),
    [0, 0, 0]
  );

  return finalX * finalY;
};

const [vt, v] = ["inputT.txt", "input.txt"].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split("\n")
);

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
