import { readFileSync } from "fs";

export {};

const main = (vs: string[]) => {};

const main2 = (vs: string[]) => {};

const vt = readFileSync(`${__dirname}/inputT.txt`).toString().split("\n");
const v = readFileSync(`${__dirname}/input.txt`).toString().split("\n");

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
