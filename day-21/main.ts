import { readFileSync } from "fs";

export {};

type foodType = {
  ingredients: string[];
  allergens: string[];
};

const parseInput = (vs: string[]): foodType[] =>
  vs.map((line) => {
    const [_, rawIngredients, rawAllergens] = line.match(
      /^(.*) \(contains (.*)\)$/
    );

    if (!rawIngredients || !rawAllergens) {
      throw Error(`could not parse input: ${line}`);
    }

    return {
      ingredients: rawIngredients.trim().split(" "),
      allergens: rawAllergens.trim().split(", "),
    };
  });

const getAllergenToIngredientsMap = (
  foods: foodType[]
): Map<string, Set<string>> =>
  foods.reduce((map, food) => {
    for (const allergen of food.allergens) {
      if (!map.get(allergen)) {
        const s = new Set<string>();
        map.set(allergen, s);

        for (const food2 of foods) {
          for (const ingredient of food2.ingredients) {
            s.add(ingredient);
          }
        }
      }

      const s = map.get(allergen);
      const newS = new Set<string>();
      for (const ingredient of food.ingredients) {
        if (s.has(ingredient)) {
          newS.add(ingredient);
        }
      }
      map.set(allergen, newS);
    }

    return map;
  }, new Map<string, Set<string>>());

const getIngredientsWithoutAllergens = (
  foods: foodType[],
  allergenToIngredientsMap: Map<string, Set<string>>
): string[] => {
  const ingredientsWithAllergens = new Set<string>();
  allergenToIngredientsMap.forEach((s) =>
    s.forEach((ingredient) => ingredientsWithAllergens.add(ingredient))
  );

  const ingredientsWithoutAllergens = new Set<string>();
  foods.forEach((food) => {
    food.ingredients.forEach((ingredient) =>
      ingredientsWithoutAllergens.add(ingredient)
    );
  });

  ingredientsWithAllergens.forEach((ingredient) =>
    ingredientsWithoutAllergens.delete(ingredient)
  );

  let ingredientsWithoutAllergensList = [];
  ingredientsWithoutAllergens.forEach((ingredient) =>
    ingredientsWithoutAllergensList.push(ingredient)
  );

  return ingredientsWithoutAllergensList;
};

const main = (vs: string[]) => {
  const foods = parseInput(vs);

  const allergenToIngredientsMap = getAllergenToIngredientsMap(foods);
  const ingredientsWithoutAllergensList = getIngredientsWithoutAllergens(
    foods,
    allergenToIngredientsMap
  );

  return vs
    .join(", ")
    .match(new RegExp(ingredientsWithoutAllergensList.join("|"), "g")).length;
};

const main2 = (vs: string[]) => {
  const foods = parseInput(vs);
  const allergenToIngredientsMap = getAllergenToIngredientsMap(foods);

  let allergenToIngredientsTuple: Array<[string, string[]]> = [];
  allergenToIngredientsMap.forEach((ingredientsSet, allergen) => {
    const ingredientsList: string[] = [];
    ingredientsSet.forEach((ingredient) => {
      ingredientsList.push(ingredient);
    });

    allergenToIngredientsTuple.push([allergen, ingredientsList]);
  });

  const ingredientsSolvedSet = new Set<string>();
  const allergenRespectiveIngredient: Array<[string, string]> = [];

  while (allergenToIngredientsTuple.length > 0) {
    allergenToIngredientsTuple.sort((a, b) => a[1].length - b[1].length);

    const [allergen, possibleIngredients] = allergenToIngredientsTuple.shift();

    const ingredient = possibleIngredients.find(
      (possibleIngredient) => !ingredientsSolvedSet.has(possibleIngredient)
    );

    if (!ingredient) {
      throw Error(`could not find ingredient for ${allergen}`);
    }

    ingredientsSolvedSet.add(ingredient);
    allergenToIngredientsTuple = allergenToIngredientsTuple.map(
      ([allergen, possibleIngredients]) => {
        const ingredientIndex = possibleIngredients.indexOf(ingredient);
        if (ingredientIndex === -1) {
          return [allergen, possibleIngredients];
        }

        return [
          allergen,
          possibleIngredients
            .slice(0, ingredientIndex)
            .concat(possibleIngredients.slice(ingredientIndex + 1)),
        ];
      }
    );
    allergenRespectiveIngredient.push([allergen, ingredient]);
  }

  allergenRespectiveIngredient.sort((a, b) => (a[0] < b[0] ? -1 : 1));
  return allergenRespectiveIngredient
    .map(([_, ingredient]) => ingredient)
    .join(",");
};

const [vt, v] = ["inputT.txt", "input.txt"].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split("\n")
);

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
