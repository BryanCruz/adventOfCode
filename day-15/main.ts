import { readFileSync } from "fs";

export {};

const main = (vs: string[], target: number) => {
  const spoken = vs[0]
    .split(",")
    .map((v) => Number(v))
    .reverse();

  for (let i = spoken.length; i < target; i++) {
    const lastIndex = spoken.slice(1).indexOf(spoken[0]);
    if (lastIndex >= 0) {
      const firstSpoken = spoken.length - lastIndex - 2;
      const lastSpoken = i - 1;
      spoken.unshift(lastSpoken - firstSpoken);
    } else {
      spoken.unshift(0);
    }
  }

  return spoken[0];
};

const main2 = (origVs: string[], target: number) => {
  const vs = origVs[0].split(",").map((v) => Number(v));
  const spoken = new Map<number, number>();
  vs.slice(0, vs.length - 1).forEach((v, i) => {
    spoken.set(Number(v), i + 1);
  });

  let lastValue = vs[vs.length - 1];
  for (let i = vs.length + 1; i <= target; i++) {
    const lastIndex = spoken.get(lastValue);
    let shoutValue = -1;
    if (lastIndex === undefined) {
      shoutValue = 0;
    } else {
      shoutValue = i - 1 - lastIndex;
    }
    spoken.set(lastValue, i - 1);
    lastValue = shoutValue;
  }

  return lastValue;
};

const [vt, v] = ["inputT.txt", "input.txt"].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split("\n")
);

console.log("First Half");
console.log("test", main(vt, 2020));
console.log("final", main(v, 2020));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt, 30000000));
console.log("final", main2(v, 30000000));
