import { Coordinate, Direction, flatten } from "../../common";
import { Input, Storm } from "./types";

export const parseInput = (lines: string[]): Input => {
  const linesWithoutWall = lines
    .slice(1, lines.length - 1)
    .map((line) => line.replace(/#/g, ""));

  const storms = flatten(
    linesWithoutWall.map(
      (line, i) =>
        line
          .split("")
          .map((c, j) => [c, i, j] as [string, number, number])
          .filter(([c]) => c !== ".")
          .map(([s, i, j]) => ({
            coordinate: [i, j] as Coordinate,
            type: getStormType(s),
          })) as Storm[]
    )
  );

  return {
    start: [0, 0],
    finish: [linesWithoutWall.length - 1, linesWithoutWall[0].length - 1],
    storms,
  };
};

const stormTypeChars = ["<", ">", "^", "v"] as const;

const getStormType = (s: string): Storm["type"] => {
  const stormTypeByChar: {
    [key in typeof stormTypeChars[number]]: Direction;
  } = {
    "<": "L",
    ">": "R",
    v: "D",
    "^": "U",
  };

  return (
    stormTypeByChar[s] ||
    (() => {
      console.log(s);
      throw Error("input error");
    })()
  );
};
