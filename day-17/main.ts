import { readFileSync } from "fs";

export {};

const offset = 100;

const initialState = (origVs: string[]): string[][][] => {
  const vs: string[][][] = new Array(offset).fill(0);
  vs.forEach((_zPlane, k) => {
    vs[k] = new Array(offset).fill(0);
    vs[k].forEach((_row, i) => {
      vs[k][i] = new Array(offset).fill(".");
    });
  });

  origVs
    .map((row) => row.split(""))
    .forEach((row, i) =>
      row.forEach((v, j) => {
        vs[0 + offset / 2][i + offset / 2][j + offset / 2] = v;
      })
    );

  return vs;
};

const printSpace = (vs: string[][][]) => {
  vs.forEach((zPlane, z) => {
    console.log(`z=${z}`);
    console.log(zPlane.map((row) => row.join("")).join("\n"));
    console.log("\n");
  });
};

const getAdjacent = (vs: string[][][], z: number, i: number, j: number) => {
  const ps = [];
  for (let z2 of [-1, 0, 1]) {
    for (let i2 of [-1, 0, 1]) {
      for (let j2 of [-1, 0, 1]) {
        if (z2 === 0 && i2 === 0 && j2 === 0) {
          continue;
        }
        if (
          z + z2 < 0 ||
          i + i2 < 0 ||
          j + j2 < 0 ||
          z + z2 >= vs.length ||
          i + i2 >= vs[0].length ||
          j + j2 >= vs[0][0].length
        ) {
          continue;
        }
        const [zN, iN, jN] = [z + z2, i + i2, j + j2];
        ps.push(vs[zN][iN][jN]);
      }
    }
  }
  return ps;
};

const applyRules = (origVs: string[][][]): string[][][] => {
  const vs = origVs.map((plane) => plane.map((row) => [...row]));

  origVs.forEach((plane, z) =>
    plane.forEach((row, i) =>
      row.forEach((_v, j) => {
        const neighbours = getAdjacent(origVs, z, i, j);
        const activeNeighboursN = neighbours.filter((v) => v === "#").length;

        const active = origVs[z][i][j] === "#";
        if (active && activeNeighboursN !== 2 && activeNeighboursN !== 3) {
          vs[z][i][j] = ".";
        } else if (!active && activeNeighboursN === 3) {
          vs[z][i][j] = "#";
        }
      })
    )
  );

  return vs;
};

const main = (vs: string[]) => {
  let state = initialState(vs);
  new Array(6).fill(0).forEach(() => {
    state = applyRules(state);
  });

  return state.reduce(
    (ps, plane) =>
      ps +
      plane.reduce(
        (rs, row) => rs + row.reduce((s, v) => s + (v === "#" ? 1 : 0), 0),
        0
      ),
    0
  );
};

const main2 = (vs: string[]) => {};

const [vt, v] = ["inputT.txt", "input.txt"].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split("\n")
);

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
