import { readFileSync } from "fs";

export {};

type Coordinate = [number, number];

const directions = ["R", "D", "U", "L"] as const;
type HorizontalOrVerticalDirection = typeof directions[number];
type DiagonalDirection = [
  HorizontalOrVerticalDirection,
  HorizontalOrVerticalDirection
];
type DirectionChange = [HorizontalOrVerticalDirection] | DiagonalDirection;

type Visited = {
  [key: string]: boolean;
};

const main = (vs: string[], n = 1) => {
  const moves = getMoves(vs);

  const [visited] = Array(n)
    .fill(0)
    .reduce(([_, nextMoves], _2) => evaluateMoves(nextMoves), [{}, moves] as [
      Visited,
      DirectionChange[]
    ]);

  return Object.keys(visited).length;
};

const main2 = (vs: string[]) => main(vs, 9);

const getMoves = (vs: String[]): DirectionChange[] =>
  flatten(
    vs
      .map((line) => line.split(" "))
      .map(([direction, amount]) => Array(Number(amount)).fill([direction]))
  );

const evaluateMoves = (
  moves: DirectionChange[]
): [Visited, DirectionChange[]] => {
  const tailPositions: Coordinate[] = [[0, 0]];
  const [visited, tailDirections] = moves.reduce(
    ([visited, tailDirections, tailPosition, headPosition], direction) => {
      visited[getKey(tailPosition)] = true;
      const newHeadPosition = applyDirectionChange(headPosition, direction);

      const directionToBeClose = getDirectionToBeClose(
        tailPosition,
        newHeadPosition
      );
      if (directionToBeClose !== null) {
        const newTailPosition = applyDirectionChange(
          tailPosition,
          directionToBeClose
        );
        tailDirections.push(directionToBeClose);
        visited[getKey(newTailPosition)] = true;
        tailPositions.push(newTailPosition);
        return [visited, tailDirections, newTailPosition, newHeadPosition];
      }

      return [visited, tailDirections, tailPosition, newHeadPosition];
    },
    [{ [getKey([0, 0])]: true }, [], [0, 0], [0, 0]] as [
      Visited,
      DirectionChange[],
      Coordinate,
      Coordinate
    ]
  );

  return [visited, tailDirections];
};

const getKey = ([row, line]: Coordinate): string => `${row}:${line}`;

// hackish solution to avoid writing a bfs for 2 steps :P
const getDirectionToBeClose = (
  [tailRow, tailColumn]: Coordinate,
  [headRow, headColumn]: Coordinate
): DirectionChange | null => {
  const horizontalDistance = headRow - tailRow;
  const verticalDistance = headColumn - tailColumn;

  if (Math.max(Math.abs(horizontalDistance), Math.abs(verticalDistance)) <= 1) {
    return null;
  }

  if (horizontalDistance == 0 || verticalDistance == 0) {
    return [
      findDirectionChange([tailRow, tailColumn], [headRow, headColumn])[0],
    ];
  }

  let [finalRow, finalColumn] = [headRow, headColumn];

  if (Math.abs(horizontalDistance) == 2) {
    finalRow = headRow - horizontalDistance / Math.abs(horizontalDistance);
  }

  if (Math.abs(verticalDistance) == 2) {
    finalColumn = headColumn - verticalDistance / Math.abs(verticalDistance);
  }

  return findDirectionChange([tailRow, tailColumn], [finalRow, finalColumn]);
};

const directionToCoordinateChange: {
  [key in HorizontalOrVerticalDirection]: Coordinate;
} = {
  R: [0, 1],
  L: [0, -1],
  D: [1, 0],
  U: [-1, 0],
};

const findDirectionChange = (
  initialCoordinate: Coordinate,
  finalCoordinate: Coordinate
): DirectionChange => {
  const directionsCombinations: DirectionChange[] = directions
    .map((direction) => [direction] as DirectionChange)
    .concat(
      flatten(
        directions.map((direction1) =>
          directions.map((direction2) => [direction1, direction2])
        )
      )
    );

  const result = directionsCombinations.find(
    (combination) =>
      getKey(finalCoordinate) ===
      getKey(applyDirectionChange(initialCoordinate, combination))
  )!;

  return directionsCombinations.find(
    (combination) =>
      getKey(finalCoordinate) ===
      getKey(applyDirectionChange(initialCoordinate, combination))
  )!;
};

const applyDirectionChange = (
  initialCoordinate: Coordinate,
  directionCombination: DirectionChange
): Coordinate =>
  directionCombination.reduce(([row, column], direction) => {
    const [changeInRow, changeInColumn] = directionToCoordinateChange[
      direction
    ];
    return [row + changeInRow, column + changeInColumn];
  }, initialCoordinate);

const flatten = <T>(collection: T[][]): T[] =>
  collection.reduce((flattened, curr) => [...flattened, ...curr]);

const [vt, vt2, v] = [
  "inputT.txt",
  "inputT2.txt",
  "input.txt",
].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split(/\r?\n/)
);

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("test2", main2(vt2));
console.log("final", main2(v));
