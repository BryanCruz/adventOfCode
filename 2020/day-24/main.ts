import { count } from "console";
import { readFileSync } from "fs";

export {};

const toMove = {
  e: [+2, 0],
  se: [+1, -1],
  sw: [-1, -1],
  w: [-2, 0],
  nw: [-1, +1],
  ne: [+1, +1],
};

const initialTiles = (vs: string[]): Map<string, boolean> => {
  const tileFloor = new Map<string, boolean>();

  for (const v of vs) {
    let [x, y] = [0, 0];
    v.split("").reduce((lastV, currV) => {
      let d = lastV ? lastV : "";
      d = d.concat(currV);

      if (!Object.keys(toMove).includes(d)) {
        return d;
      }

      const [changeX, changeY] = toMove[d];
      x += changeX;
      y += changeY;

      return null;
    }, null);

    const hash = [x, y].join(",");
    tileFloor.set(hash, !tileFloor.get(hash));
  }

  return tileFloor;
};

const countBlack = (tileFloor: Map<string, boolean>): number => {
  let count = 0;
  tileFloor.forEach((value) => {
    if (value) {
      count++;
    }
  });
  return count;
};

const getAdjacentCoords = ([x, y]: [number, number]) => {
  const adjacentCoords: Array<[number, number]> = Object.keys(toMove).map(
    (key) => {
      const [changeX, changeY] = toMove[key];
      return [x + changeX, y + changeY];
    }
  );

  return adjacentCoords;
};

const main = (vs: string[]) => {
  const tileFloor = initialTiles(vs);
  return countBlack(tileFloor);
};

const main2 = (vs: string[]) => {
  let tileFloor = initialTiles(vs);
  for (let i = 0; i < 100; i++) {
    const coordsToEvaluate = new Set<string>();

    tileFloor.forEach((_, coord) => {
      coordsToEvaluate.add(coord);
      getAdjacentCoords(
        coord.split(",").map((v) => Number(v)) as [number, number]
      ).forEach((coord) => coordsToEvaluate.add(coord.join(",")));
    });

    const newTileFloor = new Map<string, boolean>();
    coordsToEvaluate.forEach((coord) => {
      const blackNeighboursN = getAdjacentCoords(
        coord.split(",").map((v) => Number(v)) as [number, number]
      ).filter((neighbourCoord) => tileFloor.get(neighbourCoord.join(",")))
        .length;

      if (tileFloor.get(coord)) {
        if (blackNeighboursN !== 0 && blackNeighboursN <= 2) {
          newTileFloor.set(coord, true);
        }
      } else {
        if (blackNeighboursN === 2) {
          newTileFloor.set(coord, true);
        }
      }
    });

    tileFloor = newTileFloor;
  }

  return countBlack(tileFloor);
};

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
