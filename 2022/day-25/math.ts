import { getSnafuRepresentation } from "./parse";
import { Snafu } from "./types";

export const findSnafu = (n: number): string => {
  let s = 0;
  const snafu = [] as number[];

  for (let i = 0; s < n; i++) {
    snafu.unshift(2);
    s += 2 * Math.pow(5, i);
  }

  console.log(snafu);
  return snafu.map(getSnafuRepresentation).join("");
};

export const sumSnafu = (aa: Snafu[], bb: Snafu[]): Snafu[] => {
  const [a, b] = [[...aa], [...bb]];

  const result: Snafu[] = [];

  while (a.length > 0 || b.length > 0) {
    const aToS = a.pop() || 0;
    const bToS = b.pop() || 0;

    let s = aToS + bToS;
    const signal = Math.abs(s) / s;
    if (Math.abs(s) > 2) {
      s -= 5 * signal;
      if (a.length === 0) {
        a.push(0);
      }
      a[a.length - 1] += signal;
    }
    result.unshift(s);
  }

  return result;
};
