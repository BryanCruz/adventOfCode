import { readFileSync } from "fs";

export {};

type rulesType = { [k: string]: string | string[][] };

const parseRule = (rule: string) => {
  const [_, index, rest] = rule.match(/(\d+): (.*)$/);
  const assertion = rest.trim();

  if (assertion.match(/"[ab]"/)) {
    return {
      [index]: assertion[1],
    };
  }

  return {
    [index]: assertion.split("|").map((v) => v.trim().split(" ")),
  };
};

const parseInput = (vs: string[]) => {
  const emptyLineIndex = vs.findIndex((v) => v === "");
  const rules = vs.slice(0, emptyLineIndex);
  const messages = vs.slice(emptyLineIndex + 1);

  return {
    rules: rules
      .map(parseRule)
      .reduce((obj, rule) => ({ ...obj, ...rule }), {}) as rulesType,
    messages,
  };
};

let rules: rulesType;
const compute = (messages: string[], rule: string): string[] => {
  const targetRule = rules[rule];
  if (typeof targetRule === "string") {
    return messages
      .filter((message) => message[0] === targetRule)
      .map((message) => message.slice(1));
  }

  const possibleRules = targetRule;
  return possibleRules
    .map((ruleSequence) =>
      ruleSequence.reduce(
        (remainingMessages, currRule) => compute(remainingMessages, currRule),
        messages
      )
    )
    .reduce(
      (allPossibleSolutions, thesePossibleSolutions) =>
        allPossibleSolutions.concat(thesePossibleSolutions),
      []
    );
};

const compute2 = (
  messages: string[],
  rule: string,
  recursionsLeft: number
): string[] => {
  const targetRule = rules[rule];
  if (typeof targetRule === "string") {
    return messages
      .filter((message) => message[0] === targetRule)
      .map((message) => message.slice(1));
  }

  const possibleRules = targetRule;
  return possibleRules
    .map((ruleSequence) =>
      rule !== "8" && rule !== "11"
        ? ruleSequence.reduce(
            (remainingMessages, currRule) =>
              compute2(remainingMessages, currRule, recursionsLeft),
            messages
          )
        : recursionsLeft > 0
        ? ruleSequence.reduce(
            (remainingMessages, currRule) =>
              compute2(remainingMessages, currRule, recursionsLeft - 1),
            messages
          )
        : []
    )
    .reduce(
      (allPossibleSolutions, thesePossibleSolutions) =>
        allPossibleSolutions.concat(thesePossibleSolutions),
      []
    );
};

const main = (vs: string[]): number => {
  const { messages, rules: miniRules } = parseInput(vs);
  rules = miniRules;

  return messages.filter((message) =>
    compute([message], "0").some((result) => result.length === 0)
  ).length;
};

const main2 = (vs: string[]) => {
  const { messages, rules: changedRules } = parseInput(
    vs.map((line) =>
      line === "8: 42"
        ? "8: 42 | 42 8"
        : line === "11: 42 31"
        ? "11: 42 31 | 42 11 31"
        : line
    )
  );
  rules = changedRules;

  let previousValue = -1;
  for (let i = 1; ; i++) {
    const currentValue = messages.filter((message) =>
      compute2([message], "0", 19).some((result) => result.length === 0)
    ).length;

    if (currentValue === previousValue) {
      return currentValue;
    }
    previousValue = currentValue;
  }
};

const [vt, vt2, v] = [
  "inputT.txt",
  "inputT2.txt",
  "input.txt",
].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split("\n")
);

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt2));
console.log("final", main2(v));
