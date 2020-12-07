import { readFileSync } from "fs";

export {};

const main = (vs: string[]) => {
  let maxId = -1;
  for (const v of vs) {
    let s = 0;
    let p2 = 6;
    for (let i = 0; i < 7; i++) {
      if (v[i] !== "F") {
        s += Math.pow(2, p2);
      }

      p2--;
    }

    let sx = 0;
    p2 = 2;
    for (let i = 0; i < 3; i++) {
      if (v[i + 7] !== "L") {
        sx += Math.pow(2, p2);
      }
      p2--;
    }

    const id = s * 8 + sx;
    maxId = Math.max(maxId, id);
  }

  return maxId;
};

const main2 = (vs: string[]) => {
  const seats = new Set<number>();

  for (let i = 0; i <= 127; i++) {
    for (let j = 0; j <= 7; j++) {
      seats.add(i * 8 + j);
    }
  }

  for (const v of vs) {
    let s = 0;
    let p2 = 6;
    for (let i = 0; i < 7; i++) {
      if (v[i] !== "F") {
        s += Math.pow(2, p2);
      }

      p2--;
    }

    let sx = 0;
    p2 = 2;
    for (let i = 0; i < 3; i++) {
      if (v[i + 7] !== "L") {
        sx += Math.pow(2, p2);
      }
      p2--;
    }

    const id = s * 8 + sx;
    seats.delete(id);
  }

  let lastKey = -1;
  let rightKey = -1;
  let n = 0;
  seats.forEach((k) => {
    if (lastKey !== -1 && k - lastKey > 1) {
      if (n === 0) {
        rightKey = k;
        n++;
      } else if (n === 1) {
        n++;
      }
    } else if (n !== 2) {
      rightKey = -1;
      n = 0;
    }
    lastKey = k;
  });
  return n === 2 ? rightKey : -1;
};

const vt = readFileSync(`${__dirname}/inputT.txt`).toString().split("\n");
const v = readFileSync(`${__dirname}/input.txt`).toString().split("\n");

console.log("First Half");
// console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
// console.log("test", main2(vt));
console.log("final", main2(v));
