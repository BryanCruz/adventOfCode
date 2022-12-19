export const materials = ["ore", "clay", "obsidian", "geode"] as const;
export type Material = typeof materials[number];

export type Robot = {
  collects: Material;
  needsToBuild: {
    [key in Material]: number;
  };
};

export type Blueprint = {
  id: number;
  robots: {
    [key in Material]: Robot;
  };
};

export type Inventory = {
  myInventory: {
    [key in Material]: number;
  };
  myRobots: {
    [key in Material]: number;
  };
};

export type State = number[];
