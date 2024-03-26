import { loadInput, sum, toInt } from "../utils";

const test_input = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;


// const input = test_input;
const input = loadInput("input");
const rows = input.split("\n").filter(Boolean);

const nums = "0123456789".split("");

const numRegex = /\d+/g;
const findNumberAndIndices = (row: string) => [...row.matchAll(numRegex)]
  .flatMap(r => r.index !== undefined ? ({ num: toInt(r[0]), i: r.index, length: r[0].length }) : [])
  .map(({ num, i, length }) => ({ num, idxs: Array.from({ length }, (_, idx) => i + idx) }));

const notMarks = [...nums, "."];
const isMark = (char: string) => !notMarks.includes(char); // Oh hi Mark!

const lookAround = (rows: string[], currentRowIdx: number, numberIndices: number[]) => {
  const currentRow = rows[currentRowIdx];
  
  const row = { // prev & next could be undef
    previous: rows[currentRowIdx - 1],
    current: rows[currentRowIdx],
    next: rows[currentRowIdx + 1],
  };

  // extract isMark to separate layer
  const look = {
    left: (x: number) => isMark(row.current?.[x-1] ?? "."),
    right: (x: number) => isMark(row.current?.[x+1] ?? "."),
    top: (x: number) => isMark(row.previous?.[x] ?? "."),
    bottom: (x: number) => isMark(row.next?.[x] ?? "."),
    topLeft: (x: number) => isMark(row.previous?.[x-1] ?? "."),
    topRight: (x: number) => isMark(row.previous?.[x+1] ?? "."),
    bottomLeft: (x: number) => isMark(row.next?.[x-1] ?? "."),
    bottomRight: (x: number) => isMark(row.next?.[x+1] ?? "."),
  };

  // gotta refactor.
  const arounds = numberIndices.map(idx => Object.values(look).map(fn => fn(idx)));
  const isEnginePart = arounds.flat().some(Boolean);

  const num = toInt(numberIndices.map(i => currentRow[i]).join(""));

  return { isEnginePart, num };
};

const partNumbers = rows.map((_, i) => i).flatMap(idx => {
  const row = rows[idx];

  const numsAndIndices = findNumberAndIndices(row);
  const idxs = numsAndIndices.map(e => e.idxs);

  const results = idxs.map(indices => lookAround(rows, idx, indices));
  const engineNumbers = results.flatMap(({ isEnginePart, num }) => isEnginePart ? num : []);

  return engineNumbers;
});

console.log(sum(partNumbers));
