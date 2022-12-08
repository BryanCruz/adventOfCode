import { readFileSync } from "fs";
import { printFileSystem } from "./debug";
import { getFileSystem } from "./fileSystem";
import { getDirectorySize, findFirstGreaterOrEqual, sum } from "./mathematics";
import { getCommandsAndOutputs } from "./parse";
import { Directory } from "./types";

export {};

const main = (vs: string[]) => {
  const maxSize = 100000;

  const commandsAndOutputs = getCommandsAndOutputs(vs);
  const root = getFileSystem(commandsAndOutputs);

  const dirsSizesOfInterest = getAllDirectories(root)
    .map((dir) => getDirectorySize(dir))
    .filter((size) => size < maxSize);

  return sum(dirsSizesOfInterest, (size) => size);
};

const main2 = (vs: string[]) => {
  const commandsAndOutputs = getCommandsAndOutputs(vs);
  const root = getFileSystem(commandsAndOutputs);

  const totalSpace = 70000000;
  const spaceNeededForUpdate = 30000000;
  const unusedSpace = totalSpace - getDirectorySize(root);
  const needToDelete = spaceNeededForUpdate - unusedSpace;

  return findFirstGreaterOrEqual(
    getAllDirectories(root).map((dir) => getDirectorySize(dir)),
    needToDelete
  );
};

const getAllDirectories = (root: Directory): Directory[] =>
  [root].concat(
    ...Object.values(root.subdirectories).map((subdirectory) =>
      getAllDirectories(subdirectory)
    )
  );

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
