import { readFileSync } from "fs";

export {};

type Backpack = string[];
type BackpackGroup = [Backpack, Backpack, Backpack];
type BackpackReduce = [number, string[][]];

const main = (vs: string[]) => {
  return vs
    .map((line) => line.split(""))
    .reduce(
      (totalSum, currBackpack) => totalSum + getBackpackScore(currBackpack),
      0
    );
};

const main2 = (vs: string[]) => {
  return vs
    .map((line) => line.split(""))
    .reduce(
      ([totalSum, currBackpacks], currBackpack, i) => {
        currBackpacks.push(currBackpack);

        if (i % 3 === 2) {
          return [
            totalSum + getBackpacksScore(currBackpacks as BackpackGroup),
            [],
          ] as BackpackReduce;
        }

        return [totalSum, currBackpacks] as BackpackReduce;
      },
      [0, []] as BackpackReduce
    );
};

const getBackpackScore = (items: Backpack) => {
  const half = items.length / 2;
  const firstHalfItems = new Set(items.slice(0, half));

  const duplicatedItem = items
    .slice(half)
    .find((item) => firstHalfItems.has(item))!;

  return getPriority(duplicatedItem);
};

const getBackpacksScore = (backpacks: BackpackGroup) => {
  const [itemsA, itemsB, itemsC] = backpacks;

  const itemsSetA = new Set(itemsA);

  const itemsSetAB = new Set(itemsB.filter((item) => itemsSetA.has(item)));

  const badge = itemsC.find((item) => itemsSetAB.has(item))!;

  return getPriority(badge);
};

const getPriority = (item: string) => {
  const [charCode_A, charCode_a, charCode_item] = ["A", "a", item].map((e) =>
    e.charCodeAt(0)
  );

  if (charCode_item > charCode_a) {
    return charCode_item - charCode_a + 1;
  }

  return charCode_item - charCode_A + 27;
};

const [vt, v] = ["inputT.txt", "input.txt"].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split(/\r?\n/)
);

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
