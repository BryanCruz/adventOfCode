import { Monkey, Operation } from "./types";

export const parseInput = (lines: string[]): Monkey[] => lines.map(parseMonkey);

const parseMonkey = (line: string): Monkey => {
  const operationRegex = /(\w+): (\w+) ([+*-/]) (\w+)/;
  const yellRegex = /(\w+): (\d+)/;

  if (operationRegex.test(line)) {
    const [_, name, argA, operation, argB] = line.match(operationRegex)!;
    return {
      name,
      nameA: argA,
      nameB: argB,
      type: operation as Operation,
      resolved: false,
    };
  }

  const [_, name, arg] = line.match(yellRegex)!;
  return { name, type: "yell", value: Number(arg), resolved: true };
};
