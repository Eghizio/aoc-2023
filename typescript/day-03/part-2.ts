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

const isMark = (char: string) => char === "*"; // Oh hi Mark!

const lookAround = (rows: string[], currentRowIdx: number, numberIndices: number[]) => {
  const currentRow = rows[currentRowIdx];
  const prevRow = rows[currentRowIdx - 1]; // could be undef
  const nextRow = rows[currentRowIdx + 1]; // could be undef
  
  const hash = (rowIdx: number, x: number) => `${rowIdx}_${x}`;

  // gotta refactor.
  const lookLeft = (x: number) => {
    const c = currentRow?.[x-1] ?? ".";
    return isMark(c) ? hash(currentRowIdx, x-1) : null;
  }

  const lookRight = (x: number) => {
    const c = currentRow?.[x+1] ?? ".";
    return isMark(c) ? hash(currentRowIdx, x+1) : null;
  }

  const lookUp = (x: number) => {
    const c = prevRow?.[x] ?? ".";
    return isMark(c) ? hash(currentRowIdx-1, x) : null;
  };

  const lookDown = (x: number) => {
    const c = nextRow?.[x] ?? ".";
    return isMark(c) ? hash(currentRowIdx+1, x) : null;
  };

  const lookTopLeft = (x: number) => {
    const c = prevRow?.[x-1] ?? ".";
    return isMark(c) ? hash(currentRowIdx-1, x-1) : null;
  };

  const lookTopRight = (x: number) => {
    const c = prevRow?.[x+1] ?? ".";
    return isMark(c) ? hash(currentRowIdx-1, x+1) : null;
  };

  const lookBottomLeft = (x: number) => {
    const c = nextRow?.[x-1] ?? ".";
    return isMark(c) ? hash(currentRowIdx+1, x-1) : null;
  };

  const lookBottomRight = (x: number) => {
    const c = nextRow?.[x+1] ?? ".";
    return isMark(c) ? hash(currentRowIdx+1, x+1) : null;
  };
  
  const arounds = numberIndices.map(idx => [
    lookLeft(idx), lookRight(idx), lookUp(idx), lookDown(idx),
    lookTopLeft(idx), lookTopRight(idx), lookBottomLeft(idx), lookBottomRight(idx),
  ])
  .flat()
  .filter(hash => hash !== null) as string[];

  const uniqueArounds = [...new Set(arounds)];
  const isEnginePart = uniqueArounds.flat().some(Boolean);

  const num = toInt(numberIndices.map(i => currentRow[i]).join(""));

  return { isEnginePart, num, uniqueArounds };
};

const gears: Record<string, number[]> = {};

for (const _idx in rows) {
  const idx = toInt(_idx);
  const row = rows[idx];

  const numsAndIndices = findNumberAndIndices(row);
  const idxs = numsAndIndices.map(e => e.idxs);

  const results = idxs.map(indices => lookAround(rows, idx, indices));

  const engineNumbers = results.filter(({ isEnginePart, uniqueArounds }) => isEnginePart &&  uniqueArounds.length > 0);

  engineNumbers.forEach(({ uniqueArounds, num }) => {
    uniqueArounds.forEach(hash => {
      const prev = gears[hash] ?? [];
      gears[hash] = [...prev, num];
    });
  });
}

const gearNums = Object.values(gears).filter(nums => nums.length >= 2);
const gearRatios = gearNums.map(nums => nums.length ? nums.reduce((acc, num) => acc*num, 1) : 0);

console.log(sum(gearRatios));
