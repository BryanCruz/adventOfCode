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
): { rules: ruleType[]; tickets: number[][]; yourTicket: number[] } => {
  let rules = [];
  let i = 0;
  for (i = 0; vs[i] !== ""; i++) {
    rules.push(parseRule(vs[i]));
  }

  const yourTicket = vs[i + 2].split(",").map((n) => Number(n));

  const tickets = vs
    .slice(i + 5)
    .map((row) => row.split(",").map((n) => Number(n)));

  return { rules, tickets, yourTicket };
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

const main2 = (vs: string[]) => {
  const data = parseInput(vs);
  const tickets = [data.yourTicket].concat(
    data.tickets.filter(
      (ticket) => getInvalidRules(ticket, data.rules).length === 0
    )
  );

  const rules = new Map<string, [number, number][]>();
  data.rules.forEach((rule) => {
    rules.set(rule.name, rule.ranges);
  });

  // create a map to track possible rules for each field
  const possibleRules = tickets[0].map((_value) => new Set<string>());
  possibleRules.forEach((possibleRulesForValue) => {
    rules.forEach((_value, key) => {
      possibleRulesForValue.add(key);
    });
  });

  // filter possible rules for each ticket
  tickets.forEach((ticket) => {
    ticket.forEach((value, j) => {
      rules.forEach((ruleRanges, ruleName) => {
        if (
          !ruleRanges.some((range) => range[0] <= value && value <= range[1])
        ) {
          possibleRules[j].delete(ruleName);
        }
      });
    });
  });

  // identify right order of rules
  const possibleRulesOrdered = possibleRules.map((possibleRuleSet, i) => {
    const rules: string[] = [];
    possibleRuleSet.forEach((rule) => {
      rules.push(rule);
    });

    return [rules, i] as [string[], number];
  });
  possibleRulesOrdered.sort((a, b) => a[0].length - b[0].length);

  const rightRules = new Map<string, number>();
  possibleRulesOrdered.forEach(([possibleRules, i]) => {
    possibleRules.forEach((possibleRule) => {
      if (!rightRules.has(possibleRule)) {
        rightRules.set(possibleRule, i);
      }
    });
  });

  // find the result
  const departureFields: number[] = [];
  rightRules.forEach((index, ruleName) => {
    if (ruleName.match(/^departure.*/)) {
      departureFields.push(index);
    }
  });

  return departureFields.reduce(
    (pv, currField) => pv * data.yourTicket[currField],
    1
  );
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
