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

const main2 = (vs: string[]) => {};

const [vt, v] = ["inputT.txt", "input.txt"].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split("\n")
);

console.log("First Half");
console.log("test", main(vt, 2020));
console.log("final", main(v, 2020));
console.log("==========");
console.log("Second Half");
console.log("test", main(vt,30000000));
console.log("final", main(v,30000000 ));
