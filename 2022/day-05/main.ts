import { readFileSync } from "fs";

export {};

interface Move {
  quantity: number;
  from: number;
  to: number;
}

type Queue = string[];

type InputParsed = [Queue[], Move[]];

const main = (vs: string[], moveOneAtATime: boolean = true) => {
  const [stacks, moves] = parseInput(vs);

  return executeMoves(stacks, moves, moveOneAtATime)
    .map((stack) => stack[stack.length - 1])
    .join("");
};

const main2 = (vs: string[]) => main(vs, false);

const [vt, v] = ["inputT.txt", "input.txt"].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split(/\r?\n/)
);

const executeMoves = (
  stacks: Queue[],
  moves: Move[],
  moveOneAtATime: boolean
): Queue[] => {
  const executeMove = moveOneAtATime
    ? executeMoveOneAtAtime
    : executeMoveAllAtOnce;

  moves.forEach((move) => executeMove(stacks, move));
  return stacks;
};

const executeMoveOneAtAtime = (stacks: Queue[], { quantity, to, from }: Move) =>
  Array(quantity)
    .fill(0)
    .forEach((_) => {
      stacks[to].push(stacks[from].pop()!);
    });

const executeMoveAllAtOnce = (stacks: Queue[], { quantity, to, from }: Move) =>
  (stacks[to] = stacks[to].concat(
    stacks[from].splice(stacks[from].length - quantity)
  ));

const parseInput = (lines: string[]): InputParsed => {
  const firstHalfIndex = lines.findIndex((line) => line === "");
  const firstHalfLines = lines.slice(0, firstHalfIndex - 1);
  const secondHalfLines = lines.slice(firstHalfIndex + 1);

  return [parseInputStacks(firstHalfLines), parseInputMoves(secondHalfLines)];
};

const parseInputStacks = (lines: string[]): Queue[] => {
  lines.reverse();
  const numberOfStacks = (lines[0].length + 1) / 4;
  const lineRegex = /(   |\[[A-Z]\]) /g;
  const initialStacks: Queue[] = Array(numberOfStacks)
    .fill(0)
    .map((_) => []);

  return lines.reduce((stacks, line) => {
    const crates: string[] = line.concat(" ").match(lineRegex) as any;

    return stacks.map((stack, i) => {
      const crate = crates[i][1];
      return crate !== " " ? stack.concat(crate) : stack;
    });
  }, initialStacks);
};

const parseInputMoves = (lines: string[]): Move[] => {
  const lineRegex = /move (\d+) from (\d) to (\d)/;
  return lines.map((line) => {
    const [_, quantity, from, to]: string[] = line.match(lineRegex) as any;
    return {
      quantity: Number(quantity),
      from: Number(from) - 1,
      to: Number(to) - 1,
    };
  });
};

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
