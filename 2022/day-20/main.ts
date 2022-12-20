import { readFileSync } from "fs";

export {};

type Node = {
  value: number;
  next?: Node;
  previous?: Node;
};

const main = (vs: string[], offset = 1, rounds = 1) => {
  const originalNumbers = parseInput(vs).map((v) => v * offset);
  const l = originalNumbers.length;

  const circularList: Node[] = originalNumbers.map((n) => ({ value: n }));
  circularList.forEach((node, i) => {
    node.next = circularList[(i + 1) % circularList.length];
    node.previous = circularList[(i - 1 + l) % circularList.length];
  });

  const originalMapping: { [key: number]: Node } = circularList
    .map((_, i) => ({ [i]: circularList[i] }))
    .reduce((obj, currObj) => ({ ...obj, ...currObj }), {});

  Array(rounds)
    .fill(0)
    .forEach((_, round) => {
      console.log("round", round + 1);
      originalNumbers.forEach((number, i) => {
        const node = originalMapping[i];
        let stepsToGo = node.value;
        if (stepsToGo < 0) {
          stepsToGo += (Math.floor(-stepsToGo / (l - 1)) + 1) * (l - 1);
        }
        stepsToGo = stepsToGo % (l - 1);

        for (let step = stepsToGo; step !== 0 && stepsToGo > 0; step += -1) {
          const { previous, next } = node;

          previous!.next = next;

          node.previous = next;
          node.next = next!.next;
          next!.next!.previous = node;

          next!.previous = previous;
          next!.next = node;
        }
      });
    });

  let sum = 0;
  for (let i = 1000; i <= 3000; i += 1000) {
    const stepsToGo = i;
    let node0 = originalMapping[originalNumbers.findIndex((v) => v === 0)];

    for (let step = 0; step < stepsToGo; step++) {
      node0 = node0.next!;
    }

    sum += node0.value;
  }

  return sum;
};

const main2 = (vs: string[]) => main(vs, 811589153, 10);

const parseInput = (lines: string[]): number[] =>
  lines.map((line) => Number(line));

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
