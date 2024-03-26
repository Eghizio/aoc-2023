import { loadInput, toInt } from "../utils";

// to utils
const multiply = (nums: number[]) => nums.length ? nums.reduce((acc, num) => acc * num, 1) : 0;

// Todo: put test_input into a "test" file.
const test_input = `Time:      7  15   30
Distance:  9  40  200`;

// const input = test_input;
const input = loadInput("input");
const rows = input.split("\n").filter(Boolean);

const numRegex = /\d+/g;
const [time, distance] = rows.map(row => [...row.matchAll(numRegex)].map(m => toInt(m[0])));

type Race = [number, number]; // [miliseconds, milimeters];
const races: Race[] = time.map((t, i) => [t, distance[i]]);

const DELTA = 1;
const getScores = (time: number): number[] => {
  const tries = Array.from({ length: time + 1 }, (_, i) => i);

  const xs = tries.map(charge => {
    const velocity = charge * DELTA;
    const remainingTime = time - charge;
    return velocity * remainingTime;
  });

  return xs;
};

const scores = races.map(([time, distance]) => getScores(time).filter(score => score > distance));
const possibilities = scores.map(scores => scores.length);

console.log(multiply(possibilities));
