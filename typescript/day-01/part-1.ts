import { loadInput, sum, toInt } from "../utils";


const input = loadInput("input");
const rows = input.split("\n").filter(Boolean);

const nums = "123456789".split("");
const rowNums = rows.map(row => row.split("").filter(char => nums.includes(char)));
const firstLastDigits = rowNums.map(([head, ...tail]) => toInt(`${head}${tail.pop() ?? head}`));

console.log(sum(firstLastDigits));
