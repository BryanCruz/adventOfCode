import { readFileSync } from "fs";
import { allowedNodeEnvironmentFlags } from "process";
import {
  Coordinate,
  coordinateAsString,
  directions,
  flatten,
  getDirectionToCoordinateChange,
  range,
  scaleCoordinate,
  sumCoordinates,
} from "../../common";
import { getMdc } from "./math";
import { parseInput } from "./parse";
import { Input } from "./types";

export {};

type StormHelper = {
  [key: number]: Set<string>;
};

const main = (vs: string[]) => {
  const input = parseInput(vs);
  const availablePerMinute = getAvailableCoordinatesPerMinute(input);

  const { finish } = input;
  const actualStart = [-1, 0] as Coordinate;
  const actualFinish = [finish[0] + 1, finish[1]] as Coordinate;
  return bfs(actualStart, finish, availablePerMinute, actualFinish);
};

const main2 = (vs: string[]) => {
  const input = parseInput(vs);
  const availablePerMinute = getAvailableCoordinatesPerMinute(input);

  const { finish } = input;
  const actualStart = [-1, 0] as Coordinate;
  const actualFinish = [finish[0] + 1, finish[1]] as Coordinate;

  const goToEnd = bfs(actualStart, finish, availablePerMinute, actualFinish);

  const goBackToTheBeginning = bfs(
    actualFinish,
    finish,
    availablePerMinute,
    actualStart,
    goToEnd
  );

  const goToEndAgain = bfs(
    actualStart,
    finish,
    availablePerMinute,
    actualFinish,
    goBackToTheBeginning
  );

  return goToEndAgain;
};

const bfs = (
  start: Coordinate,
  finish: Coordinate,
  availablePerMinute: StormHelper,
  target: Coordinate,
  offset = 0
) => {
  const statesNumber = getMdc(finish[0] + 1, finish[1] + 1);

  const getVisitedKey = (c: Coordinate, minute: number) =>
    coordinateAsString(c)
      .concat("_")
      .concat((minute % statesNumber).toString());

  const searchQueue: { coordinate: Coordinate; minute: number }[] = [
    { coordinate: start, minute: offset },
  ];

  const alreadyVisited = new Set<string>();
  alreadyVisited.add(
    getVisitedKey(searchQueue[0].coordinate, searchQueue[0].minute)
  );

  while (true) {
    const { coordinate, minute } = searchQueue.shift()!;

    if (coordinateAsString(coordinate) === coordinateAsString(target)) {
      return minute;
    }

    const neighbours = directions
      .map((d) => getDirectionToCoordinateChange(d))
      .concat([[0, 0]]);

    const validNeighbours = neighbours
      .map((s) => sumCoordinates(coordinate, s))
      .filter(
        ([a, b]) =>
          (a === -1 && b === 0) ||
          (a === finish[0] + 1 && b === finish[1]) ||
          (a >= 0 && a <= finish[0] && b >= 0 && b <= finish[1])
      );

    const availableNeighboursInMinute = validNeighbours
      .map((c) => ({ coordinate: c, minute: minute + 1 }))
      .filter(({ coordinate, minute }) =>
        availablePerMinute[minute % statesNumber].has(
          coordinateAsString(coordinate)
        )
      );

    const availableNeighbours = availableNeighboursInMinute
      .filter(
        ({ coordinate, minute }) =>
          !alreadyVisited.has(getVisitedKey(coordinate, minute))
      )
      .map(({ coordinate, minute }) => {
        alreadyVisited.add(getVisitedKey(coordinate, minute));
        return { coordinate, minute };
      });

    searchQueue.push(...availableNeighbours);
  }
};

const getAvailableCoordinatesPerMinute = ({ start, finish, storms }: Input) => {
  const allCoordinates = flatten(
    range(start[0], finish[0]).map((i) =>
      range(start[1], finish[1]).map((j) => [i, j] as Coordinate)
    )
  )
    .concat([[-1, 0]])
    .concat([[finish[0] + 1, finish[1]]])
    .map(coordinateAsString);

  const availablePerMinute: StormHelper = {};

  const mdc = getMdc(finish[0] + 1, finish[1] + 1);

  range(0, mdc - 1).forEach((minute) => {
    const available = new Set(allCoordinates);

    storms.forEach(({ coordinate, type }) => {
      const changeInStormCoordinate = scaleCoordinate(
        getDirectionToCoordinateChange(type),
        minute
      );
      const stormCoordinateInMinute = sumCoordinates(
        coordinate,
        changeInStormCoordinate
      );
      [0, 1].forEach((i) => {
        if (stormCoordinateInMinute[i] < 0) {
          stormCoordinateInMinute[i] += 2 * mdc * (finish[i] + 1);
        }
        stormCoordinateInMinute[i] %= finish[i] + 1;

        if (stormCoordinateInMinute[i] < 0) {
          throw Error("");
        }
      });
      available.delete(coordinateAsString(stormCoordinateInMinute));
    });

    availablePerMinute[minute] = available;
  });

  return availablePerMinute;
};

const [vt0, vt, v] = [
  "inputT0.txt",
  "inputT.txt",
  "input.txt",
].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split(/\r?\n/)
);

console.log("First Half");
console.log("test0", main(vt0));
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
