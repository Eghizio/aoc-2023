import { loadInput, sum, toInt } from "../utils";


// Todo: put test_input into a "test" file.
const test_input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;


// const input = test_input;
const input = loadInput("input");
const rows = input.split("\n").filter(Boolean);

console.log(rows);
