import { readFileSync } from "fs";

export {};

const directions = ["left", "right", "up", "down"] as const;
type Direction = typeof directions[number];

type Grid = number[][];

type Tree = {
  height: number;
  rowIndex: number;
  colIndex: number;
  visibleFrom: {
    [key in Direction]: boolean;
  };
  scoreFrom: {
    [key in Direction]: number;
  };
};

type Context = {
  [key: string]: Tree;
};

const main = (vs: string[]) => {
  const grid = parseInput(vs);
  const context: Context = {};

  fillContext(context, grid);

  directions.forEach((direction) => {
    grid.forEach((row, rowIndex) =>
      row.forEach((_, colIndex) => {
        const tree = context[getKey(rowIndex, colIndex)];
        tree.visibleFrom[direction] = isTreeVisible(grid, tree, direction);
      })
    );
  });

  return Object.values(context).filter((tree) =>
    directions.some((direction) => tree.visibleFrom[direction])
  ).length;
};

const main2 = (vs: string[]) => {
  const grid = parseInput(vs);
  const context: Context = {};

  fillContext(context, grid);

  directions.forEach((direction) => {
    grid.forEach((row, rowIndex) =>
      row.forEach((_, colIndex) => {
        const tree = context[getKey(rowIndex, colIndex)];
        tree.scoreFrom[direction] = getScore(grid, tree, direction);
      })
    );
  });

  return Object.values(context)
    .map((tree) =>
      directions.reduce(
        (product, direction) => product * tree.scoreFrom[direction],
        1
      )
    )
    .sort((a, b) => b - a)[0];
};

const fillContext = (context: Context, grid: Grid) => {
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    for (let colIndex = 0; colIndex < grid[0].length; colIndex++) {
      context[getKey(rowIndex, colIndex)] = {
        rowIndex,
        colIndex,
        height: grid[rowIndex][colIndex],
        visibleFrom: {
          up: false,
          down: false,
          left: false,
          right: false,
        },
        scoreFrom: {
          up: 0,
          down: 0,
          left: 0,
          right: 0,
        },
      };
    }
  }
};

const isTreeVisible = (
  grid: Grid,
  tree: Tree,
  direction: Direction
): boolean => {
  const [rowChange, colChange] =
    direction === "left"
      ? [0, -1]
      : direction === "right"
      ? [0, 1]
      : direction === "down"
      ? [1, 0]
      : [-1, 0];

  for (
    let { rowIndex, colIndex, height } = tree;
    rowIndex >= 0 &&
    rowIndex < grid.length &&
    colIndex >= 0 &&
    colIndex < grid[0].length;
    rowIndex += rowChange, colIndex += colChange
  ) {
    if (rowIndex === tree.rowIndex && colIndex === tree.colIndex) {
      continue;
    }

    if (grid[rowIndex][colIndex] >= height) {
      return false;
    }
  }

  return true;
};

const getScore = (grid: Grid, tree: Tree, direction: Direction): number => {
  const [rowChange, colChange] =
    direction === "left"
      ? [0, -1]
      : direction === "right"
      ? [0, 1]
      : direction === "down"
      ? [1, 0]
      : [-1, 0];

  let counter = 0;
  for (
    let { rowIndex, colIndex, height } = tree;
    rowIndex >= 0 &&
    rowIndex < grid.length &&
    colIndex >= 0 &&
    colIndex < grid[0].length;
    rowIndex += rowChange, colIndex += colChange
  ) {
    if (rowIndex === tree.rowIndex && colIndex === tree.colIndex) {
      continue;
    }

    counter += 1;
    if (grid[rowIndex][colIndex] >= height) {
      return counter;
    }
  }

  return counter;
};

const getKey = (rowIndex: number, colIndex: number) =>
  `${rowIndex}:${colIndex}`;

const parseInput = (lines: string[]): Grid =>
  lines.map((line) => line.split("").map((character) => Number(character)));

const [vt, v] = ["inputT.txt", "input.txt"].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split(/\r?\n/)
);

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
