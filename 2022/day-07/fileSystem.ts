import {
  CdCommand,
  Command,
  CommandLsContext,
  CommandsAndOutputs,
  Directory,
  File,
  isCommand,
  isOutput,
  Output,
} from "./types";

export const getFileSystem = (
  commandsAndOutputs: CommandsAndOutputs
): Directory => {
  const rootName = "/";

  commandsAndOutputs.unshift(
    { commandType: "ls" },
    { outputType: "dir", dirName: rootName }
  );

  const initialContext: CommandLsContext = {
    currentDirectory: createDirectory("helperRoot"),
    get parent() {
      return this;
    },
  };

  commandsAndOutputs.reduce((context, currentCommandOrOutput) => {
    if (isCommand(currentCommandOrOutput)) {
      return handleCommand(context, currentCommandOrOutput);
    } else if (isOutput(currentCommandOrOutput)) {
      return handleOutput(context, currentCommandOrOutput);
    }
    throw Error("Invalid State");
  }, initialContext);

  return initialContext.currentDirectory.subdirectories[rootName];
};

const handleCommand = (
  context: CommandLsContext,
  command: Command
): CommandLsContext => {
  if (command.commandType === "ls") {
    // ignore, since we are assuming that the context is always for ls command
    return context;
  }

  return handleCdCommand(context, command);
};

const handleCdCommand = (
  context: CommandLsContext,
  { dirName }: CdCommand
): CommandLsContext => {
  if (dirName === "..") {
    return context.parent;
  }

  const nextDirectory = context.currentDirectory.subdirectories[dirName]!;
  return {
    parent: context,
    currentDirectory: nextDirectory,
  };
};

const handleOutput = (
  context: CommandLsContext,
  output: Output
): CommandLsContext => {
  const { currentDirectory } = context;

  if (output.outputType === "dir") {
    const { dirName } = output;
    const dir = createDirectory(dirName);
    currentDirectory.subdirectories[dirName] = dir;
  } else {
    const { fileName, fileSize } = output;
    const file = createFile(fileName, fileSize);
    currentDirectory.files.push(file);
  }

  return context;
};

const createDirectory = (name: string): Directory => ({
  name,
  files: [],
  subdirectories: {},
});

const createFile = (name: string, size: number): File => ({
  name,
  size,
});
