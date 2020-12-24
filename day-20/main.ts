import { readFileSync } from "fs";

export {};

type rawTileType = {
  id: string;
  grid: string[];
};

// orientation: left to right, top to bottom
type tileType = {
  id: string;
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

    for (let i = 0; i < 8; i++) {
      currTile = rotateTile(currTile);
      if (i === 4) {
        currTile = flipTile(currTile);
      }

      if (
        currentRow.length > 0 &&
        currentRow[currentRow.length - 1].right !== currTile.left
      ) {
        continue;
      }

      if (previousRow && previousRow[currIndex % n].bottom !== currTile.top) {
        // console.log(
        //   `doesn't match ${JSON.stringify(
        //     previousRow[currIndex % n]
        //   )} bottom with ${JSON.stringify(currTile)} top`
        // );
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

const main2 = (vs: string[]) => {};

const [vt, v] = ["inputT.txt", "input.txt"].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split("\n")
);

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
// console.log("final", main2(v));
