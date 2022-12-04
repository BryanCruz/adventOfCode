import { readFileSync } from "fs";

export {};

interface Pair {
  rangeStart: number;
  rangeEnd: number;
}

const main = (vs: string[], fullOverlap: boolean = true) => {
  return vs.reduce(
    (nOfPairsWithOverlap, currLine) =>
      nOfPairsWithOverlap +
      (hasOverlap(parseInput(currLine), fullOverlap) ? 1 : 0),
    0
  );
};

const main2 = (vs: string[]) => main(vs, false);

const parseInput = (line: string): [Pair, Pair] => {
  const inputLineRegex = /(\d+)-(\d+),(\d+)-(\d+)/;
  const [_, startA, endA, startB, endB]: any = line.match(inputLineRegex);

  return [
    { rangeStart: Number(startA), rangeEnd: Number(endA) },
    { rangeStart: Number(startB), rangeEnd: Number(endB) },
  ];
};

const hasOverlap = ([p1, p2]: [Pair, Pair], fullOverlap: boolean): boolean => {
  if (fullOverlap) {
    return isFullyContained([p1, p2]) || isFullyContained([p2, p1]);
  }

  return !isNotContained([p1, p2]);
};

const isFullyContained = ([p1, p2]: [Pair, Pair]): boolean =>
  p1.rangeStart >= p2.rangeStart && p1.rangeEnd <= p2.rangeEnd;

const isNotContained = ([p1, p2]: [Pair, Pair]): boolean =>
  p1.rangeEnd < p2.rangeStart || p1.rangeStart > p2.rangeEnd;

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
