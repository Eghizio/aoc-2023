import { loadInput, sum, toInt } from "../utils";


// Todo: put test_input into a "test" file.
const test_input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

const input = test_input;
// const input = loadInput("input");
const rows = input.split("\n").filter(Boolean);

type ConditionRecord = [string, number[]];
const conditionRecords: ConditionRecord[] = rows.map(row => {
  const [a, b] = row.split(" ");
  return [a.replaceAll(".", " ").trim(), b.split(",").map(toInt)];
});
// brute force replace
// with " " insertion?

const findBrokens = (row: string, xs: number[]) => {
  const rgxs = xs.map(x => new RegExp(`#{`+x+`}`, "g"));
  console.log(rgxs);
  const spots = row.replaceAll("?", "#");

  const results = rgxs.map(rgx => [...spots.matchAll(rgx)]);
  console.log(results)
};

const countCombinations = ([a, b]: ConditionRecord): number => {
  findBrokens(a, b);
  
  return 1;
};

console.log(conditionRecords);
console.log(sum(conditionRecords.map(countCombinations)));
