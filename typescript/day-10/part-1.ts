import { loadInput, sum, toInt } from "../utils";


// Todo: put test_input into a "test" file.
const test_input = `-L|F7
7S-7|
L|7||
-L-J|
L|-JF`;

const test_input2 = `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`;

// const input = test_input;
// const input = test_input2;
const input = loadInput("input");
const matrix = input.split("\n").filter(Boolean).map(row => row.split(""));

type Matrix = string[][];
type Position = { x: number; y: number; };
type MatrixFn<T = void, M = Matrix> = (matrix: M, { x, y }: Position) => T | undefined;
type Direction = "left" | "right" | "bottom" | "top";

const hash = ({ x, y }: Position) => `${x}-${y}`;

const around = ({ x, y }: Position) => ({
  left:   { x: x-1, y },
  right:  { x: x+1, y },
  top:    { x, y: y-1 },
  bottom: { x, y: y+1 },
});

const invertDirection = (direction: Direction): Direction => ({
  left: "right" as const,
  right: "left" as const,
  bottom: "top" as const,
  top: "bottom" as const,
})[direction]; // could use switch to typeguard undef.


const loopMatrix = <T>(matrix: Matrix, cb: MatrixFn<T>) => {
  for (let y=0; y<matrix.length; y++) {
    for (let x=0; x<matrix[y].length; x++) {
      const result = cb(matrix, { x, y });
      if (result) return result;
    }
  }
};

const findAnimal: MatrixFn<Position> = (matrix, { x, y }) => {
  if (matrix[y][x] === "S") return { x, y };
  return undefined;
};

type DirectedPosition = [Position, Direction]; // where it came from.
const findConnectedPipesAround = (m: Matrix, { x, y }: Position): [DirectedPosition, DirectedPosition] => {
  const position = around({ x, y });
  const look = ({ x, y }: Position) => m?.[y]?.[x];

  // const around = Object.values(position).map(look);

  // from direction
  const connectedPipes = [
    ["-", "L", "F"].includes(look(position.left))   && [position.left, "left"],
    ["-", "J", "7"].includes(look(position.right))  && [position.right, "right"],
    ["|", "F", "7"].includes(look(position.top))    && [position.top, "top"],
    ["|", "L", "J"].includes(look(position.bottom)) && [position.bottom, "bottom"],
  ].filter(Boolean) as [Position, Direction][];

  const [a, b] = connectedPipes;

  return [a, b];
};

const getAnimalPosition = (matrix: Matrix): Position => {
  const animalPosition = loopMatrix(matrix, findAnimal);
  if (!animalPosition) throw new Error("No animal found!");
  return animalPosition;
};

type Pipe = "|" | "-" | "L" | "J" | "7" | "F"; // | "." | "S";
const nextDirection = (pipe: Pipe, previousDirection: Direction): Direction => ({
  "|": previousDirection,
  "-": previousDirection,
  "L": previousDirection === "bottom" ? "right" as const : "top" as const,
  "J": previousDirection === "bottom" ? "left" as const : "top" as const,
  "7": previousDirection === "top" ? "left" as const : "bottom" as const,
  "F": previousDirection === "top" ? "right" as const : "bottom" as const,
})[pipe];

const goNext: MatrixFn<(prev: Direction) => DirectedPosition> = (m, { x, y }) => (previousDirection) => {
  const currentPipe = m?.[y]?.[x];
  if (currentPipe === undefined) throw new Error("Out of bounds pipe error");

  // console.log("_DEBUG: ", { x, y, currentPipe });

  const position = around({ x, y });

  // we need the previous one xd
  switch (currentPipe) {
    case "|":
    case "-":
    case "L":
    case "J":
    case "7":
    case "F": {
      const dir = nextDirection(currentPipe, previousDirection);
      return [position[dir], dir];
    };
    case ".": throw new Error("Shouldn't be an empty field!");
    case "S": throw new Error("Shouldn't reach the animal!");
    default: throw new Error("No pipe matching!");
  }

  // return [{ x, y }, previousDirection];
  throw new Error("Should match some pipe!");
};

const step = (matrix: Matrix, [[ap, ad], [bp, bd]]: [DirectedPosition, DirectedPosition]): [DirectedPosition, DirectedPosition] => {
  const nextA = goNext(matrix, ap)?.(ad);
  const nextB = goNext(matrix, bp)?.(bd);
  if (nextA === undefined) throw new Error("NextA is undefined!");
  if (nextB === undefined) throw new Error("NextB is undefined!");

  return [nextA, nextB];
};

// when A and B meets that is the end, or when meets S then divide in half.
const goDownThePipes = (matrix: Matrix, [[ap, ad], [bp, bd]]: [DirectedPosition, DirectedPosition], steps: number): number => {
  // console.log(steps, { a: {ap, ad}, b: {bp,bd} });

  if(hash(ap) === hash(bp)) return steps;
  
  const [a, b] = step(matrix, [[ap, ad], [bp, bd]]);
  
  return goDownThePipes(matrix, [a, b], steps + 1);
};

const goDownThePipesWhile = (matrix: Matrix, [a, b]: [DirectedPosition, DirectedPosition], steps: number): number => {
  while(hash(a[0]) !== hash(b[0])) {
    const [[ap, ad], [bp, bd]] = [a, b];
    // console.log(steps, { a: {ap, ad}, b: {bp,bd} });
    
    steps++;
    [a, b] = step(matrix, [[ap, ad], [bp, bd]]);
  }

  return steps;
};

const animalPosition = getAnimalPosition(matrix);
const [a, b] = findConnectedPipesAround(matrix, animalPosition);

// const steps = goDownThePipes(matrix, [a, b], 1); // already at first step
const steps = goDownThePipesWhile(matrix, [a, b], 1); // already at first step
console.log(steps);
