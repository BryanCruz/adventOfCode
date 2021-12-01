import { readFileSync } from "fs";

export {};

const letters = "abcdefghijklmnopqrstuvwxyz";

const main = (vs: string[]) => {
  let sum = 0;
  let docI = 0;

  while (docI < vs.length) {
    let currentDoc = "";
    while (docI < vs.length && vs[docI] !== "") {
      currentDoc += vs[docI];
      docI++;
    }
    docI++;

    const ans = new Map<String, Boolean>();
    for (let i = 0; i < 26; i++) {
      ans.set(letters[i], false);
    }

    for (let i = 0; i < currentDoc.length; i++) {
      ans.set(currentDoc[i], true);
    }

    ans.forEach((v, k) => {
      if (v) {
        sum++;
      }
    });
  }

  return sum;
};

const main2 = (vs: string[]) => {
  let sum = 0;
  let docI = 0;

  while (docI < vs.length) {
    let currentDoc = "";
    let currentN = 0;
    while (docI < vs.length && vs[docI] !== "") {
      currentDoc += vs[docI] + "-";
      docI++;
      currentN++;
    }
    docI++;

    const ans = new Map<String, number>();
    for (let i = 0; i < 26; i++) {
      ans.set(letters[i], 0);
    }

    for (const miniDoc of currentDoc.split("-")) {
      const miniAns = new Set<string>();

      for (let i = 0; i < miniDoc.length; i++) {
        miniAns.add(miniDoc[i]);
      }

      miniAns.forEach((v) => {
        ans.set(v, 1 + ans.get(v));
      });
    }

    ans.forEach((v, k) => {
      if (v === currentN) {
        sum++;
      }
    });
  }

  return sum;
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
