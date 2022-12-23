import { readFileSync } from "fs";
import { getChangeX, getChangeY, getDirName, getNextDirection } from "./math";
import { getBlockedKey, getKey, parseInput } from "./parse";
import { availableChar, blockedChar, Direction, Right } from "./types";

export {};

const main = (vs: string[], asCube = false, test = 0) => {
  const {
    board: { lines, warpingZones, blockedPoints },
    instructions,
  } = parseInput(vs, asCube, test);

  let currY = 0;
  let currX = lines[currY].firstX;
  let currD: Direction = Right;

  instructions.forEach((instruction) => {
    if (typeof instruction === "string") {
      currD = getNextDirection(currD, instruction);
      return;
    }

    for (let i = 0, x = currX, y = currY, d = currD; i < instruction; i++) {
      const nextX = x + getChangeX(d);
      const nextY = y + getChangeY(d);

      const warp = warpingZones[getKey(nextX, nextY, d)];
      if (warp) {
        x = warp.x;
        y = warp.y;
        d = warp.d;
      } else {
        x = nextX;
        y = nextY;
      }

      const currChar = blockedPoints.has(getBlockedKey(x, y))
        ? blockedChar
        : availableChar;

      if (currChar === availableChar) {
        currX = x;
        currY = y;
        currD = d;
        continue;
      }

      if (currChar === blockedChar) {
        break;
      }
    }
  });

  return getScore(currY, currX, currD);
};

const main2 = (vs: string[], test: number) => main(vs, true, test);

const getScore = (y: number, x: number, d: Direction): number =>
  1000 * (y + 1) + 4 * (x + 1) + d;

const [vt, v] = ["inputT.txt", "input.txt"].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split(/\r?\n/)
);

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt, 1));
console.log("final", main2(v, 0));
