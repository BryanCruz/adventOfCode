import { readFileSync } from "fs";

export {};

const findSum2 = (vs: number[], target = 2020) => {
  let [i1, i2] = [0, vs.length - 1];
  let sum = vs[i1] + vs[i2];

  while (sum !== target && i1 < i2) {
    if (sum < target) {
      i1++;
    } else {
      i2--;
    }

    sum = vs[i1] + vs[i2];
  }

  if (i1 < i2) {
    return vs[i1] * vs[i2];
  }

  return 0;
};

const findSum3 = (vs: number[], target = 2020) => {
  let result = 0;
  vs.find((v, i) => {
    result = v * findSum2(vs.slice(0, i).concat(vs.slice(i + 1)), target - v);
    return result;
  });
  return result;
};

const vsT = readFileSync(`${__dirname}/inputT.txt`)
  .toString()
  .split("\n")
  .map((n) => Number(n));

const vs = readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n")
  .map((n) => Number(n));

vsT.sort((a, b) => a - b);
vs.sort((a, b) => a - b);
console.log("First Half");
console.log("test", findSum2(vsT));
console.log("final", findSum2(vs));
console.log("==========");
console.log("Second Half");
console.log("test", findSum3(vsT));
console.log("final", findSum3(vs));
