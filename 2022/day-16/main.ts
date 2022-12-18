import { readFileSync } from "fs";
import { parseInput, Valve } from "./parse";

export {};

type Context = {
  totalPressure: number;
  openValves: string[];
  currValveName: string;
};

type Context2 = {
  totalPressure: number;
  openValves: string[];
  currValveName: string;
  currValveName2: string;
};

const main = (vs: string[]) => {
  const valves = parseInput(vs);
  return compute(valves);
};

const main2 = (vs: string[]) => {
  const valves = parseInput(vs);
  return compute2(valves);
};

const compute = (valves: Valve[]): number => {
  const valvesByName = valves.reduce((obj, valve) => {
    obj[valve.name] = valve;
    return obj;
  }, {} as { [key: string]: Valve });

  const initialContext = {
    totalPressure: 0,
    currValveName: "AA",
    openValves: [],
  };

  let contexts: Context[] = [initialContext];
  const contextKeyToTotalPressure: { [key: string]: number } = {};

  for (let i = 0; i < 30; i++) {
    const newContexts: Context[] = [];

    contexts.sort((a, b) => b.totalPressure - a.totalPressure);

    // 2000 is an empiric value
    contexts.slice(0, 2000).forEach((context) => {
      const { currValveName, openValves, totalPressure } = context;
      const currValve = valvesByName[currValveName];

      if (currValve.rate > 0 && !openValves.find((v) => v === currValveName)) {
        const newContext: Context = {
          currValveName,
          openValves: openValves.concat(currValveName).sort(),
          totalPressure: totalPressure + (30 - i - 1) * currValve.rate,
        };
        newContexts.push(newContext);
        contextKeyToTotalPressure[getContextKey(newContext)] = Math.max(
          newContext.totalPressure,
          contextKeyToTotalPressure[getContextKey(newContext)] || 0
        );
      }

      currValve.connections.forEach((connection) => {
        const newContext: Context = {
          currValveName: connection,
          openValves: [...openValves],
          totalPressure: totalPressure,
        };
        newContexts.push(newContext);
        contextKeyToTotalPressure[getContextKey(newContext)] = Math.max(
          newContext.totalPressure,
          contextKeyToTotalPressure[getContextKey(newContext)] || 0
        );
      });
    });

    contexts = newContexts;
  }

  return Math.max(...Object.values(contextKeyToTotalPressure));
};

const compute2 = (valves: Valve[]): number => {
  const valvesByName = valves.reduce((obj, valve) => {
    obj[valve.name] = valve;
    return obj;
  }, {} as { [key: string]: Valve });

  const initialContext = {
    totalPressure: 0,
    currValveName: "AA",
    currValveName2: "AA",
    openValves: [],
  };

  let contexts: Context2[] = [initialContext];
  const contextKeyToTotalPressure: { [key: string]: number } = {};

  for (let i = 0; i < 26; i++) {
    const newContexts: Context2[] = [];

    contexts.sort((a, b) => b.totalPressure - a.totalPressure);

    // 2000 is an empiric value
    contexts.slice(0, 2000).forEach((context) => {
      const {
        currValveName,
        currValveName2,
        openValves,
        totalPressure,
      } = context;
      const [currValve, currValve2] = [
        valvesByName[currValveName],
        valvesByName[currValveName2],
      ];

      if (currValve.rate > 0 && !openValves.find((v) => v === currValveName)) {
        // open my valve
        const newOpenValves = openValves.concat(currValveName).sort();

        if (
          currValve2.rate > 0 &&
          !openValves.find((v) => v === currValveName2) &&
          currValveName !== currValveName2
        ) {
          // open my valve and elephant valve
          const newContext: Context2 = {
            currValveName,
            currValveName2,
            openValves: [...newOpenValves.concat(currValveName2).sort()],
            totalPressure:
              totalPressure +
              (26 - i - 1) * currValve.rate +
              (26 - i - 1) * currValve2.rate,
          };
          newContexts.push(newContext);
          contextKeyToTotalPressure[getContextKey2(newContext)] = Math.max(
            newContext.totalPressure,
            contextKeyToTotalPressure[getContextKey2(newContext)] || 0
          );
        }

        // open only my valve
        currValve2.connections.forEach((connection) => {
          const newContext: Context2 = {
            currValveName,
            currValveName2: connection,
            openValves: [...newOpenValves],
            totalPressure: totalPressure + (26 - i - 1) * currValve.rate,
          };
          newContexts.push(newContext);
          contextKeyToTotalPressure[getContextKey2(newContext)] = Math.max(
            newContext.totalPressure,
            contextKeyToTotalPressure[getContextKey2(newContext)] || 0
          );
        });
      }

      if (
        currValve2.rate > 0 &&
        !openValves.find((v) => v === currValveName2)
      ) {
        // open only elephant valve
        const newOpenValves = openValves.concat(currValveName2).sort();

        currValve.connections.forEach((connection) => {
          const newContext: Context2 = {
            currValveName: connection,
            currValveName2,
            openValves: [...newOpenValves],
            totalPressure: totalPressure + (26 - i - 1) * currValve2.rate,
          };
          newContexts.push(newContext);
          contextKeyToTotalPressure[getContextKey2(newContext)] = Math.max(
            newContext.totalPressure,
            contextKeyToTotalPressure[getContextKey2(newContext)] || 0
          );
        });
      }

      // open no valve
      currValve.connections.forEach((connection) => {
        currValve2.connections.forEach((connection2) => {
          const newContext: Context2 = {
            currValveName: connection,
            currValveName2: connection2,
            openValves: [...openValves],
            totalPressure: totalPressure,
          };
          newContexts.push(newContext);
          contextKeyToTotalPressure[getContextKey2(newContext)] = Math.max(
            newContext.totalPressure,
            contextKeyToTotalPressure[getContextKey2(newContext)] || 0
          );
        });
      });
    });

    contexts = newContexts;
  }

  return Math.max(...Object.values(contextKeyToTotalPressure));
};

const getContextKey = ({ openValves, currValveName }: Context) =>
  `${currValveName}_${openValves.join(":")}`;

const getContextKey2 = ({
  openValves,
  currValveName,
  currValveName2,
}: Context2) => {
  const [valve1, valve2] = [currValveName, currValveName2].sort();
  return `${valve1}_${valve2}_${openValves.join(":")}`;
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
