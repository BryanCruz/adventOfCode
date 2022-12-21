import { Monkey, MonkeyOperation, Operation } from "./types";

let parents: { [monkeyName: string]: string[] };
let dependencies: { [monkeyName: string]: string[] };
let monkeysByName: { [monkeyName: string]: Monkey };
let resolved: Set<Monkey>;
let unresolved: Set<Monkey>;

export const resetStates = (monkeys: Monkey[]) => {
  monkeysByName = {};
  parents = {};
  dependencies = {};
  resolved = new Set();
  unresolved = new Set();
  monkeys.forEach((monkey) => {
    prepareParents(monkey);
  });
};

export const getRoot = (): number => {
  resolve("root", false);
  return monkeysByName["root"].value!;
};

export const getHumn = (): number => {
  const humn = monkeysByName["humn"];
  humn.resolved = false;
  humn.type = "=";
  resolved.delete(humn);
  unresolved.add(humn);

  solveForUnknowns("root");
  resolve("humn_inverse", false);

  const humnInverse = monkeysByName["humn_inverse"];
  return humnInverse.value!;
};

const solveForUnknowns = (monkeyName: string) => {
  if (monkeyName === "humn") {
    return;
  }

  const monkey = monkeysByName[monkeyName];

  if (monkey.type === "yell") {
    console.log(monkey);
    throw Error("");
  }

  resolve(monkeyName, true);

  const inverseOperation = getInverse(monkey.type);

  const [newMonkeyName, newNameA, newNameB] = [
    monkey.name,
    monkey.nameA,
    monkey.nameB,
  ].map((name) => name.concat("_inverse"));

  const isADefined = monkey.valueA !== undefined;
  const isBDefined = monkey.valueB !== undefined;

  if (isADefined && isBDefined) {
    console.log(monkey);
    throw Error("A and B should not be both defined");
  }

  const [nameDefined, nameUndefined] = isADefined
    ? [newNameA, newNameB]
    : [newNameB, newNameA];

  const valueDefined = isADefined ? monkey.valueA! : monkey.valueB!;

  const [newOperation, paramA, paramB]: any = isBDefined
    ? [inverseOperation, newMonkeyName, newNameB]
    : monkey.type === "+"
    ? ["-", newMonkeyName, newNameA]
    : monkey.type === "-"
    ? ["-", newNameA, newMonkeyName]
    : monkey.type === "*"
    ? ["/", newMonkeyName, newNameA]
    : monkey.type === "/"
    ? ["/", newNameA, newMonkeyName]
    : ["=", newNameA, newMonkeyName];

  const solveParent: Monkey = {
    type: monkeyName === "root" ? "=" : newOperation,
    name: nameUndefined,
    nameA: monkeyName === "root" ? nameDefined : paramA,
    nameB: monkeyName === "root" ? nameDefined : paramB,
    resolved: false,
  };

  const toYellDefined: Monkey = {
    type: "yell",
    name: nameDefined,
    value: valueDefined,
    resolved: true,
  };

  const undefinedOriginalName = nameUndefined.replace("_inverse", "");

  prepareParents(solveParent);
  prepareParents(toYellDefined);

  solveForUnknowns(undefinedOriginalName);
};

const resolve = (name: string, partial: boolean): void => {
  const monkey = monkeysByName[name] as any;

  if (monkey.resolved) {
    return;
  }

  while (
    (partial && monkey.valueA === undefined && monkey.valueB === undefined) ||
    (!partial && !monkey.resolved)
  ) {
    resolved.forEach((monkey) => {
      resolveMonkeyValue(monkey);
    });
  }
};

const prepareParents = (monkey: Monkey): void => {
  monkeysByName[monkey.name] = monkey;

  if (monkey.type === "yell") {
    resolved.add(monkey);
    return;
  }
  unresolved.add(monkey);

  parents[monkey.nameA] = (parents[monkey.nameA] || []).concat(monkey.name);
  parents[monkey.nameB] = (parents[monkey.nameB] || []).concat(monkey.name);

  dependencies[monkey.name] = (dependencies[monkey.name] || []).concat(
    monkey.nameA,
    monkey.nameB
  );
};

const resolveMonkeyValue = (monkey: Monkey): void => {
  if (!monkey.resolved) {
    throw Error("Should be already resolved");
  }

  (parents[monkey.name] || [])
    .map((parentName) => monkeysByName[parentName])
    .forEach((parent) => {
      if (parent.type === "yell") {
        throw Error("Yell should not have dependencies.");
      }

      if (parent.nameA === monkey.name) {
        parent.valueA = monkey.value;
      }

      if (parent.nameB === monkey.name) {
        parent.valueB = monkey.value;
      }

      if (parent.nameA !== monkey.name && parent.nameB !== monkey.name) {
        throw Error("Should be one of the dependencies.");
      }

      if (parent.valueA !== undefined && parent.valueB !== undefined) {
        parent.value = getOperationResult(parent);
        parent.resolved = true;
        resolved.add(parent);
      }
    });

  resolved.delete(monkey);
};

const getOperationResult = (monkey: MonkeyOperation): number => {
  const { valueA, valueB } = monkey;

  if (valueA === undefined || valueB === undefined) {
    throw Error("Invalid get operation.");
  }

  switch (monkey.type) {
    case "*":
      return valueA * valueB;
    case "+":
      return valueA + valueB;
    case "/":
      return valueA / valueB;
    case "-":
      return valueA - valueB;
    case "=":
      return valueA;
  }
};

const getInverse = (operation: Operation): Operation => {
  switch (operation) {
    case "*":
      return "/";
    case "+":
      return "-";
    case "/":
      return "*";
    case "-":
      return "+";
    case "=":
      return "=";
  }
};
