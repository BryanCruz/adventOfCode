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

const recursiveCombat = (hands: [handType, handType]): [number, handType] => {
  const previousRounds = new Set<string>();

  while (hands.every((hand) => hand.length > 0)) {
    const handsHash = hands.map((hand) => hand.join(",")).join("-");
    if (previousRounds.has(handsHash)) {
      return [0, []];
    }
    previousRounds.add(handsHash);

    const cards = hands.map((hand) => hand.shift());
    let winner = -1;
    if (cards.every((card, i) => hands[i].length >= card)) {
      const [recursiveWinner, _] = recursiveCombat(
        hands.map((hand, i) => hand.slice(0, cards[i])) as [handType, handType]
      );

      winner = recursiveWinner;
    } else {
      winner = cards[0] > cards[1] ? 0 : 1;
    }

    hands[winner].push(...[cards[winner], cards[1 - winner]]);
  }

  for (const i of [0, 1]) {
    if (hands[i].length > 0) {
      return [i, hands[i]];
    }
  }
};

const main2 = (vs: string[]) => {
  const hands = parseInput(vs);

  const [_, winningHand] = recursiveCombat(
    hands.map((hand) => [...hand]) as [handType, handType]
  );

  return winningHand.reduce((s, v, i) => s + v * (winningHand.length - i), 0);
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
