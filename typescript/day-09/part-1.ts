import { loadInput, sum, toInt } from "../utils";


// Todo: put test_input into a "test" file.
const test_input = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;


// const input = test_input;
const input = loadInput("input");
const rows = input.split("\n").filter(Boolean);

const histories = rows.map(row => row.split(" ").map(toInt));

const getDiffs = (history: number[]) => {
  const [head, ...tail] = history;
  const diffs = tail.map((y, i) => i===0 ? y-head : y - tail[i-1]);
  return diffs;
};

const getLayers = (acc: number[][]): number[][] => {
  const last = acc[acc.length-1];
  const difs = getDiffs(last);

  if(difs.every(d => d===difs[0])) return [...acc, difs];
  return getLayers([...acc, difs]);
};

const layers = histories.map(history => getLayers([history]));

const takeLasts = (layers: number[][]): number[] => layers.map(layer => layer[layer.length - 1]);

const lasts = layers.map(takeLasts);
const reducedRight = lasts.map(sum);

console.log(sum(reducedRight))
