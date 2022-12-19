import { Blueprint } from "./types";

export const parseInput = (lines: string[]): Blueprint[] =>
  lines.map(parseBlueprint);

export const parseBlueprint = (line: string): Blueprint => {
  const oreSpec = line.match(/Each ore robot costs (\d+) ore/)!;
  const claySpec = line.match(/Each clay robot costs (\d+) ore/)!;
  const obsidianSpec = line.match(
    /Each obsidian robot costs (\d+) ore and (\d+) clay/
  )!;
  const geodeSpec = line.match(
    /Each geode robot costs (\d+) ore and (\d+) obsidian/
  )!;

  const [_, id] = line.match(/Blueprint (\d+)/)!;
  return {
    id: Number(id),
    robots: {
      ore: {
        collects: "ore",
        needsToBuild: {
          ore: Number(oreSpec[1]),
          clay: 0,
          obsidian: 0,
          geode: 0,
        },
      },
      clay: {
        collects: "clay",
        needsToBuild: {
          ore: Number(claySpec[1]),
          clay: 0,
          obsidian: 0,
          geode: 0,
        },
      },
      obsidian: {
        collects: "obsidian",
        needsToBuild: {
          ore: Number(obsidianSpec[1]),
          clay: Number(obsidianSpec[2]),
          obsidian: 0,
          geode: 0,
        },
      },
      geode: {
        collects: "geode",
        needsToBuild: {
          ore: Number(geodeSpec[1]),
          clay: 0,
          obsidian: Number(geodeSpec[2]),
          geode: 0,
        },
      },
    },
  };
};
