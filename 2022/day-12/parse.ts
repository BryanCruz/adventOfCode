import { Coordinate, Grid } from "../../common";

type ParseInputHelper = [Coordinate | undefined, Coordinate | undefined, Grid];
type ParseInputLineHelper = [
  Coordinate | undefined,
  Coordinate | undefined,
  number[]
];

export const parseInput = (lines: string[]): ParseInputHelper =>
  lines.reduce(
    ([start, finish, previousLines], line, currRow) => {
      const [newStart, newFinish, parsedLine] = parseLine(line, currRow);
      return [
        start ? start : newStart,
        finish ? finish : newFinish,
        previousLines.concat([parsedLine]),
      ];
    },
    [undefined, undefined, []] as ParseInputHelper
  );

const parseLine = (line: string, currRow: number): ParseInputLineHelper => {
  const startCharacter = "S";
  const finishCharacter = "E";
  const lowestCharacter = "a";
  const highestCharacter = "z";

  return line.split("").reduce(
    ([start, finish, parsedLine], character, currCol) => {
      const [isStart, isFinish] = [startCharacter, finishCharacter].map(
        (specialCharacter) => specialCharacter === character
      );

      const mappedNumber =
        (isStart
          ? lowestCharacter
          : isFinish
          ? highestCharacter
          : character
        ).charCodeAt(0) - lowestCharacter.charCodeAt(0);

      const newParsedLine = parsedLine.concat([mappedNumber]);

      const currCoordinate = [currRow, currCol] as [number, number];

      if (isStart) {
        return [currCoordinate, finish, newParsedLine];
      }

      if (isFinish) {
        return [start, currCoordinate, newParsedLine];
      }

      return [start, finish, newParsedLine];
    },
    [undefined, undefined, []] as ParseInputLineHelper
  );
};
