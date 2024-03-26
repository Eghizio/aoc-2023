import { loadInput, sum } from "../utils";

const toInt = (x: string) => parseInt(x, 10);

const getFirstAndPossiblyLast = <T>(arr: T[]): [T, T] => {
  const [head, ...tail] = arr;
  return [head, tail.pop() ?? head];
};

const test_input = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

// const input = test_input; // 281
const input = loadInput("input"); // 54591
const rows = input.split("\n").filter(Boolean);

const nums = "123456789".split("");
const words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const wordsMapping: Record<string, string> = { one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9" };

const filterDigitStrings = (arr: string[]) => arr.filter(char => nums.includes(char));

const extractFirstLastDigitsToInt = (rowDigits: string[]) => {
  const [f, l] = getFirstAndPossiblyLast(rowDigits);
  return toInt(f + l);
};

const isNum = (char: string) => nums.includes(char);
const mapWord = (str: string): string => wordsMapping[str] ?? "";

const mapRow = (row: string) => {
  let result = "";
  let parts = "";
  
  for (const char of row.split("")) {
    if (isNum(char)) {
      result = result + char;
      continue;
    }

    parts = parts + char;
    if(words.some(word => parts.endsWith(word))) {
      const lastWordOrNull = words.reduce<string | null>((acc, word) => parts.endsWith(word) ? word : acc, null);
      if (lastWordOrNull) {
        const mapped = mapWord(lastWordOrNull);
        result = result + mapped;
      }
    }
  }

  return result;
};

const twoDigits = rows.map(row => {
  const replaced = mapRow(row);
  const digits = filterDigitStrings(replaced.split(""));
  const twoDigits = extractFirstLastDigitsToInt(digits);

  // console.log({ row, replaced, digits, twoDigits });
  
  return twoDigits;
});

console.log(sum(twoDigits));
