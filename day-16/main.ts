import { readFileSync } from "fs";

export {};

type ruleType = {
  name: string;
  ranges: [number, number][];
};

const parseRule = (v: string): ruleType => {
  return {
    name: v.split(": ")[0],
    ranges: v
      .split(": ")[1]
      .split(" or ")
      .map(
        (range) => range.split("-").map((n) => Number(n)) as [number, number]
      ),
  };
};

const parseInput = (
  vs: string[]
): { rules: ruleType[]; tickets: number[][] } => {
  let rules = [];
  let i = 0;
  for (i = 0; vs[i] !== ""; i++) {
    rules.push(parseRule(vs[i]));
  }

  for (i = i + 1; vs[i] !== ""; i++) {
    //ignore your ticket
  }

  const tickets = vs
    .slice(i + 2)
    .map((row) => row.split(",").map((n) => Number(n)));

  return { rules, tickets };
};

const validRule = (value: number, rules: ruleType[]) => {
  return rules.some((rule) =>
    rule.ranges.some((range) => range[0] <= value && value <= range[1])
  );
};

const getInvalidRules = (ticket: number[], rules: ruleType[]): number[] => {
  return ticket.filter((rule) => !validRule(rule, rules));
};

const main = (vs: string[]) => {
  const data = parseInput(vs);
  const invalidTicketsRules = data.tickets.map((ticket) =>
    getInvalidRules(ticket, data.rules)
  );

  return invalidTicketsRules.reduce(
    (ps, currTicket) =>
      ps + currTicket.reduce((ps_, currValue) => ps_ + currValue, 0),
    0
  );
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
