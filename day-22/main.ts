import { readFileSync } from "fs";

export {};

type handType = number[];

const parseInput = (vs: string[]): [handType, handType] => {
  const divisionIndex = vs.indexOf("");

  const hand1 = vs.slice(0, divisionIndex);
  const hand2 = vs.slice(divisionIndex + 1);

  return [hand1, hand2]
    .map((hand) => hand.slice(1))
    .map((hand) => hand.map((v) => Number(v))) as [handType, handType];
};

const main = (vs: string[]) => {
  const hands = parseInput(vs);

  while (hands.every((hand) => hand.length > 0)) {
    const cards = hands.map((hand) => hand.shift());
    const winningHand = cards[0] > cards[1] ? hands[0] : hands[1];

    cards.sort((a, b) => b - a);
    winningHand.push(...cards);
  }

  const winningHand = hands.find((hand) => hand.length > 0);

  return winningHand.reduce((s, v, i) => s + v * (winningHand.length - i), 0);
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
