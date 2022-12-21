import { readFileSync } from "fs";
import { getHumn, getRoot, resetStates } from "./math";
import { parseInput } from "./parse";

export {};

const main = (vs: string[]) => {
  const monkeys = parseInput(vs);
  resetStates(monkeys);
  return getRoot();
};

const main2 = (vs: string[]) => {
  const monkeys = parseInput(vs);
  resetStates(monkeys);
  return getHumn();
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
