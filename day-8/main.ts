import { readFileSync } from "fs";

export {};

let accV = 0;
let p = 0;

const inst = {
  acc: (v: number) => {
    accV += v;
    inst.jmp(1);
  },
  nop: () => {
    inst.jmp(1);
  },
  jmp: (v: number) => {
    p += v;
  },
};

const main = (vs: string[]) => {
  accV = 0;
  p = 0;

  const s = new Set<number>();

  while (true) {
    if (s.has(p)) {
      break;
    }
    s.add(p);

    const [_, op, v] = vs[p].match(/(\w+) ([-+]\d+)/);
    inst[op](Number(v));
  }

  return accV;
};

const main2 = (vsOrig: string[]) => {
  const candidates = vsOrig
    .map((v) => v.match(/nop/) || v.match(/jmp/))
    .map((v, i) => v && i)
    .filter((v) => v !== null);

  for (const candidate of candidates) {
    accV = 0;
    p = 0;
    const s = new Set<number>();

    const vs = [...vsOrig];
    vs[candidate] = vs[candidate].match(/nop/)
      ? vs[candidate].replace("nop", "jmp")
      : vs[candidate].replace("jmp", "nop");

    while (true) {
      if (p === vs.length) {
        return accV;
      }

      if (p > vs.length || s.has(p)) {
        break;
      }
      s.add(p);

      const [_, op, v] = vs[p].match(/(\w+) ([-+]\d+)/);
      inst[op](Number(v));
    }
  }
};

const vt = readFileSync(`${__dirname}/inputT.txt`).toString().split("\n");
const v = readFileSync(`${__dirname}/input.txt`).toString().split("\n");

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
