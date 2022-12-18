import { readFileSync } from "fs";

export {};

type Wind = "<" | ">";

const WIDTH = 7;
const LEFT_OFFSET = 2;
const DOWN_OFFSET = 3;

const rocks = [
  ["####"],
  [".#.", "###", ".#."],
  ["..#", "..#", "###"],
  ["#", "#", "#", "#"],
  ["##", "##"],
];

const main = (vs: string[], steps = 2022) => {
  const windPattern = vs[0].split("");

  let highestYByX = Array(WIDTH).fill(0) as number[];

  let highestY = 0;
  let lowestY = 0;
  const filled = new Set<string>(highestYByX.map((v, i) => pointToStr([i, v])));

  const knownPatterns: { [key: string]: number } = {};
  const knownPatternsIndexed: { [key: number]: [string, number[]] } = {};

  for (let rockIndex = 0, windIndex = 0; rockIndex < steps; rockIndex++) {
    const rock = rocks[rockIndex % rocks.length];
    const rockWidth = rock[0].length;

    let rockX = LEFT_OFFSET;
    let rockY = highestY + DOWN_OFFSET + 1;

    let newHighestYByX = [...highestYByX];
    while (true) {
      const wind = windPattern[windIndex++ % windPattern.length] as Wind;
      const xChange = wind === "<" ? -1 : 1;

      const isAllowedRight =
        xChange > 0 &&
        rockX + rockWidth + xChange - 1 < WIDTH &&
        !hasCollisionInDirection("right", rock, rockX, rockY, filled);

      const isAllowedLeft =
        xChange < 0 &&
        rockX + xChange >= 0 &&
        !hasCollisionInDirection("left", rock, rockX, rockY, filled);

      if (isAllowedRight || isAllowedLeft) {
        rockX += xChange;
      }

      const isAllowedDown = !hasCollisionInDirection(
        "down",
        rock,
        rockX,
        rockY,
        filled
      );

      if (isAllowedDown) {
        rockY--;
      } else {
        highestY = Math.max(highestY, rockY + rock.length - 1);
        rock.forEach((rockLine, y) => {
          const rockLineY = rockY + rock.length - y - 1;
          const rockPieces = rockLine.split("");
          rockPieces.forEach((piece, x) => {
            if (piece === ".") {
              return;
            }

            const rockPieceX = rockX + x;
            newHighestYByX[rockPieceX] = Math.max(
              newHighestYByX[rockPieceX],
              rockLineY
            );

            filled.add(pointToStr([rockPieceX, rockLineY]));
          });
        });
        lowestY = Math.min(...newHighestYByX);
        break;
      }
    }

    const pattern = newHighestYByX
      .map((v) => v - lowestY)
      .map((v) => v.toString())
      .concat(`${rockIndex % rocks.length}`)
      .concat(`${windIndex % windPattern.length}`)
      .join("_");

    if (knownPatterns[pattern] !== undefined && knownPatterns[pattern] > 1) {
      const previousIndexes = Object.keys(knownPatternsIndexed).filter(
        (i) => knownPatternsIndexed[i][0] === pattern
      )!;

      const previousIndex = Number(previousIndexes[1]);

      const simulatedStepsBeforeLoop = previousIndex;

      const initialHeightBeforeLoopVs =
        knownPatternsIndexed[previousIndex - 1][1];
      const heightBeforeLoopAgainVs = knownPatternsIndexed[rockIndex - 1][1];
      const loopHeightVs = heightBeforeLoopAgainVs.map(
        (heightBeforeLoopAgain, i) =>
          heightBeforeLoopAgain - initialHeightBeforeLoopVs[i]
      );

      const stepsToCalculate = steps - simulatedStepsBeforeLoop;
      const stepsByLoop = rockIndex - previousIndex;
      const loops = Math.floor(stepsToCalculate / stepsByLoop);
      const loopsHeightVs = loopHeightVs.map(
        (loopHeight) => loops * loopHeight
      );

      const stepsAfterLoop = stepsToCalculate - stepsByLoop * loops;
      const afterLoopHeightVs = knownPatternsIndexed[
        previousIndex + stepsAfterLoop
      ][1].map(
        (afterLoop, i) => afterLoop - knownPatternsIndexed[previousIndex][1][i]
      );

      return (
        Math.max(
          ...initialHeightBeforeLoopVs.map(
            (beforeLoop, i) =>
              beforeLoop + loopsHeightVs[i] + afterLoopHeightVs[i]
          )
        ) - 1
      );
    } else {
      knownPatterns[pattern] = (knownPatterns[pattern] || 0) + 1;
      knownPatternsIndexed[rockIndex] = [pattern, newHighestYByX];
    }
    highestYByX = newHighestYByX;
  }

  return highestY;
};

const main2 = (vs: string[]) => main(vs, 1000000000000);

const hasCollisionInDirection = (
  direction: "left" | "down" | "right",
  rock: typeof rocks[number],
  rockX: number,
  rockY: number,
  borders: Set<string>
): boolean => {
  return rock
    .map((rockLine, y) => {
      const rockLineY = rockY + rock.length - y - 1;
      const rockPieces = rockLine.split("");
      const hasCollision = rockPieces
        .map((piece, x) => {
          if (piece === ".") {
            return false;
          }

          const rockPieceX = rockX + x;
          return borders.has(
            pointToStr([
              rockPieceX +
                (direction === "left" ? -1 : direction === "right" ? 1 : 0),
              rockLineY + (direction === "down" ? -1 : 0),
            ])
          );
        })
        .some((collision) => collision);
      return hasCollision;
    })
    .some((collision) => collision);
};

const pointToStr = ([a, b]: [number, number]) => `${a}:${b}`;

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
