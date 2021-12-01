import { readFileSync } from "fs";

export {};

const main = (vs: string[]) => {
  const estimate = Number(vs[0]);
  const fs = vs[1]
    .split(",")
    .filter((v) => v !== "x")
    .map((v) => Number(v));

  const tsAfterEstimate = fs.map((f) => f * Math.ceil(estimate / f) - estimate);
  const [firstT, firstI] = tsAfterEstimate.reduce(
    (min, curr, currI) => {
      if (curr < min[0]) {
        return [curr, currI];
      }

      return min;
    },
    [fs[0], -1]
  );

  return firstT * fs[firstI];
};

const findInverse = (a: bigint, m: bigint): bigint => {
  for (let i = BigInt(1); ; i += BigInt(1)) {
    if ((a * i) % m === BigInt(1)) {
      return i;
    }
  }
};

const main2 = (origVs: string[]) => {
  const fs = origVs[1]
    .split(",")
    .reverse()
    .map((v) => (v === "x" ? -1 : Number(v)))
    .map((v, i) => [BigInt(v), BigInt(i)] as [bigint, bigint])
    .filter(([v]) => v !== BigInt(-1));

  const ns = fs.map(([ni]) => ni);
  const bs = fs.map(([_ni, bi]) => bi);

  const N = ns.reduce((pN, ni) => ni * pN);
  const Ns = ns.map((ni) => N / ni);

  const xs = Ns.map((Ni, i) => findInverse(Ni, ns[i]));

  const bNxs = Ns.map((Ni, i) => bs[i] * Ni * xs[i]);

  return (bNxs.reduce((pbNx, bNxi) => pbNx + bNxi) % N) - bs[bs.length - 1];
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
