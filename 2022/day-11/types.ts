export type Monkey = {
  itemsIndexes: number[];
  allItems: number[];
  itemsByMonkeyTracker: number[][]; // object[monkey][itemIndex]: itemWithMod
  modX: number;
  operation: (old: number, forModX?: number) => number;
  test: (value: number) => boolean;
  throwTo: (testResult: boolean) => number;
  relief: (value: number) => number;
};

export type Context = {
  counter: number[];
};
