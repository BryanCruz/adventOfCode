import { readFileSync } from "fs";

export {};

const main = (vs: string[], topNToConsider: number = 1) => {
  const calories: number[] = vs.reduce(
    (acc, currLine) => {
      if (currLine === "") {
        acc.push(0);
      } else {
        const currCalories = Number(currLine);
        acc[acc.length - 1] += currCalories;
      }
      return acc;
    },
    [0]
  );

  calories.sort((a, b) => b - a);
  return calories.slice(0, topNToConsider).reduce((sum, curr) => sum + curr);
};

const main2 = (vs: string[]) => main(vs, 3);

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
