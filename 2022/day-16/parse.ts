export type Valve = {
  name: string;
  rate: number;
  connections: string[];
};

export const parseInput = (lines: string[]): Valve[] => {
  const regex = /Valve (.*) has flow rate=(\d+); tunnels? leads? to valves? (.*)/;

  return lines.map((line) => {
    const [_, name, rate, valves] = line.match(regex) as string[];
    return {
      name,
      rate: Number(rate),
      connections: valves.split(", "),
    };
  });
};
