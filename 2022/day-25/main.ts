import { readFileSync } from "fs";
import { sumSnafu } from "./math";
import { getSnafuRepresentation, parseInput } from "./parse";

export {};

const main = (vs: string[]) => {
  const input = parseInput(vs);
  const sum = input.reduce((sum, v) => sumSnafu(sum, v));
  return sum.map(getSnafuRepresentation).join("");
};

const main2 = (vs: string[]) => {};

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
