import { Snafu } from "./types";

const snafuValueBySnafuRepresentation: { [key: string]: Snafu } = {
  "2": 2,
  "1": 1,
  "0": 0,
  "-": -1,
  "=": -2,
};

const snafuReprentationBySnafuValue = Object.values(
  snafuValueBySnafuRepresentation
).reduce(
  (obj, number) => ({
    ...obj,
    [number]: Object.keys(snafuValueBySnafuRepresentation).find(
      (snafu) => snafuValueBySnafuRepresentation[snafu] === number
    ),
  }),
  {}
);

export const parseInput = (lines: string[]): Snafu[][] =>
  lines.map((line) => line.split("").map(getSnafuValue));

const getSnafuValue = (s: string): Snafu => {
  return snafuValueBySnafuRepresentation[s];
};

export const getSnafuRepresentation = (s: number): string => {
  return snafuReprentationBySnafuValue[s];
};
