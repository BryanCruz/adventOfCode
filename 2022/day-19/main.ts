import { readFileSync } from "fs";
import { parseInput } from "./parse";
import { Blueprint, Inventory, Material, materials, State } from "./types";

export {};

const STATES = materials.length + 1;
const DELIMITER = "_";
const POSSIBLE_STATES = Array(STATES)
  .fill(0)
  .map((_, i) => i);

const main = (
  vs: string[],
  minutes = 24,
  scoreFn = getBlueprintScore,
  aggFn = (a: number, b: number) => a + b,
  agg0 = 0
) => {
  const blueprints = parseInput(vs);
  return blueprints
    .map((bp) => [bp, simulateBlueprint(bp, minutes)] as [Blueprint, number])
    .reduce((agg, [bp, maxGeodes]) => aggFn(agg, scoreFn(bp, maxGeodes)), agg0);
};

const main2 = (vs: string[]) =>
  main(
    vs.slice(0, 3),
    32,
    (bp, v) => v,
    (a, b) => a * b,
    1
  );

const hasAlreadyReachedInventoryFn = (): ((
  inventory: Inventory
) => boolean) => {
  const set = new Set<string>();
  const getKey = (inventory: Inventory): string =>
    materials
      .map(
        (material) =>
          `(${inventory.myInventory[material]}_${inventory.myRobots[material]})`
      )
      .join(":");

  return (inventory) => {
    const k = getKey(inventory);
    if (set.has(k)) {
      return true;
    }
    set.add(k);
    return false;
  };
};

const getBlueprintScore = ({ id }: Blueprint, geodes: number) => id * geodes;

const getOptimalStates = (
  myInventory: Inventory["myInventory"],
  myRobots: Inventory["myRobots"],
  blueprint: Blueprint
) => {
  const canBuildRobot = (robotToBuild: Material) =>
    materials.every(
      (material) =>
        myInventory[material] -
          blueprint.robots[robotToBuild].needsToBuild[material] >=
        0
    );

  if (canBuildRobot("geode")) {
    return [...POSSIBLE_STATES].filter(
      (state) => getMaterial(state) === "geode"
    );
  }

  if (canBuildRobot("obsidian")) {
    return [...POSSIBLE_STATES].filter(
      (state) => getMaterial(state) === "obsidian"
    );
  }

  const hasToBuildRobot = (robotToBuild: Material) =>
    canBuildRobot(robotToBuild) && myRobots[robotToBuild] === 0;

  const robotBlocklist = materials.filter((material) => {
    if (material === "geode") {
      return false;
    }

    const maxNeededToBuild = Math.max(
      ...materials.map(
        (materialToBuild) =>
          blueprint.robots[materialToBuild].needsToBuild[material]
      )
    );

    const hasEnough = myRobots[material] >= maxNeededToBuild;
    return hasEnough;
  });

  const hasToBuildSomeRobot = materials.some(hasToBuildRobot);

  const optimalStates = [...POSSIBLE_STATES].filter((state) => {
    const material = getMaterial(state);

    if (material === null) {
      return !hasToBuildSomeRobot;
    }

    return (
      canBuildRobot(material) && !robotBlocklist.find((r) => r === material)
    );
  });

  return optimalStates;
};

const simulateBlueprint = (blueprint: Blueprint, minutes: number): number => {
  const initialState = "B";
  const initialInventory: Inventory = {
    myInventory: {
      clay: 0,
      ore: 0,
      obsidian: 0,
      geode: 0,
    },
    myRobots: {
      clay: 0,
      ore: 1,
      obsidian: 0,
      geode: 0,
    },
  };

  const reachedFn = hasAlreadyReachedInventoryFn();

  const memo: {
    [minutes: number]: { [stateKey: string]: Inventory };
  } = { [0]: { [initialState]: initialInventory } };

  let maxGeodes = 0;

  for (let minute = 1; minute <= minutes; minute++) {
    memo[minute] = {};

    Object.keys(memo[minute - 1]).map((previousStateKey) => {
      const lastMemo = memo[minute - 1][previousStateKey];

      const { myInventory, myRobots } = {
        myInventory: {
          ...lastMemo.myInventory,
        },
        myRobots: {
          ...lastMemo.myRobots,
        },
      };

      getOptimalStates(myInventory, myRobots, blueprint).forEach(
        (possibleState) => {
          const robotToAdd = getMaterial(possibleState);

          const { myInventory, myRobots } = {
            myInventory: {
              ...lastMemo.myInventory,
            },
            myRobots: {
              ...lastMemo.myRobots,
            },
          };

          const inventoryToAdd = materials.map(
            (material) => myRobots[material]
          );

          if (robotToAdd !== null) {
            materials.forEach((material) => {
              myInventory[material] -=
                blueprint.robots[robotToAdd].needsToBuild[material];
            });
            myRobots[robotToAdd] += 1;
          }

          materials.forEach((material, i) => {
            myInventory[material] += inventoryToAdd[i];
          });

          const newInventory = { myInventory, myRobots };

          if (!reachedFn(newInventory)) {
            memo[minute][
              previousStateKey
                .concat(DELIMITER)
                .concat(possibleState.toString())
            ] = newInventory;

            maxGeodes = Math.max(maxGeodes, myInventory.geode);
          }
        }
      );
    });

    delete memo[minute - 1];
  }

  return maxGeodes;
};

const getMaterial = (state: number): Material | null =>
  state > 0 ? materials[state - 1] : null;

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
