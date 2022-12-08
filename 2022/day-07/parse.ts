import { Command, CommandsAndOutputs, Output } from "./types";

export const getCommandsAndOutputs = (lines: string[]): CommandsAndOutputs =>
  lines.map((line) => (line[0] === "$" ? getCommand(line) : getOutput(line)));

const getCommand = (line: string): Command => {
  const [_, command, arg] = line.split(" ");

  return command === "ls"
    ? { commandType: "ls" }
    : {
        commandType: "cd",
        dirName: arg,
      };
};

const getOutput = (line: string): Output => {
  const [arg1, arg2] = line.split(" ");

  return arg1 === "dir"
    ? {
        outputType: "dir",
        dirName: arg2,
      }
    : {
        outputType: "file",
        fileSize: Number(arg1),
        fileName: arg2,
      };
};
