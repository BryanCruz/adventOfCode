import { Directory, File } from "./types";

export const printFileSystem = (root: Directory): void =>
  printDirectory(root, 0);

const printDirectory = (directory: Directory, level: number) => {
  console.log([getLevelString(level), directory.name, "(dir)"].join(" "));
  Object.values(directory.subdirectories).forEach((subdirectory) =>
    printDirectory(subdirectory, level + 1)
  );
  directory.files.forEach((file) => printFile(file, level + 1));
};

const printFile = (file: File, level: number) =>
  console.log(
    [getLevelString(level), file.name, `(file, size=${file.size})`].join(" ")
  );

const getLevelString = (level: number) =>
  Array(level * 2)
    .fill(" ")
    .join("")
    .concat("-");
