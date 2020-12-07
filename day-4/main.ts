import { readFileSync } from "fs";

const main = (vs: string[]) => {
  let i = 0;
  let count = 0;

  while (i < vs.length) {
    let currentDoc = "";
    while (i < vs.length && vs[i] !== "") {
      currentDoc += " " + vs[i];
      i++;
    }

    const kvPair = currentDoc.split(" ");
    const fieldsCheck = fields.map((field) => [field, false]);
    for (const pair of kvPair) {
      if (pair === "") {
        continue;
      }

      const [key, value] = pair.split(":");
      const indexOf = fields.indexOf(key);

      if (indexOf === -1) {
        continue;
      }

      fieldsCheck[indexOf][1] = true;
    }

    if (fieldsCheck.every(([f, c]) => f === "cid" || c)) {
      count++;
    }

    i++;
  }

  return count;
};

const main2 = (vs: string[]) => {
  let i = 0;
  let count = 0;

  while (i < vs.length) {
    let currentDoc = "";
    while (i < vs.length && vs[i] !== "") {
      currentDoc += " " + vs[i];
      i++;
    }

    const kvPair = currentDoc.split(" ");
    const fieldsCheck = fields.map((field) => [field, false]);
    for (const pair of kvPair) {
      if (pair === "") {
        continue;
      }

      const [key, value] = pair.split(":");
      const indexOf = fields.indexOf(key);

      if (indexOf === -1) {
        continue;
      }

      try {
        const valid = fieldsValidation[indexOf](value);
        fieldsCheck[indexOf][1] = valid;
      } catch (err) {}
    }

    if (fieldsCheck.every(([f, c]) => f === "cid" || c)) {
      count++;
    }

    i++;
  }

  return count;
};

const fields = [
  "byr", // (Birth Year)
  "iyr", // (Issue Year)
  "eyr", // (Expiration Year)
  "hgt", // (Height)
  "hcl", // (Hair Color)
  "ecl", // (Eye Color)
  "pid", // (Passport ID)
  "cid", // (Country ID)
];

const fieldsValidation = [
  (v) => {
    const [_, v1] = v.match(/^(\d{4,4})$/);

    const vv = Number(v1);
    return vv >= 1920 && vv <= 2002;
  }, // (Birth Year)
  (v) => {
    const [_, v1] = v.match(/^(\d{4,4})$/);

    const vv = Number(v1);
    return vv >= 2010 && vv <= 2020;
  }, // (Issue Year)
  (v) => {
    const [_, v1] = v.match(/^(\d{4,4})$/);

    const vv = Number(v1);
    return vv >= 2020 && vv <= 2030;
  }, // (Expiration Year)
  (v) => {
    const [_, v1, m] = v.match(/^(\d+)(cm|in)$/);

    const vv = Number(v1);
    if (m === "cm") {
      return vv >= 150 && vv <= 193;
    } else {
      return vv >= 59 && vv <= 76;
    }
  }, // (Height)
  (v) => {
    const [_, hashtag, color] = v.match(/^(\#)([0-9a-f]{6,6})$/);
    return true;
  }, // (Hair Color)
  (v) => {
    const [_, eyecolor] = v.match(/^(amb|blu|brn|gry|grn|hzl|oth)$/);
    return true;
  }, // (Eye Color)
  (v) => {
    const [_, id] = v.match(/^(\d{9,9})$/);
    return true;
  }, // (Passport ID)
  () => true, // (Country ID)
];

const vt = readFileSync(`${__dirname}/inputT.txt`).toString().split("\n");
const v = readFileSync(`${__dirname}/input.txt`).toString().split("\n");

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
