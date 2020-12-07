import { readFileSync } from "fs";

export {};

const isValid = (pwdPolicy: string): boolean => {
  const [_, min, max, c, w] = pwdPolicy.match(/(\d+)\-(\d+) (\w): (\w+)/);

  const occurences = [...((w as string) as any)]
    .map((c1) => c1 === c)
    .filter((v) => v);

  return occurences.length >= Number(min) && occurences.length <= Number(max);
};

const isValid2 = (pwdPolicy: string): boolean => {
  const [_, p1, p2, c, w] = pwdPolicy.match(/(\d+)\-(\d+) (\w): (\w+)/);

  const a1 = (w as string)[Number(p1) - 1];
  const a2 = (w as string)[Number(p2) - 1];

  return (a1 === c && a2 !== c) || (a1 !== c && a2 === c);
};

const main = (vs: string[]) => {
  return vs.filter((pwd) => isValid(pwd)).length;
};

const main2 = (vs: string[]) => {
  return vs.filter((pwd) => isValid2(pwd)).length;
};

const vt = readFileSync(`${__dirname}/inputT.txt`).toString().split("\n");
const v = readFileSync(`${__dirname}/input.txt`).toString().split("\n");

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
