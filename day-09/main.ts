import { readFileSync } from "fs";

export {};

const findSum2 = (vsOrig: number[], target = 2020) => {
  const vs = [...vsOrig];
  vs.sort((a, b) => a - b);

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
    return 1;
  }

  return 0;
};

const insertV = (v: number, vs: number[]) => {
  vs.shift();
  vs.push(v);
};

const main = (vsOrig: number[], n: number) => {
  let preamble = vsOrig.slice(0, n);

  const vs = vsOrig.slice(n);

  for (const v of vs) {
    if (!findSum2(preamble, v)) {
      return v;
    }

    insertV(v, preamble);
  }
};

let sumTree = new Map<string, number>();
const buildIndex = (v1: number, v2: number) => `${v1},${v2}`;
const buildTree = (vs: number[], i1: number, i2: number) => {
  if (i1 > i2) {
    return;
  }

  const strIndex = buildIndex(i1, i2);
  if (i1 === i2) {
    sumTree.set(strIndex, vs[i1]);
    return;
  }

  const mid = Math.floor((i1 + i2) / 2);
  buildTree(vs, i1, mid);
  buildTree(vs, mid + 1, i2);

  sumTree.set(
    strIndex,
    sumTree.get(buildIndex(i1, mid)) + sumTree.get(buildIndex(mid + 1, i2))
  );
};

const getIndex = (i1: number, i2: number) => sumTree.get(buildIndex(i1, i2));

const getSum = (c1: number, c2: number, r1: number, r2: number) => {
  if (r1 <= c1 && c2 <= r2) {
    return getIndex(c1, c2);
  }

  if (c2 < r1 || r2 < c1) {
    return 0;
  }

  const mid = Math.floor((c1 + c2) / 2);
  return getSum(c1, mid, r1, r2) + getSum(mid + 1, c2, r1, r2);
};

const main2 = (vs: number[], target: number) => {
  sumTree = new Map<string, number>();
  buildTree(vs, 0, vs.length - 1);

  for (let i = 0; i < vs.length; i++) {
    for (let j = i + 1; j < vs.length; j++) {
      if (target === getSum(0, vs.length - 1, i, j)) {
        const miniVs = vs.slice(i, j + 1);
        return Math.min(...miniVs) + Math.max(...miniVs);
      }
    }
  }
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
const test1 = main(vt, 5);
const final1 = main(v, 25);
console.log("test", test1);
console.log("final", final1);
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt, test1));
console.log("final", main2(v, final1));
