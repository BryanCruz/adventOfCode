import { readFileSync } from "fs";

export {};

const main = (vs: string[], n: number = 4) =>
  vs.map((line) => findStartOfPacketMarker(line, n));

const main2 = (vs: string[]) => main(vs, 14);

const findStartOfPacketMarker = (s: string, n: number): number => {
  const queue: string[] = [];
  const lastCs: { [key: string]: number } = {};

  return (
    s.split("").findIndex((c) => {
      queue.push(c);
      lastCs[c] = (lastCs[c] || 0) + 1;

      if (queue.length < n) {
        return false;
      }

      if (Object.keys(lastCs).length === n) {
        return true;
      }

      const toRemove = queue.shift()!;
      lastCs[toRemove] -= 1;

      if (lastCs[toRemove] === 0) {
        delete lastCs[toRemove];
      }
    }) + 1
  );
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
