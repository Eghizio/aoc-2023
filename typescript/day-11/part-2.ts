import { loadInput, sum, toInt } from "../utils";


// Todo: put test_input into a "test" file.
const test_input = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;


const input = test_input;
// const input = loadInput("input");
const matrix = input.split("\n").filter(Boolean).map(row => row.split(""));

const HEIGHT = matrix.length;
const WIDTH = matrix[0].length;

type Matrix = string[][];
type Position = { x: number; y: number; };

const hash = ({ x, y }: Position) => `${x}-${y}`;

const transpose = (arr: Matrix) => arr[0].map((_, x) => arr.map(row => row[x]));

// const around = ({ x, y }: Position) => ({
//   left:   { x: x-1, y },
//   right:  { x: x+1, y },
//   top:    { x, y: y-1 },
//   bottom: { x, y: y+1 },
// });

// for (let y=0; y<matrix.length; y++) {
//   for (let x=0; x<matrix[y].length; x++) {
    
//   }
// }

const isEmpty = (xs: any[]): boolean => xs.every(x => x === ".");

const getRows = (matrix: Matrix): Matrix => matrix;
const getCols = (matrix: Matrix): Matrix => transpose(matrix);

const expandEmpty = (rows: Matrix) => rows.flatMap(row => isEmpty(row) ? Array.from({ length: 1_000_000 }, () => row) : [row]);

const expandUniverse = (matrix: Matrix): Matrix => {
  const rows = getRows(matrix);
  const expandedRows = expandEmpty(rows);

  const cols = getCols(expandedRows);
  const expandedCols = expandEmpty(cols);

  return transpose(expandedCols);
}

// console.table(matrix);
console.log("ROWS:");
// console.table(getRows(matrix));
console.log("COLS:");
// console.table(getCols(matrix));

console.log("EXPANDED:");
// console.table(expandUniverse(matrix));

const getGalaxyPositions = (universe: Matrix): Set<string> => {
  const hashes = universe.flatMap((row, y) => row.flatMap((el, x) => el === "." ? [] : hash({ x, y })));
  return new Set(hashes);
};

const positions = getGalaxyPositions(expandUniverse(matrix));
console.log(positions);

const combination = <T>(arr: T[]) => arr.flatMap((v, i) => arr.slice(i+1).map( w => [v, w]));

const combos = combination([...positions]);

// console.log(combos);
// console.log(combos.length);

const unhash = (hash: string): Position => {
 const [x, y] = hash.split("-").map(toInt);
 return { x , y }; 
};

// const euclidianDistance = (
//   { x: x1, y: y1 }: Position,
//   { x: x2, y: y2 }: Position,
// ) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

const manhattanDistance = (
  { x: x1, y: y1 }: Position,
  { x: x2, y: y2 }: Position,
) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

const distance = (a: Position, b: Position) => manhattanDistance(a, b);

const xs = combos.map(([a, b]) => 
  ({
    a, b, d: distance(unhash(a), unhash(b)),
    cd: Math.ceil(distance(unhash(a), unhash(b)))
  })
);

// console.table(expandUniverse(matrix))
// console.log(xs);

console.log(sum(xs.map(x => x.d)))

// 5 = 1-6
// 9 = 5-11
// distance = 9
