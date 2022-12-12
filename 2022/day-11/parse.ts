import { Monkey } from "./types";
import { chunkify } from "./util";

export const parseInput = (lines: string[], toRelief: boolean): Monkey[] => {
  const linesChunks = chunkify(lines, 7);
  const allItems = [] as number[];
  const itemsByMonkeyTracker = linesChunks.map((_) => []) as number[][];

  const monkeys = linesChunks.map((monkeyDefinition) => {
    const divisibleByLine = monkeyDefinition[3];
    const items = getItems(monkeyDefinition[1]);
    const monkey: Monkey = {
      itemsIndexes: items.map((_, i) => i + allItems.length),
      itemsByMonkeyTracker,
      allItems,
      modX: getDivisibleBy(divisibleByLine),
      operation: getOperation(monkeyDefinition[2]),
      test: getTest(divisibleByLine),
      throwTo: getThrowTo(monkeyDefinition[4], monkeyDefinition[5]),
      relief: getRelief(toRelief),
    };

    allItems.push(...items);

    return monkey;
  });

  monkeys.forEach((_, monkeyIndex) => {
    allItems.forEach((item, itemIndex) => {
      itemsByMonkeyTracker[monkeyIndex][itemIndex] = item;
    });
  });

  return monkeys;
};

const getItems = (line: string): number[] => {
  const [_, items] = line.split(":");
  return items.split(",").map((item) => Number(item));
};

const getOperation = (line: string): Monkey["operation"] => {
  const [_, operationDefinition] = line.split(" = ");
  const [firstArg, operatorArg, secondArg] = operationDefinition.split(" ");

  const getOperationFn = (operator: string) => (
    old: number,
    forModX?: number
  ) => {
    const [firstValue, secondValue] = [firstArg, secondArg]
      .map((arg) => (arg === "old" ? old : Number(arg)))
      .map((value) => (forModX ? value % forModX : value));

    const result =
      operator === "*" ? firstValue * secondValue : firstValue + secondValue;

    return forModX ? result % forModX : result;
  };

  return getOperationFn(operatorArg);
};

const getTest = (line: string): Monkey["test"] => (value) =>
  value % getDivisibleBy(line) === 0;

const getDivisibleBy = (line: string): number => {
  const [_, divisibleBy] = line.split(" by ");
  return Number(divisibleBy);
};

const getThrowTo = (lineTrue: string, lineFalse: string): Monkey["throwTo"] => {
  const [monkeyTrue, monkeyFalse] = [lineTrue, lineFalse].map((line) => {
    const [_, monkey] = line.split(" monkey ");
    return Number(monkey);
  });

  return (testResult) => (testResult ? monkeyTrue : monkeyFalse);
};

const getRelief = (toRelief: boolean): Monkey["relief"] => (value) =>
  toRelief ? Math.floor(value / 3) : value;
