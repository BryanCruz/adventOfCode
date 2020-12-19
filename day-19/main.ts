import { readFileSync } from "fs";

export {};

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

type rules = { [k: string]: string | string[][] };

const parseInput = (vs: string[]) => {
  const emptyLineIndex = vs.findIndex((v) => v === "");
  const rules = vs.slice(0, emptyLineIndex);
  const messages = vs.slice(emptyLineIndex + 1);

  return {
    rules: rules
      .map(parseRule)
      .reduce((obj, rule) => ({ ...obj, ...rule }), {}) as rules,
    messages,
  };
};

const decodeMessage = (rules: rules, origMessage: string) => {
  let message = origMessage.split("");
  while (true) {
    const match = message.findIndex((v) => v.match(/[a-z]/));
    if (match === -1) {
      break;
    }

    message[match] = Object.keys(rules).find(
      (key) => rules[key] === message[match]
    );
  }

  return message;
};

const match = (a: string[], b: string[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

const solve = (targetRule: string[], message: string[]) => {
  // console.log("target:", targetRule.join(","));
  // console.log("message:", message.join(","));
  // console.log("=====");
  if (matchRules.has(message.join(","))) {
    return matchRules.get(message.join(","));
  }

  if (match(targetRule, message)) {
    matchRules.set(message.join(","), true);
    return true;
  }

  if (message.length <= 1 || targetRule.length <= 1) {
    matchRules.set(message.join(","), false);
    return false;
  }

  // override first 1
  if (
    solve(targetRule.slice(0, 1), message.slice(0, 1)) &&
    solve(targetRule.slice(1), message.slice(1))
  ) {
    matchRules.set(message.join(","), true);
    return true;
  }

  // override first 2
  for (let i = 0; i < message.length - 2; i++) {
    const options = Object.keys(globalRules).filter(
      (key) =>
        typeof globalRules[key] !== "string" &&
        (globalRules[key] as string[][]).some((v) =>
          match(v, message.slice(i, i + 2))
        )
    );

    // console.log("options to", message.slice(i, i + 2), options);

    if (
      options.some((key) =>
        solve(
          targetRule,
          message
            .slice(0, i)
            .concat([key])
            .concat(message.slice(i + 2))
        )
      )
    ) {
      matchRules.set(message.join(","), true);
      return true;
    }
  }

  matchRules.set(message.join(","), false);
  return false;
};

let globalRules: rules = null;
let matchRules: Map<string, boolean> = null;
const main = (vs: string[]): number => {
  const { messages, rules } = parseInput(vs);
  globalRules = rules;
  matchRules = new Map();

  return messages.filter((message, i) => {
    const decodedMessage = decodeMessage(rules, message);
    console.log("index", i);
    return solve(rules["0"][0] as string[], decodedMessage);
  }).length;
};

const main2 = (vs: string[]) => {};

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
