import { readFileSync } from "fs";

export {};

const north = "N";
const south = "S";
const east = "E";
const west = "W";

const parseVs = (vs: string[]) =>
  vs.map((inst) => {
    const [_, i, n] = inst.match(/(\w)(\d+)/);
    return { dir: i, n: Number(n) };
  });

const turnLeft = (origDir: string, deg: number) => {
  let dir = origDir;
  while (deg > 0) {
    dir = {
      [north]: west,
      [west]: south,
      [south]: east,
      [east]: north,
    }[dir];
    deg -= 90;
  }
  return dir;
};

const turnRight = (origDir: string, deg: number) => {
  let dir = origDir;
  while (deg > 0) {
    dir = {
      [north]: east,
      [east]: south,
      [south]: west,
      [west]: north,
    }[dir];
    deg -= 90;
  }
  return dir;
};

const getDir = (currDir: string, turnDir: string, turnDeg: number) => {
  return (
    {
      L: turnLeft(currDir, turnDeg),
      R: turnRight(currDir, turnDeg),
      F: currDir,
    }[turnDir] || turnDir
  );
};

const moveDir = (xy: [number, number], step: number, dir: string) => {
  const [x, y] = xy;
  return [
    x + ({ [east]: step, [west]: -step }[dir] || 0),
    y + ({ [south]: step, [north]: -step }[dir] || 0),
  ];
};

const moveDir2 = (
  xy: [number, number],
  step: number,
  wxy: [number, number]
) => {
  const [x, y] = xy;
  const [wx, wy] = wxy;

  return [x + step * wx, y + step * wy];
};

const rotateWp = (
  wxy: [number, number],
  xy: [number, number],
  dir: string,
  deg: number
) => {
  const [x, y] = xy;
  let [wx, wy] = wxy;

  if (dir === "L") {
    deg = -deg;
  }

  const degRad = (deg * Math.PI) / 180;
  const cosDeg = Math.round(Math.cos(degRad));
  const sinDeg = Math.round(Math.sin(degRad));

  [wx, wy] = [wx * cosDeg - wy * sinDeg, wx * sinDeg + wy * cosDeg];

  return [wx, wy];
};

const main = (vs: string[]) => {
  const instructions = parseVs(vs);

  const [[finalX, finalY], _] = instructions.reduce(
    ([pxy, dir], instr) => {
      const nextDir =
        ({ L: true, R: true }[instr.dir] && getDir(dir, instr.dir, instr.n)) ||
        dir;

      if (instr.dir === "L" || instr.dir === "R") {
        return [pxy, nextDir];
      }

      return [moveDir(pxy, instr.n, getDir(dir, instr.dir, instr.n)), nextDir];
    },
    [[0, 0], east]
  );

  return Math.abs(finalX) + Math.abs(finalY);
};

const main2 = (vs: string[]) => {
  const instructions = parseVs(vs);

  const [[finalX, finalY], _] = instructions.reduce(
    ([pxy, wpxy], instr) => {
      if (instr.dir === "F") {
        return [moveDir2(pxy, instr.n, wpxy), wpxy];
      }

      if ([north, east, south, west].includes(instr.dir)) {
        return [pxy, moveDir(wpxy, instr.n, instr.dir)];
      }

      return [pxy, rotateWp(wpxy, pxy, instr.dir, instr.n)];
    },
    [[0, 0], [10, -1] as [number, number]]
  );

  return Math.abs(finalX) + Math.abs(finalY);
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
