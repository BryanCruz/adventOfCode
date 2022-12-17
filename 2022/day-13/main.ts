import { readFileSync } from "fs";
import { parseInput } from "./parse";
import { flatten } from "../../common";

export {};

const main = (vs: string[]) => {
  const packetTuples = parseInput(vs);
  return packetTuples
    .map(([a, b], i) => [a, b, i + 1] as any)
    .filter(([a, b]) => compare(a, b) === -1)
    .map(([a, b, i]) => i)
    .reduce((sum, i) => sum + i);
};

const main2 = (vs: string[]) => {
  const dividerA = [[2]];
  const dividerB = [[6]];

  const packets = flatten(parseInput(vs));
  packets.push(dividerA);
  packets.push(dividerB);

  packets.sort(compare);

  return packets
    .map((packet, i) => [packet, i + 1])
    .filter(
      ([packet]) =>
        compare(packet, dividerA) === 0 || compare(packet, dividerB) === 0
    )
    .map(([_, i]) => i)
    .reduce((m, v) => m * v);
};

const compare = (a: any, b: any): -1 | 0 | 1 => {
  if (isNumber(a) && isNumber(b)) {
    return ((a - b) / (Math.abs(a - b) || 1)) as -1 | 0 | 1;
  }

  if (isList(a) && isList(b)) {
    for (let i = 0; ; i++) {
      if (a[i] === undefined && b[i] === undefined) {
        return 0;
      }
      if (a[i] === undefined) {
        return -1;
      }
      if (b[i] === undefined) {
        return 1;
      }

      const result = compare(a[i], b[i]);
      if (result) {
        return result;
      }
    }
  }

  if (isNumber(a)) {
    return compare([a], b);
  }

  return compare(a, [b]);
};

const isNumber = (a: any): a is number => typeof a === "number";

const isList = (a: any): a is any[] => Array.isArray(a);

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
