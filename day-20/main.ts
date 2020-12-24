import { readFileSync } from "fs";

export {};

type rawTileType = {
  id: string;
  grid: string[];
};

// orientation: left to right, top to bottom
type tileType = {
  id: string;
  grid: string[];
  transformations: Array<"r" | "f">;
  top: string;
  bottom: string;
  left: string;
  right: string;
};

const parseInput = (vs: string[]): tileType[] =>
  (vs.concat("").reduce(
    ([previousTiles, currentTile], currentLine) => {
      if (currentLine === "") {
        const { id, grid } = currentTile;

        const currentTileParsed: tileType = {
          id,
          grid,
          transformations: [],
          top: grid[0],
          bottom: grid[grid.length - 1],
          left: grid.map((line) => line[0]).join(""),
          right: grid.map((line) => line[line.length - 1]).join(""),
        };

        return [previousTiles.concat(currentTileParsed), null];
      }

      if (!currentTile) {
        const [_, tileId] = currentLine.match(/Tile (\d+):/);
        return [previousTiles, { id: tileId, grid: [] }];
      }

      return [
        previousTiles,
        {
          id: currentTile.id,
          grid: currentTile.grid.concat([currentLine]),
        },
      ];
    },
    [[], null] as [tileType[], rawTileType | null]
  ) as [tileType[], rawTileType | null])[0];

const rotateTile = (tile: tileType): tileType => {
  // rotate clockwise

  const rotatedTile = {
    id: tile.id,
    grid: tile.grid,
    transformations: tile.transformations.concat("r"),
    right: tile.top,
    bottom: tile.right.split("").reverse().join(""),
    left: tile.bottom,
    top: tile.left.split("").reverse().join(""),
  };

  return rotatedTile;
};

const flipTile = (tile: tileType): tileType => {
  const flippedTile = {
    id: tile.id,
    grid: tile.grid,
    transformations: tile.transformations.concat("f"),
    right: tile.left,
    left: tile.right,
    bottom: tile.bottom.split("").reverse().join(""),
    top: tile.top.split("").reverse().join(""),
  };

  return flippedTile;
};

const combine = (
  origVs: tileType[],
  n: number,
  currentRow: tileType[],
  previousRow?: tileType[]
): tileType[][] => {
  const currIndex = n * n - origVs.length;

  if (origVs.length === 0) {
    return [[]];
  }

  let cs: tileType[][] = [];
  for (let j = 0; j < origVs.length; j++) {
    let currTile = origVs[j];
    const vs = origVs.slice(0, j).concat(origVs.slice(j + 1));

    const updateTile = (i: number) => {
      if (i === 3) {
        currTile = flipTile(currTile);
      } else {
        currTile = rotateTile(currTile);
      }
    };

    for (let i = 0; i < 8; updateTile(i), i++) {
      if (
        currentRow.length > 0 &&
        currentRow[currentRow.length - 1].right !== currTile.left
      ) {
        continue;
      }

      if (previousRow && previousRow[currIndex % n].bottom !== currTile.top) {
        continue;
      }

      const isLastFromRow = currIndex % n === n - 1;

      const nextVs = vs;
      const nextPreviousRow = isLastFromRow
        ? currentRow.concat([currTile])
        : previousRow;
      const nextCurrentRow = isLastFromRow ? [] : currentRow.concat([currTile]);

      const nextCombs = combine(
        nextVs,
        n,
        nextCurrentRow,
        nextPreviousRow
      ).map((comb) => [currTile].concat(comb));

      cs = cs.concat(nextCombs);
    }
  }

  return cs;
};

const buildImage = (comb: tileType[], n: number): string[] => {
  const image: string[] = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let { grid, transformations } = comb[n * i + j];

      for (const transformation of transformations) {
        if (transformation === "f") {
          grid = flipImage(grid);
        } else {
          grid = [0, 1, 2].reduce((p, _) => rotateImage(p), grid);
        }
      }

      const tile = grid
        .slice(1, grid.length - 1)
        .map((line) => line.slice(1, line.length - 1));

      for (let k = 0; k < tile.length; k++) {
        const line = tile[k];

        const imageLineIndex = i * tile.length + k;
        image[imageLineIndex] = (image[imageLineIndex] || "").concat(line);
      }
    }
  }

  return image;
};

const rotateImage = (image: string[]): string[] => {
  // rotate anticlockwise

  const rotatedImage = [];
  for (let i = 0; i < image.length; i++) {
    const line = image[i];
    const column = line.split("").reverse().join("");

    for (let j = 0; j < image.length; j++) {
      rotatedImage[j] = (rotatedImage[j] || "").concat(column[j]);
    }
  }

  return rotatedImage;
};

const flipImage = (image: string[]): string[] => {
  const flippedImage = [];

  for (let i = 0; i < image.length; i++) {
    flippedImage.push(image[i].split("").reverse().join(""));
  }

  return flippedImage;
};

const monsterLines = [
  "                  # ",
  "#    ##    ##    ###",
  " #  #  #  #  #  #   ",
];

const getMonsters = (image: string[]) => {
  const monsterRegexes = monsterLines
    .map((line) => line.replace(/ /g, "."))
    .map((regexString) => new RegExp(regexString));

  let matchesN = 0;
  for (let i = 0; i < image.length - 2; i++) {
    let matchesI = [];
    for (let i0 = 0; i0 < image[0].length; i0++) {
      const matches = monsterRegexes.map((regex, j) =>
        image[i + j].slice(i0).match(regex)
      );
      if (
        matches.every(
          (match) => match !== null && match.index === matches[0].index
        ) &&
        !matchesI.includes(matches[0].index + i0)
      ) {
        matchesN++;
        matchesI.push(matches[0].index + i0);
      }
    }
  }
  return matchesN;
};

const main = (vs: string[]) => {
  const tiles = parseInput(vs);
  const n = Math.round(Math.sqrt(tiles.length));
  const combs = combine(tiles, n, []);
  const comb = combs[0];

  const result = [0, n - 1, n * n - n, n * n - 1].reduce(
    (m, i) => m * Number(comb[i].id),
    1
  );
  return result;
};

const countHashtags = (grid: string[]): number =>
  grid
    .join("")
    .split("")
    .filter((s) => s === "#").length;

const main2 = (vs: string[]) => {
  const tiles = parseInput(vs);
  const n = Math.round(Math.sqrt(tiles.length));

  const combs = combine(tiles, n, []);

  let maxN = -1;
  for (const comb of combs) {
    const image = buildImage(comb, n);
    const monstersN = getMonsters(image);
    if (monstersN > 0) {
      console.log("wow");
      maxN = Math.max(
        maxN,
        countHashtags(image) - monstersN * countHashtags(monsterLines)
      );
    }
  }
  return maxN;
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
