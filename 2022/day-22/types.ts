export type Board = {
  lines: {
    y: number;
    firstX: number;
    lastX: number;
  }[];
  blockedPoints: Set<string>;
  warpingZones: {
    [k: string]: { x: number; y: number; d: number };
  };
};

export type InstructionTurn = "L" | "R";
export type Instruction = number | InstructionTurn;

export const emptyChar = " ";
export const availableChar = ".";
export const blockedChar = "#";

export const Right = 0;
export const Down = 1;
export const Left = 2;
export const Up = 3;

export const directions = [Right, Down, Left, Up] as const;
export type Direction = number;
