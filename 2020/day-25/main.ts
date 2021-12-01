import { readFileSync } from "fs";

export {};

const parseInput = (vs: string[]): [bigint, bigint] =>
  vs.map((v) => BigInt(v)) as [bigint, bigint];

const tranformSubjectNumber = (
  value: bigint,
  subjectNumber: bigint
): bigint => {
  value *= subjectNumber;
  value %= BigInt(20201227);

  return value;
};

const main = (vs: string[]) => {
  const keys = parseInput(vs);
  const loopsAndSubjects = keys.map((key) => {
    let loopSize = BigInt(0);
    let subjectNumber = BigInt(7);
    let value = BigInt(1);

    while (true) {
      loopSize += BigInt(1);
      value = tranformSubjectNumber(value, subjectNumber);
      if (value === key) {
        return [loopSize, subjectNumber];
      }
    }
  });

  const encryptionKeys = loopsAndSubjects.map(([loopSize], i) => {
    let value = BigInt(1);
    for (let j = BigInt(0); j < loopSize; j++) {
      value = tranformSubjectNumber(value, keys[1 - i]);
    }
    return value;
  });

  if (encryptionKeys[0] !== encryptionKeys[1]) {
    throw Error("encryption keys should be equal");
  }

  return encryptionKeys[0];
};

const main2 = (vs: string[]) => "Merry Xmas";

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
