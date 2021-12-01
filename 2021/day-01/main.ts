import { readFileSync } from "fs";

export {};

const main = (vs: string[]) => {
  const vsN = vs.map((line) => Number(line));

  let total = 0;
  for (let i = 1; i < vsN.length; i++) {
    if (vsN[i] > vsN[i - 1]) total++;
  }

  return total;
};

const main2 = (vs: string[]) => {
  const vsN = vs.map((line) => Number(line));

  let total = 0;
  let lastSum = vsN[0] + vsN[1] + vsN[2];

  for (let i = 1; i < vsN.length; i++) {
    let sum = 0;
    for (let j = 0; j < 3; j++) {
      sum += vsN[i + j];
    }

    if (sum > lastSum) total++;
    lastSum = sum;
  }

  return total;
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
