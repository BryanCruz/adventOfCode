import { Directory, File } from "./types";

const memo: { [path: string]: number } = {};

export const sum = <T>(collection: T[], getValue: (e: T) => number) =>
  collection.reduce((total, curr) => total + getValue(curr), 0);

export const getDirectorySize = (dir: Directory): number =>
  sum(dir.files, (file) => file.size) +
  sum(Object.values(dir.subdirectories), getDirectorySize);

export const findFirstGreaterOrEqual = (
  collection: number[],
  searchValue: number
): number =>
  collection.sort((a, b) => a - b).find((value) => value >= searchValue)!;
