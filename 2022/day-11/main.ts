import { readFileSync } from "fs";
import { parseInput } from "./parse";
import { Context, Monkey } from "./types";

export {};

const main = (vs: string[], numberOfRounds = 20, toRelief = true) => {
  const monkeys = parseInput(vs, toRelief);

  const rounds: number[] = Array(numberOfRounds)
    .fill(0)
    .map((_, i) => i);

  const context: Context = {
    counter: Array(monkeys.length)
      .fill(0)
      .map((_) => 0),
  };
  rounds.forEach((i) => {
    executeRound(monkeys, context, toRelief);
  });

  const topTwo = context.counter
    .sort((a, b) => (b - a < 0 ? -1 : 1))
    .slice(0, 2);
  return topTwo.reduce((old, curr) => old * curr, 1);
};

const main2 = (vs: string[]) => main(vs, 10000, false);

const executeRound = (
  monkeys: Monkey[],
  context: Context,
  toRelief: boolean
): void => {
  monkeys.forEach((_, i) => {
    executeTurn(i, monkeys, toRelief, context);
  });
};

const executeTurn = (
  monkeyIndex: number,
  monkeys: Monkey[],
  toRelief: boolean,
  { counter }: Context
): void => {
  const monkey = monkeys[monkeyIndex];
  const { itemsByMonkeyTracker } = monkey;

  monkey.itemsIndexes.forEach((itemIndex) => {
    itemsByMonkeyTracker.forEach((monkeyTracker, trackerIndex) => {
      const levelFn = toRelief
        ? monkey.operation
        : (value: number) =>
            monkey.operation(value, monkeys[trackerIndex].modX);

      const newWorryLevel = [levelFn, monkey.relief].reduce(
        (resultWorryLevel, fn) => fn(resultWorryLevel),
        monkeyTracker[itemIndex]
      );

      monkeyTracker[itemIndex] = newWorryLevel;
    });

    const newWorryLevel = itemsByMonkeyTracker[monkeyIndex][itemIndex];
    const monkeyToThrowTo = monkey.throwTo(monkey.test(newWorryLevel));
    monkeys[monkeyToThrowTo].itemsIndexes.push(itemIndex);
  });

  counter[monkeyIndex] += monkey.itemsIndexes.length;
  monkey.itemsIndexes = [];
};

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
