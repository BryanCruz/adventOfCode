import { readFileSync } from "fs";

export {};

const getAdjacent1 = (vs: string[][], i: number, j: number) => {
  const ps = [];
  for (let i2 of [-1, 0, 1]) {
    for (let j2 of [-1, 0, 1]) {
      if (i2 === 0 && j2 === 0) {
        continue;
      }
      if (
        i + i2 < 0 ||
        j + j2 < 0 ||
        i + i2 >= vs.length ||
        j + j2 >= vs[0].length
      ) {
        continue;
      }
      const [iN, jN] = [i + i2, j + j2];
      ps.push([iN, jN]);
    }
  }
  return ps;
};

const getAdjacent2 = (vs: string[][], i: number, j: number) => {
  let [tl, t, tr, l, r, bl, b, br] = new Array(8).fill(0).map((v) => null);
  let range = 1;
  while (range < Math.min(vs.length, vs[0].length)) {
    for (let i2 of [-range, 0, range]) {
      for (let j2 of [-range, 0, range]) {
        if (i2 === 0 && j2 === 0) {
          continue;
        }
        if (
          i + i2 < 0 ||
          j + j2 < 0 ||
          i + i2 >= vs.length ||
          j + j2 >= vs[0].length
        ) {
          continue;
        }
        const [iN, jN] = [i + i2, j + j2];

        if (vs[iN][jN] === ".") {
          continue;
        }

        if (i2 < 0) {
          if (j2 < 0) {
            tl ||= [iN, jN];
          } else if (j2 === 0) {
            t ||= [iN, jN];
          } else {
            tr ||= [iN, jN];
          }
        } else if (i2 > 0) {
          if (j2 < 0) {
            bl ||= [iN, jN];
          } else if (j2 === 0) {
            b ||= [iN, jN];
          } else {
            br ||= [iN, jN];
          }
        } else {
          if (j2 < 0) {
            l ||= [iN, jN];
          } else {
            r ||= [iN, jN];
          }
        }
      }
    }
    range++;
  }

  return [tl, t, tr, l, r, bl, b, br].filter((v) => v !== null);
};

const getAdjacent = (vs: string[][], i: number, j: number, part1: boolean) => {
  if (part1) {
    return getAdjacent1(vs, i, j);
  } else {
    return getAdjacent2(vs, i, j);
  }
};

const applyRules = (
  vs: string[][],
  occupiedLimit: number
): [string[][], boolean] => {
  const vsNew = vs.map((row) => [...row]);
  let changed = false;
  for (let i = 0; i < vs.length; i++) {
    for (let j = 0; j < vs[0].length; j++) {
      if (
        vs[i][j] === "L" &&
        getAdjacent(vs, i, j, occupiedLimit === 4).every(
          ([i2, j2]) => vs[i2][j2] !== "#"
        )
      ) {
        vsNew[i][j] = "#";
        changed = true;
      } else if (
        vs[i][j] === "#" &&
        getAdjacent(vs, i, j, occupiedLimit === 4).filter(
          ([i2, j2]) => vs[i2][j2] === "#"
        ).length >= occupiedLimit
      ) {
        vsNew[i][j] = "L";
        changed = true;
      }
    }
  }
  return [vsNew, changed];
};

const printBoard = (vs: string[][]) => {
  console.log(vs.map((row) => row.join("")).join("\n"));
  console.log("\n");
};

const main = (vsOrig: string[][], occupiedLimit: number) => {
  let vs = vsOrig;
  let changed = true;
  while (changed) {
    [vs, changed] = applyRules(vs, occupiedLimit);
  }

  return vs.reduce((pvRowSum, currentRow) => {
    return (
      pvRowSum + currentRow.reduce((pvSum, v) => pvSum + (v === "#" ? 1 : 0), 0)
    );
  }, 0);
};

const vt = readFileSync(`${__dirname}/inputT.txt`)
  .toString()
  .split("\n")
  .map((row) => row.split(""));
const v = readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n")
  .map((row) => row.split(""));

console.log("First Half");
console.log("test", main(vt, 4));
console.log("final", main(v, 4));
console.log("==========");
console.log("Second Half");
console.log("test", main(vt, 5));
console.log("final", main(v, 5));
