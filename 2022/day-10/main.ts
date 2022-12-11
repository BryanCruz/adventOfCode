import { readFileSync } from "fs";

export {};

type CycleCount = 0 | 1 | 2;
type OperationAddX = { type: "addx"; value: number; cycleCount: CycleCount };
type OperationNoOp = {
  type: "noop";
  cycleCount: CycleCount;
};
type Operation = OperationNoOp | OperationAddX;

type ReduceContext = {
  totalSignalStrength: number;
  x: number;
  xSequence: number[];
  inProgressOperation: Operation | undefined;
  pendingOperations: Operation[];
};

const main = (vs: string[]) => {
  const { totalSignalStrength } = executeCycles(220, vs);
  return totalSignalStrength;
};

const main2 = (vs: string[]) => {
  const [rows, columns] = [6, 40];
  const [lit, dark] = ["#", "."];
  const { xSequence } = executeCycles(rows * columns, vs);

  const television = xSequence.reduce((television, spriteX, i) => {
    const drawingX = i % columns;

    const toDrawLit = Math.abs(drawingX - spriteX) <= 1;
    const toDrawNewLine = i % columns === 0;

    return television
      .concat(toDrawNewLine ? "\n" : "")
      .concat(toDrawLit ? lit : dark);
  }, "");

  return television;
};

const executeCycles = (
  numberOfCycles: number,
  operationsRaw: string[]
): ReduceContext => {
  const operations = getOperations(operationsRaw);
  const cycles: number[] = Array(numberOfCycles)
    .fill(0)
    .map((_, i) => i + 1);

  return cycles.reduce(
    (context, cycleNumber) => {
      context.xSequence.push(context.x);

      if (!context.inProgressOperation) {
        context.inProgressOperation = operations.shift();
      }

      const { inProgressOperation } = context;

      if (inProgressOperation) {
        inProgressOperation.cycleCount -= 1;
      }

      context.totalSignalStrength += getSignalStrength(cycleNumber, context.x);

      if (inProgressOperation && inProgressOperation.cycleCount === 0) {
        if (isAddXOperation(inProgressOperation)) {
          context.x += inProgressOperation.value;
        }

        context.inProgressOperation = undefined;
      }

      return context;
    },
    {
      totalSignalStrength: 0,
      x: 1,
      xSequence: [] as number[],
      pendingOperations: operations,
    } as ReduceContext
  );
};

const isAddXOperation = (operation: Operation): operation is OperationAddX =>
  operation.type === "addx";

const getOperations = (lines: string[]): Operation[] =>
  lines
    .map((line) => line.split(" "))
    .map(([type, arg]) =>
      type === "noop"
        ? {
            type,
            cycleCount: 1,
          }
        : { type: "addx", value: Number(arg), cycleCount: 2 }
    );

const getSignalStrength = (cycleNumber: number, x: number): number =>
  (cycleNumber - 20) % 40 !== 0 ? 0 : cycleNumber * x;

const [vt, vt1, v] = [
  "inputT.txt",
  "inputT1.txt",
  "input.txt",
].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split(/\r?\n/)
);

console.log("First Half");
console.log("test1", main(vt1));
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
