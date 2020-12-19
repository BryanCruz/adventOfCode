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

const graphFromRules = (rules: rules) => {
  const graph = new Map<string, string[]>();

  Object.keys(rules).forEach((key) => {
    const values = rules[key];
    if (typeof values === "string") {
      return;
    }

    values.forEach((out) => {
      graph.set(out.join(","), (graph.get(out.join(",")) || []).concat([key]));
    });
  });

  return graph;
};

const compute = (
  message: string[],
  graph: Map<string, string[]>,
  rules: rules,
  target: string[]
) => {
  let queue: Array<[string[], string[]]> = [[[...message], [...target]]];

  while (queue.length > 0) {
    console.log(queue.length);
    queue.sort((a, b) =>
      a[1].length - b[1].length < 0
        ? -1
        : a[1].length - b[1].length > 0
        ? 1
        : a[0].length - b[0].length
    );

    // console.log("\n");
    // console.log(queue);
    let [currMessage, currTarget] = queue.shift();

    if (currMessage.length === 0 && currTarget.length === 0) {
      return true;
    }

    if (currMessage.length === 0 || currTarget.length === 0) {
      continue;
    }

    const currRule = currTarget.pop();
    let currSub = currMessage.pop();

    if (currSub === currRule) {
      // console.log("push", [[...currMessage], [...currTarget]]);
      queue.unshift([[...currMessage], [...currTarget]]);
    }

    if (currMessage.length === 0) {
      continue;
    }

    const allMessage = currMessage.concat([currSub]);
    const allTarget = [...currTarget].concat([currRule]);

    for (let i = 0; i < allTarget.length; i++) {
      const currSub = allTarget[i];
      const possibleSubs = rules[currSub];

      if (typeof possibleSubs === "string") {
        continue;
      }

      possibleSubs.forEach((sub) => {
        // console.log("push", [
        //   allMessage
        //     .slice(0, i)
        //     .concat([sub])
        //     .concat(allMessage.slice(i + 2)),
        //   [...currTarget].concat([currRule]),
        // ]);
        queue.push([
          [...allMessage],
          allTarget
            .slice(0, i)
            .concat(sub)
            .concat(allTarget.slice(i + 1)),
        ]);
      });
    }

    for (let i = 0; i < allMessage.length - 2; i++) {
      const currSub = allMessage
        .slice(allMessage.length - i - 2, allMessage.length - i)
        .join(",");
      const possibleSubs = graph.get(currSub) || [];

      possibleSubs.forEach((sub) => {
        // console.log("push", [
        //   allMessage
        //     .slice(0, i)
        //     .concat([sub])
        //     .concat(allMessage.slice(i + 2)),
        //   [...currTarget].concat([currRule]),
        // ]);
        queue.push([
          allMessage
            .slice(0, allMessage.length - i - 2)
            .concat([sub])
            .concat(allMessage.slice(allMessage.length - i)),
          [...allTarget],
        ]);
      });
    }
  }

  return false;
};

let pd: Map<string, boolean>;
const main = (vs: string[]): number => {
  const { messages, rules } = parseInput(vs);
  const graph = graphFromRules(rules);
  pd = new Map();
  // console.log(messages[0]);
  let maxLength = -1;
  return (
    messages
      // .slice(0, 1)
      .filter((message, i) => {
        maxLength = Math.max(maxLength, message.length);
        console.log("messages left", messages.length - i);
        return compute(
          decodeMessage(rules, message),
          graph,
          rules,
          rules["0"][0] as string[]
        );
      }).length
  );
  return -1;
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
