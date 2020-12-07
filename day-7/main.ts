import { readFileSync } from "fs";

export {};

type edgeType = { from: string; to: string; w: number };
type ruleType = { src: string; dests: Array<{ n: number; name: string }> };

const createGraph = (rules: Array<ruleType>): edgeType[] => {
  const edges: edgeType[] = [];

  for (const rule of rules) {
    for (const dest of rule.dests) {
      edges.push({ from: rule.src, to: dest.name, w: dest.n });
    }
  }

  return edges;
};

const getRules = (vs: string[]): ruleType[] =>
  vs.map((v) => {
    const [_, src, destsRaw] = v.match(/^([\w ]+) ?bags? contains? (.*)\.$/);
    const dests = destsRaw
      .split(",")
      .map((s) => s.trim())
      .map((s) => {
        let r = s.match(/^(\d+) ([\w ]+) ?bags?$/);
        if (!r) {
          r = [null, "0", "any"];
        }

        const [_, n, name] = r;

        return { n: Number(n), name: name.trim() };
      });

    return { src: src.trim(), dests };
  });

const main = (vs: string[]) => {
  const rules = getRules(vs);

  const graph = createGraph(rules);

  const objective = "shiny gold";
  const visited = new Set<string>();

  const q = [objective];
  let count = 0;
  while (q.length > 0) {
    const targetEdge = q.shift();
    visited.add(targetEdge);

    for (const edge of graph) {
      if (edge.to === targetEdge && !visited.has(edge.from)) {
        visited.add(edge.from);
        q.push(edge.from);
        count++;
      }
    }
  }

  return count;
};

let pd = new Map<string, number>();
const countFrom = (fromEdge: string, graph: edgeType[]): number => {
  if (pd.has(fromEdge)) {
    return pd.get(fromEdge);
  }

  const toEdges = graph.filter((edge) => edge.from === fromEdge);
  if (toEdges.length === 1 && toEdges[0].w === 0) {
    pd.set(fromEdge, 0);
    return 0;
  }

  let count = 0;
  for (const edge of toEdges) {
    const r = countFrom(edge.to, graph);

    // if (fromEdge === "shiny gold") {
    //   console.log(`${edge.to}: ${edge.w} + ${edge.w}*${r}`);
    // }

    count += edge.w + edge.w * r;
  }

  pd.set(fromEdge, count);
  return count;
};

const main2 = (vs: string[]) => {
  const rules = getRules(vs);

  const graph = createGraph(rules);

  const source = "shiny gold";
  return countFrom(source, graph);
};

const vt = readFileSync(`${__dirname}/inputT.txt`).toString().split("\n");
const vt2 = readFileSync(`${__dirname}/inputT2.txt`).toString().split("\n");
const v = readFileSync(`${__dirname}/input.txt`).toString().split("\n");

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");

pd = new Map<string, number>();
console.log("test", main2(vt));

pd = new Map<string, number>();
console.log("test2", main2(vt2));

pd = new Map<string, number>();
console.log("final", main2(v));
