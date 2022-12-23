import { readFileSync } from "fs";

export {};

type Direction = "N" | "S" | "W" | "E";
let directions: Direction[] = ["N", "S", "W", "E"];

type DirectionExtended = Direction | "NE" | "NW" | "SE" | "SW";
const directionsExtended: DirectionExtended[] = (directions as DirectionExtended[]).concat(
  ["NE", "NW", "SE", "SW"]
);

const main = (vs: string[]) => {
  directions = ["N", "S", "W", "E"];
  let elves = parseInput(vs);

  Array(10)
    .fill(0)
    .forEach((_, round) => {
      [elves] = playRound(elves);
    });

  return getScore(elves);
};

const main2 = (vs: string[]) => {
  directions = ["N", "S", "W", "E"];
  let elves = parseInput(vs);

  let i = 0,
    moved = true;
  while (moved) {
    [elves, moved] = playRound(elves);
    i++;
  }

  return i;
};

const getKey = (i: number, j: number) => `${i}:${j}`;

const getCoord = (k: string) => {
  return k.split(":").map((v) => Number(v)) as [number, number];
};

const playRound = (board: Set<string>): [Set<string>, boolean] => {
  const newBoard = new Set<string>();
  let moved = false;
  const elfByProposals: { [proposal: string]: string[] } = {};

  board.forEach((elf) => {
    const gonnaStop = directionsExtended.every(
      (d) => !board.has(getNewKey(elf, d))
    );

    if (gonnaStop) {
      newBoard.add(elf);
      return;
    }

    const moveDirection = directions.find((d) => {
      const toLook = getDirectionsToLook(d);

      if (toLook.every((dToLook) => !board.has(getNewKey(elf, dToLook)))) {
        return true;
      }

      return false;
    });

    if (moveDirection === undefined) {
      newBoard.add(elf);
      return;
    }

    const newElf = getNewKey(elf, moveDirection);
    elfByProposals[newElf] = (elfByProposals[newElf] || []).concat([elf]);
  });

  Object.keys(elfByProposals).forEach((k) => {
    const elves = elfByProposals[k];

    if (elves.length === 1) {
      newBoard.add(k);
      moved = true;
      return;
    }

    elves.forEach((elf) => newBoard.add(elf));
  });

  const currPriority = directions.shift()!;
  directions.push(currPriority);

  if (newBoard.size !== board.size) {
    throw Error("e");
  }

  return [newBoard, moved];
};

const getNewKey = (elf: string, direction: DirectionExtended): string => {
  const [i, j] = getCoord(elf);

  // console.log("getChanges", direction);
  const [iChange, jChange] = getChanges(direction);
  // console.log(iChange, jChange);

  return getKey(i + iChange, j + jChange);
};

const getChanges = (direction: DirectionExtended): [number, number] => {
  const dirToChanges: { [key in Direction]: [number, number] } = {
    N: [-1, 0],
    S: [1, 0],
    W: [0, -1],
    E: [0, 1],
  };

  return (direction.split("") as Direction[]).reduce(
    ([i, j], d) => {
      const [iChange, jChange] = dirToChanges[d];
      return [i + iChange, j + jChange];
    },
    [0, 0] as [number, number]
  );
};

const getDirectionsToLook = (d: Direction): DirectionExtended[] =>
  directionsExtended.filter((ext) => ext.includes(d));

const getScore = (elves: Set<string>): number => {
  let [minI, maxI, minJ, maxJ] = [
    Number.MAX_VALUE,
    Number.MIN_VALUE,
    Number.MAX_VALUE,
    Number.MIN_VALUE,
  ];

  elves.forEach((k) => {
    const [i, j] = getCoord(k);

    if (i < minI) {
      minI = i;
    }
    if (j < minJ) {
      minJ = j;
    }
    if (i > maxI) {
      maxI = i;
    }
    if (j > maxJ) {
      maxJ = j;
    }
  });

  return (maxJ - minJ + 1) * (maxI - minI + 1) - elves.size;
};

const printElves = (elves: Set<string>, round: number): void => {
  let [minI, maxI, minJ, maxJ] = [
    Number.MAX_VALUE,
    Number.MIN_VALUE,
    Number.MAX_VALUE,
    Number.MIN_VALUE,
  ];

  elves.forEach((k) => {
    const [i, j] = getCoord(k);

    if (i < minI) {
      minI = i;
    }
    if (j < minJ) {
      minJ = j;
    }
    if (i > maxI) {
      maxI = i;
    }
    if (j > maxJ) {
      maxJ = j;
    }
  });

  const b = [] as string[][];
  for (let ii = minI; ii <= maxI; ii++) {
    const bb = [] as string[];
    for (let jj = minJ; jj <= maxJ; jj++) {
      const k = getKey(ii, jj);
      bb.push(elves.has(k) ? "#" : ".");
    }
    b.push(bb);
  }

  console.log("/////////////", round);
  console.log(b.map((line) => line.join("")).join("\n"));
};

const parseInput = (lines: string[]): Set<string> => {
  const elves = new Set<string>();
  lines.forEach((line, i) =>
    line.split("").forEach((c, j) => {
      if (c === "#") {
        elves.add(getKey(i, j));
      }
    })
  );
  return elves;
};

const [vt1, vt, v] = [
  "inputT1.txt",
  "inputT.txt",
  "input.txt",
].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split(/\r?\n/)
);

console.log("First Half");
console.log("test", main(vt1));
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
