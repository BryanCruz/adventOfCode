import { chunkify } from "../../common";

const openPacket = "[";
const closePacket = "]";
const splitPacket = ",";

export const parseInput = (lines: string[]): [any, any][] =>
  chunkify(lines.filter((line) => line !== "").map(parsePacket), 2) as [
    any,
    any
  ][];

const parsePacket = (packetString: string): any => {
  const packetByLevel: { [key: number]: any } = {};

  for (
    let i = 0, currentLevel = -1, currentNumber = "";
    i < packetString.length;
    i++
  ) {
    const currChar = packetString[i];

    if (currChar === openPacket) {
      currentLevel++;
      packetByLevel[currentLevel] = [];
      continue;
    }

    if (currChar === splitPacket || currChar === closePacket) {
      if (currentNumber !== "") {
        packetByLevel[currentLevel].push(Number(currentNumber));
        currentNumber = "";
      }
    }

    if (currChar === closePacket) {
      currentLevel--;
      if (currentLevel >= 0) {
        packetByLevel[currentLevel].push(packetByLevel[currentLevel + 1]);
      }
      continue;
    }

    if (currChar === splitPacket) {
      continue;
    }

    currentNumber = currentNumber.concat(currChar);
  }

  return packetByLevel[0];
};
