import { readFileSync } from "fs";

export {};

let pd = new Map<number, number>();

const initPd = (vs: number[]) => {
  pd.set(vs.length - 1, 1);
};

const buildPath = (vs: number[], i: number) => {
  if (i >= vs.length) {
    return 0;
  }

  if (pd.has(i)) {
    return pd.get(i);
  }

  let sum = 0;
  for (
    let nextI = 1;
    i + nextI < vs.length && vs[i + nextI] - vs[i] <= 3;
    nextI++
  ) {
    buildPath(vs, i + nextI);
    sum += pd.get(i + nextI);
  }
  pd.set(i, sum);
};

const main = (vs: number[]) => {
  vs.sort((a, b) => a - b);
  vs.unshift(0);
  vs.push(vs[vs.length - 1] + 3);

  const sums = [0, 0, 0];
  for (let i = 1; i < vs.length; i++) {
    sums[vs[i] - vs[i - 1] - 1]++;
  }
  return sums[1 - 1] * sums[3 - 1];
};

const main2 = (vs: number[]) => {
  initPd(vs);
  buildPath(vs, 0);
  return pd.get(0);
};

const vt = readFileSync(`${__dirname}/inputT.txt`)
  .toString()
  .split("\n")
  .map((v) => Number(v));
const v = readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n")
  .map((v) => Number(v));

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
pd = new Map();
console.log("test", main2(vt));
pd = new Map();
console.log("final", main2(v));
