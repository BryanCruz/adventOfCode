import { readFileSync } from "fs";

export {};

const getRates = (vs: string[]): [number, number] => {
  const mostCommonBits = new Array(vs[0].length).fill(0);

  vs.forEach((line) =>
    line
      .split("")
      .forEach((bit, i) => (mostCommonBits[i] += bit == "1" ? 1 : -1))
  );

  const rate = mostCommonBits.map((v) => (v > 0 ? 1 : 0));

  return [rate, invertRate(rate)].map(toDecimal) as [number, number];
};

const invertRate = (bitsArray: number[]): number[] =>
  bitsArray.map((v) => (v == 0 ? 1 : v == 1 ? 0 : 0));

const toDecimal = (bitsArray: number[]): number =>
  bitsArray.reduce(
    (decimal, currentBit, i) =>
      decimal + currentBit * (1 << (bitsArray.length - i - 1)),
    0
  );

const getRate2 = (vs: string[], oxygen: boolean): number[] => {
  const mostCommonBits = new Array(vs[0].length).fill(0);

  const [remaingLine] = mostCommonBits.reduce((remainingLines, _, i) => {
    if (remainingLines.length == 1) {
      return remainingLines;
    }

    const mostCommonBitAux = remainingLines.reduce(
      (acc, line) => acc + (line[i] == 1 ? 1 : -1),
      0
    );

    const mostCommonBit =
      mostCommonBitAux > 0 ? 1 : mostCommonBitAux < 0 ? 0 : -1;

    let bitToFilter = 0;

    if (oxygen) {
      bitToFilter = mostCommonBit == -1 ? 1 : mostCommonBit;
    } else {
      bitToFilter = mostCommonBit == -1 ? 0 : 1 - mostCommonBit;
    }

    return remainingLines.filter((line) => line[i] == `${bitToFilter}`);
  }, vs);

  return remaingLine.split("").map((v) => Number(v));
};

const getRates2 = (vs: string[]): [number, number] => {
  return [true, false]
    .map((oxygen) => getRate2(vs, oxygen))
    .map((v) => toDecimal(v)) as [number, number];
};

const main = (vs: string[]) => {
  const [gamma, epsilon] = getRates(vs);
  return gamma * epsilon;
};

const main2 = (vs: string[]) => {
  const [oxygen, co2] = getRates2(vs);
  return oxygen * co2;
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
