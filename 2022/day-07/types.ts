/* File System */

export interface File {
  name: string;
  size: number;
}

export interface Directory {
  name: string;
  files: File[];
  subdirectories: { [name: string]: Directory };
}

/* Commands */

export type Command = CdCommand | LsCommand;

interface BaseCommand {
  commandType: "ls" | "cd";
}

export interface CdCommand extends BaseCommand {
  commandType: "cd";
  dirName: string;
}

export interface LsCommand extends BaseCommand {
  commandType: "ls";
}

export const isCommand = (obj: Object): obj is Command => "commandType" in obj;

/* Outputs */

export type Output = DirectoryOutput | FileOutput;

interface BaseOutput {
  outputType: "dir" | "file";
}

interface DirectoryOutput extends BaseOutput {
  outputType: "dir";
  dirName: string;
}

interface FileOutput extends BaseOutput {
  outputType: "file";
  fileName: string;
  fileSize: number;
}

export const isOutput = (obj: Object): obj is Output => "outputType" in obj;

/* Helpers */

export type CommandsAndOutputs = Array<Command | Output>;

export interface CommandLsContext {
  parent: CommandLsContext;
  currentDirectory: Directory;
}
