import { readFileSync } from "fs";

export {};

type OponentMoves = "A" | "B" | "C";
type YourMoves = "X" | "Y" | "Z";
type RockPaperScissors = "Rock" | "Paper" | "Scissors";
type Round = [OponentMoves, YourMoves];
type ActualRound = [RockPaperScissors, RockPaperScissors];
type PredictRound = [RockPaperScissors, YourMoves];
type RoundResult = "Win" | "Draw" | "Lose";

const rockPaperScissorsScoreTable: { [key in RockPaperScissors]: number } = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
};

const numberOfPossibleMoves = Object.keys(rockPaperScissorsScoreTable).length;

const main = (vs: string[]) => {
  return getTotalScore(
    vs
      .map((line) => line.split(" ") as Round)
      .map((moves) => moves.map(getActualMove) as ActualRound)
  );
};

const main2 = (vs: string[]) => {
  return getTotalScore(
    vs
      .map((line) => line.split(" ") as Round)
      .map(([oponent, you]) => [getActualMove(oponent), you] as PredictRound)
      .map(([oponent, you]) => [oponent, getMoveForResult(you, oponent)])
  );
};

const getTotalScore = (rounds: ActualRound[]): number =>
  rounds.reduce(
    (totalScore, [oponent, you]) =>
      totalScore + getScoreForMove(you) + getScoreForRound(you, oponent),
    0
  );

const getActualMove = (move: OponentMoves | YourMoves): RockPaperScissors => {
  switch (move) {
    case "A":
    case "X":
      return "Rock";
    case "B":
    case "Y":
      return "Paper";
    default:
      return "Scissors";
  }
};

const getScoreForMove = (move: RockPaperScissors): number => {
  return rockPaperScissorsScoreTable[move];
};

const getScoreForRound = (
  yourMove: RockPaperScissors,
  oponentMove: RockPaperScissors
): number => {
  const scoreTable: { [key in RoundResult]: number } = {
    Win: 6,
    Draw: 3,
    Lose: 0,
  };

  return scoreTable[getRoundResult(yourMove, oponentMove)];
};

const getRoundResult = (
  yourMove: RockPaperScissors,
  oponentMove: RockPaperScissors
): RoundResult => {
  const [yourScore, oponentScore] = [yourMove, oponentMove].map(
    getScoreForMove
  );

  const scoreDifference =
    (yourScore - oponentScore + numberOfPossibleMoves) % numberOfPossibleMoves;

  if (scoreDifference === 0) {
    return "Draw";
  }

  if (scoreDifference === 1) {
    return "Win";
  }

  return "Lose";
};

const getMoveForResult = (
  you: YourMoves,
  oponent: RockPaperScissors
): RockPaperScissors => {
  const predictTable: { [key in YourMoves]: RoundResult } = {
    X: "Lose",
    Y: "Draw",
    Z: "Win",
  };

  const resultToValueTable: { [key in RoundResult]: number } = {
    Win: 1,
    Draw: 0,
    Lose: -1,
  };

  const roundResult = predictTable[you];
  const oponentScore = getScoreForMove(oponent);
  const yourScore =
    (oponentScore + resultToValueTable[roundResult] + numberOfPossibleMoves) %
      numberOfPossibleMoves || numberOfPossibleMoves;

  const yourMove = (Object.keys(
    rockPaperScissorsScoreTable
  ) as RockPaperScissors[]).find(
    (move) => rockPaperScissorsScoreTable[move] === yourScore
  )!;

  return yourMove;
};

const [vt, v] = ["inputT.txt", "input.txt"].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split(/\r?\n/)
);

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
