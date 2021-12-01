import { readFileSync } from "fs";

export {};

const MAX_VALUE = 1000000;

const parseInput = (vs: string[], part2?: boolean) => {
  const labels = vs[0].split("").map((v) => Number(v));

  let [head, tail] = labels.reduce(
    ([head, tail], v) => {
      const node = {
        value: v,
        next: null,
      };

      if (!head) {
        return [node, node];
      }

      tail.next = node;
      return [head, node];
    },
    [null, null]
  );

  if (part2) {
    for (let i = 10; i <= MAX_VALUE; i++) {
      const node = {
        value: i,
        next: null,
      };

      tail.next = node;
      tail = node;
    }
  }

  tail.next = head;
  return [head, tail];
};

const main = (vs: string[]) => {
  let [head, tail] = parseInput(vs);

  for (let _ = 0; _ < 100; _++) {
    const threeCups = [];
    let current = head;
    for (const i of [0, 1, 2]) {
      current = current.next;
      threeCups.push(current);
    }
    head.next = threeCups[threeCups.length - 1].next;

    let toStop = false;
    let searchLabel = head.value;
    while (!toStop) {
      searchLabel--;
      if (searchLabel < 1) {
        searchLabel = 9;
      }

      if (threeCups.every((node) => node.value !== searchLabel)) {
        toStop = true;
      }
    }

    let destination = head.next;
    while (destination.value !== searchLabel) {
      destination = destination.next;
    }
    threeCups[threeCups.length - 1].next = destination.next;
    destination.next = threeCups[0];

    head = head.next;
  }

  while (head.value !== 1) {
    head = head.next;
  }

  const values = [];
  for (let _ = 0; _ < 8; _++) {
    head = head.next;
    values.push(head.value);
  }

  return values.join("");
};

const main2 = (vs: string[]) => {
  let [head, tail] = parseInput(vs, true);

  const nodeMap = new Map<number, any>();
  nodeMap.set(head.value, head);

  let current = head.next;
  while (current.value !== head.value) {
    nodeMap.set(current.value, current);
    current = current.next;
  }

  for (let _ = 0; _ < 10000000; _++) {
    const threeCups = [];
    let current = head;
    for (const i of [0, 1, 2]) {
      current = current.next;
      threeCups.push(current);
    }
    head.next = threeCups[threeCups.length - 1].next;

    let toStop = false;
    let searchLabel = head.value;
    while (!toStop) {
      searchLabel--;
      if (searchLabel < 1) {
        searchLabel = MAX_VALUE;
      }

      if (threeCups.every((node) => node.value !== searchLabel)) {
        toStop = true;
      }
    }

    let destination = nodeMap.get(searchLabel);
    threeCups[threeCups.length - 1].next = destination.next;
    destination.next = threeCups[0];

    head = head.next;
  }

  head = nodeMap.get(1);

  let finalValue = 1;
  for (let _ = 0; _ < 2; _++) {
    head = head.next;
    finalValue *= head.value;
  }

  return finalValue;
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
