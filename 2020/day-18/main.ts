import { readFileSync } from "fs";

export {};

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const operations = ["+", "*"];

const compute = (operation: string, a: number, b: number) =>
  operation === "+" ? a + b : a * b;

const parseExps = (vs: string[]): string[][] =>
  vs.map((exp) => exp.replace(/ +/g, "").split("") as string[]);

const findMatchingParenthesisIndex = (exp: string[]): number => {
  let extraLeftCount = 0;

  for (let i = 0; i < exp.length; i++) {
    const token = exp[i];

    if (token === "(") {
      extraLeftCount++;
    }

    if (token === ")") {
      if (extraLeftCount === 0) {
        return i;
      }

      extraLeftCount--;
    }
  }

  throw Error("could not find matching parenthesis");
};

const computeExp = (exp: string[]): number => {
  let queue = [...exp];
  let toCompute: [number, string?] = [0, "+"];

  while (queue.length) {
    const nextToken = queue.shift();
    if (numbers.includes(nextToken)) {
      if (!toCompute[1]) {
        throw Error("number not expected here");
      }

      toCompute = [compute(toCompute[1], toCompute[0], Number(nextToken))];
      continue;
    }

    if (operations.includes(nextToken)) {
      if (toCompute[1]) {
        throw Error("operation not expected here");
      }

      toCompute[1] = nextToken;
      continue;
    }

    if (nextToken === "(") {
      const lastParenthesisIndex = findMatchingParenthesisIndex(queue);
      const subExp = queue.slice(0, lastParenthesisIndex);

      let subExpResult = computeExp(subExp);
      toCompute = [compute(toCompute[1], toCompute[0], subExpResult)];

      queue = queue.slice(lastParenthesisIndex + 1);
      continue;
    }

    throw Error(`token not expected: ${nextToken}`);
  }

  return toCompute[0];
};

const computeExp2 = (exp: string[]): number => {
  let queue = [...exp];
  let toCompute: [number, string?] = [0, "+"];

  while (queue.length) {
    const nextToken = queue.shift();
    if (numbers.includes(nextToken)) {
      if (!toCompute[1]) {
        throw Error("number not expected here");
      }

      toCompute = [compute(toCompute[1], toCompute[0], Number(nextToken))];
      continue;
    }

    if (operations.includes(nextToken)) {
      if (toCompute[1]) {
        throw Error("operation not expected here");
      }

      toCompute[1] = nextToken;

      if (toCompute[1] === "*") {
        const remainingExpResult = computeExp2(queue);
        return compute(toCompute[1], toCompute[0], remainingExpResult);
      }

      continue;
    }

    if (nextToken === "(") {
      const lastParenthesisIndex = findMatchingParenthesisIndex(queue);
      const subExp = queue.slice(0, lastParenthesisIndex);

      let subExpResult = computeExp2(subExp);
      toCompute = [compute(toCompute[1], toCompute[0], subExpResult)];

      queue = queue.slice(lastParenthesisIndex + 1);
      continue;
    }

    throw Error(`token not expected: ${nextToken}`);
  }

  return toCompute[0];
};

const main = (origVs: string[]) => {
  const vs = parseExps(origVs);
  const results = vs.map((exp) => {
    const r = computeExp(exp);
    return r;
  });
  return results.reduce((s, r) => s + r);
};

const main2 = (origVs: string[]) => {
  const vs = parseExps(origVs);
  const results = vs.map((exp) => {
    const r = computeExp2(exp);
    `${exp.join("")} = ${r}`;
    return r;
  });
  return results.reduce((s, r) => s + r);
};

const [vt, v] = ["inputT.txt", "input.txt"].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split("\n")
);

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
