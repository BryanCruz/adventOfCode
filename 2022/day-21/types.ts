export type Operation = "+" | "-" | "/" | "*" | "=";

export type Monkey = MonkeyYell | MonkeyOperation;

type MonkeyCommon = {
  name: string;
  type: "yell" | Operation;
  resolved: boolean;
  value?: number;
};

export type MonkeyOperation = MonkeyCommon & {
  type: Operation;
  nameA: string;
  nameB: string;
  valueA?: number;
  valueB?: number;
};

export type MonkeyYell = MonkeyCommon & {
  type: "yell";
  value: number;
  resolved: true;
};
