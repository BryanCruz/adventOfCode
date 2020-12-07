import { readFileSync } from "fs";

export {};

const findSum2 = (vs: number[]) => {
  vs.sort((a, b) => a - b);

  let [i1, i2] = [0, vs.length - 1];
  let sum = vs[i1] + vs[i2];

  while (sum !== 2020) {
    if (sum < 2020) {
      i1++;
    } else {
      i2--;
    }

    sum = vs[i1] + vs[i2];
  }

  return vs[i1] * vs[i2];
};

const findSum3 = (vs: number[]) => {
  vs.sort((a, b) => a - b);

  let [i1, i2, i3] = [0, Math.floor(vs.length / 2), vs.length - 1];
  let sum = vs[i1] + vs[i2] + vs[i3];

  while (sum !== 2020) {
    if (sum < 2020 && i1 < i2) {
      i1++;
    } else if (sum < 2020) {
      i2++;
      i1 = 0;
      i3 = vs.length - 1;
    } else if (sum > 2020 && i2 < i3) {
      i3--;
    } else if (sum > 2020) {
      i2--;
      i1 = 0;
      i3 = vs.length - 1;
    }

    sum = vs[i1] + vs[i2] + vs[i3];
  }

  return vs[i1] * vs[i2] * vs[i3];
};

const vsT = readFileSync(`${__dirname}/inputT.txt`)
  .toString()
  .split("\n")
  .map((n) => Number(n));

const vs = readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n")
  .map((n) => Number(n));

console.log("First Half");
console.log("test", findSum2(vsT));
console.log("final", findSum2(vs));
console.log("==========");
console.log("Second Half");
console.log("test", findSum3(vsT));
console.log("final", findSum3(vs));
