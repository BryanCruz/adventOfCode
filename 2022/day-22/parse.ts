import { getChangeX, getChangeY, getDirName, getInverse } from "./math";
import {
  blockedChar,
  Board,
  Direction,
  Down,
  emptyChar,
  Instruction,
  Left,
  Right,
  Up,
} from "./types";

export const parseInput = (
  lines: string[],
  asCube: boolean,
  test: number
): { board: Board; instructions: Instruction[] } => {
  const emptyLineIndex = lines.findIndex((line) => line === "");

  const board = parseBoard(lines.slice(0, emptyLineIndex), asCube, test);

  const instructions = parseInstructions(lines[emptyLineIndex + 1]);

  return { board, instructions };
};

const parseInstructions = (line: string): Instruction[] =>
  line
    .match(/(L|R|\d+)/g)!
    .map((v) => (v === "R" || v === "L" ? v : Number(v)));

const parseBoard = (lines: string[], asCube: boolean, test: number): Board => {
  const { parsedLines, blockedPoints } = parseLines(lines);

  const parseWzFn = !asCube
    ? parseStraightWarpingZones
    : test
    ? parseCubeWarpingZones1
    : parseCubeWarpingZones2;
  const parsedWarpingZones = parseWzFn(parsedLines);

  return {
    lines: parsedLines,
    warpingZones: parsedWarpingZones,
    blockedPoints,
  };
};

const parseLines = (
  lines: string[]
): { parsedLines: Board["lines"]; blockedPoints: Board["blockedPoints"] } => {
  const parsedLines: Board["lines"] = [];
  const blockedPoints = new Set<string>();

  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    let firstOfLine = -1;
    let lastOfLine = -1;

    let lastChar = "";
    let lastNextChar = "";
    let lastX = -1;
    for (let x = 0; x < line.length; x++) {
      const char = line[x];
      const nextChar = line[x + 1];
      lastChar = char;
      lastNextChar = nextChar;
      lastX = x;

      if (char !== emptyChar && firstOfLine < 0) {
        firstOfLine = x;
      }

      if (char === blockedChar) {
        blockedPoints.add(getBlockedKey(x, y));
      }

      if (firstOfLine >= 0 && (nextChar === " " || nextChar === undefined)) {
        lastOfLine = x;
        break;
      }
    }

    parsedLines.push({
      firstX: firstOfLine,
      lastX: lastOfLine,
      y,
    });
  }

  return { parsedLines, blockedPoints };
};

const parseStraightWarpingZones = (
  parsedLines: Board["lines"]
): Board["warpingZones"] => {
  const parsedWarpingZones: Board["warpingZones"] = {};

  const maxX = Math.max(...parsedLines.map((line) => line.lastX));

  parsedLines.forEach((line, y) => {
    parsedWarpingZones[getKey(line.firstX - 1, y, Left)] = getStraightWarp(
      line.firstX - 1,
      y,
      line.lastX,
      y,
      Left,
      parsedWarpingZones
    );
    parsedWarpingZones[getKey(line.lastX + 1, y, Right)] = getStraightWarp(
      line.lastX + 1,
      y,
      line.firstX,
      y,
      Right,
      parsedWarpingZones
    );
  });

  for (let x = 0; x <= maxX; x++) {
    let firstYOfColumn = parsedLines.findIndex(
      (line) => line.firstX <= x && x <= line.lastX
    );
    let lastYOfColumn = parsedLines.findIndex(
      (line, y) =>
        parsedLines[y + 1] === undefined ||
        (y > firstYOfColumn &&
          line.firstX <= x &&
          x <= line.lastX &&
          (x < parsedLines[y + 1].firstX || x > parsedLines[y + 1].lastX))
    );

    parsedWarpingZones[getKey(x, firstYOfColumn - 1, Up)] = getStraightWarp(
      x,
      firstYOfColumn - 1,
      x,
      lastYOfColumn,
      Up,
      parsedWarpingZones
    );

    parsedWarpingZones[getKey(x, lastYOfColumn + 1, Down)] = getStraightWarp(
      x,
      lastYOfColumn + 1,
      x,
      firstYOfColumn,
      Down,
      parsedWarpingZones
    );
  }

  return parsedWarpingZones;
};

const parseCubeWarpingZones1 = (
  parsedLines: Board["lines"]
): Board["warpingZones"] => {
  const parsedWarpingZones: Board["warpingZones"] = {};

  const maxX = Math.max(...parsedLines.map((line) => line.lastX));
  const cubeXBreakpoints = Array(5)
    .fill(0)
    .map((_, i) => (i * (maxX + 1)) / 4);

  const cubeYBreakpoints = Array(4)
    .fill(0)
    .map((_, i) => (i * parsedLines.length) / 3);

  for (let y = cubeYBreakpoints[0]; y < cubeYBreakpoints[1]; y++) {
    const [fromXL, fromYL] = [cubeXBreakpoints[2], y];
    const [toXL, toYL] = [cubeXBreakpoints[1] + y, cubeYBreakpoints[1]];
    addCubeWarps(fromXL, fromYL, toXL, toYL, Left, Down, parsedWarpingZones);

    const [fromXR, fromYR] = [cubeXBreakpoints[3] - 1, y];
    const [toXR, toYR] = [cubeXBreakpoints[4] - 1, cubeYBreakpoints[3] - y - 1];
    addCubeWarps(fromXR, fromYR, toXR, toYR, Right, Left, parsedWarpingZones);
  }

  for (let y = cubeYBreakpoints[1]; y < cubeYBreakpoints[2]; y++) {
    const [fromXL, fromYL] = [cubeXBreakpoints[0], y];
    const [toXL, toYL] = [
      cubeXBreakpoints[4] - 1 - (y - cubeYBreakpoints[1]),
      cubeYBreakpoints[3] - 1,
    ];
    addCubeWarps(fromXL, fromYL, toXL, toYL, Left, Up, parsedWarpingZones);

    const [fromXR, fromYR] = [cubeXBreakpoints[3] - 1, y];
    const [toXR, toYR] = [
      cubeXBreakpoints[4] - (y - cubeYBreakpoints[1] + 1),
      cubeYBreakpoints[2],
    ];
    addCubeWarps(fromXR, fromYR, toXR, toYR, Right, Down, parsedWarpingZones);
  }

  for (let y = cubeYBreakpoints[2]; y < cubeYBreakpoints[3]; y++) {
    const [fromXL, fromYL] = [cubeXBreakpoints[2], y];
    const [toXL, toYL] = [
      cubeXBreakpoints[2] - 1 - (y - cubeYBreakpoints[2]),
      cubeYBreakpoints[2] - 1,
    ];
    addCubeWarps(fromXL, fromYL, toXL, toYL, Left, Up, parsedWarpingZones);
  }

  for (let x = cubeXBreakpoints[2]; x < cubeXBreakpoints[3]; x++) {
    const [fromXL, fromYL] = [x, 0];
    const [toXL, toYL] = [
      cubeXBreakpoints[1] - 1 - (x - cubeXBreakpoints[2]),
      cubeYBreakpoints[1],
    ];
    addCubeWarps(fromXL, fromYL, toXL, toYL, Up, Down, parsedWarpingZones);

    const [fromXR, fromYR] = [x, cubeYBreakpoints[3] - 1];
    const [toXR, toYR] = [
      cubeXBreakpoints[1] - 1 - (x - cubeXBreakpoints[2]),
      cubeYBreakpoints[2] - 1,
    ];
    addCubeWarps(fromXR, fromYR, toXR, toYR, Down, Up, parsedWarpingZones);
  }

  return parsedWarpingZones;
};

const parseCubeWarpingZones2 = (
  parsedLines: Board["lines"]
): Board["warpingZones"] => {
  const parsedWarpingZones: Board["warpingZones"] = {};

  const maxX = Math.max(...parsedLines.map((line) => line.lastX));
  const cubeXBreakpoints = Array(4)
    .fill(0)
    .map((_, i) => (i * (maxX + 1)) / 3);

  const cubeYBreakpoints = Array(5)
    .fill(0)
    .map((_, i) => (i * parsedLines.length) / 4);

  for (let y = cubeYBreakpoints[0]; y < cubeYBreakpoints[1]; y++) {
    const [fromXL, fromYL] = [cubeXBreakpoints[1], y];
    const [toXL, toYL] = [
      cubeXBreakpoints[0],
      cubeYBreakpoints[3] - 1 - (y - cubeYBreakpoints[0]),
    ];
    addCubeWarps(fromXL, fromYL, toXL, toYL, Left, Right, parsedWarpingZones);
  }

  for (let y = cubeYBreakpoints[1]; y < cubeYBreakpoints[2]; y++) {
    const [fromXL, fromYL] = [cubeXBreakpoints[1], y];
    const [toXL, toYL] = [
      cubeXBreakpoints[0] + y - cubeXBreakpoints[1],
      cubeYBreakpoints[2],
    ];
    addCubeWarps(fromXL, fromYL, toXL, toYL, Left, Down, parsedWarpingZones);

    const [fromXR, fromYR] = [cubeXBreakpoints[2] - 1, y];
    const [toXR, toYR] = [
      cubeXBreakpoints[2] + y - cubeXBreakpoints[1],
      cubeYBreakpoints[1] - 1,
    ];
    addCubeWarps(fromXR, fromYR, toXR, toYR, Right, Up, parsedWarpingZones);
  }

  for (let y = cubeYBreakpoints[2]; y < cubeYBreakpoints[3]; y++) {
    const [fromXL, fromYL] = [cubeXBreakpoints[2] - 1, y];
    const [toXL, toYL] = [
      cubeXBreakpoints[3] - 1,
      cubeYBreakpoints[1] - 1 - (y - cubeYBreakpoints[2]),
    ];
    addCubeWarps(fromXL, fromYL, toXL, toYL, Right, Left, parsedWarpingZones);
  }

  for (let y = cubeYBreakpoints[3]; y < cubeYBreakpoints[4]; y++) {
    const [fromXL, fromYL] = [cubeXBreakpoints[0], y];
    const [toXL, toYL] = [
      cubeXBreakpoints[1] + y - cubeXBreakpoints[3],
      cubeYBreakpoints[0],
    ];
    addCubeWarps(fromXL, fromYL, toXL, toYL, Left, Down, parsedWarpingZones);

    const [fromXR, fromYR] = [cubeXBreakpoints[1] - 1, y];
    const [toXR, toYR] = [
      cubeXBreakpoints[1] + y - cubeXBreakpoints[3],
      cubeYBreakpoints[3] - 1,
    ];
    addCubeWarps(fromXR, fromYR, toXR, toYR, Right, Up, parsedWarpingZones);
  }

  for (let x = cubeXBreakpoints[0]; x < cubeXBreakpoints[1]; x++) {
    const [fromXL, fromYL] = [x, cubeYBreakpoints[4] - 1];
    const [toXL, toYL] = [cubeXBreakpoints[2] + x, cubeYBreakpoints[0]];
    addCubeWarps(fromXL, fromYL, toXL, toYL, Down, Down, parsedWarpingZones);
  }

  return parsedWarpingZones;
};

const getStraightWarp = (
  fromX: number,
  fromY: number,
  x: number,
  y: number,
  fromDirection: Direction,
  warpingZones: Board["warpingZones"]
): Board["warpingZones"]["string"] => ({
  d: fromDirection,
  x,
  y,
});

const addCubeWarps = (
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  fromDirection: Direction,
  toDirection: Direction,
  warpingZones: Board["warpingZones"]
): void => {
  const k1 = getKey(
    fromX + getChangeX(fromDirection),
    fromY + getChangeY(fromDirection),
    fromDirection
  );

  warpingZones[k1] = {
    d: toDirection,
    x: toX,
    y: toY,
  };

  const k2 = getKey(
    toX + getChangeX(getInverse(toDirection)),
    toY + getChangeY(getInverse(toDirection)),
    getInverse(toDirection)
  );

  warpingZones[k2] = {
    d: getInverse(fromDirection),
    x: fromX,
    y: fromY,
  };
};

export const getKey = (x: number, y: number, direction: Direction): string =>
  `${y + 1}:${x + 1}:${getDirName(direction)}`;

export const getBlockedKey = (x: number, y: number): string =>
  `${y + 1}:${x + 1}`;
