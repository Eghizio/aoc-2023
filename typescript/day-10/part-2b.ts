import { verify } from "crypto";
import { loadInput, sum, toInt } from "../utils";


// Todo: put test_input into a "test" file.
const test_input = [
`...........
.S-------7.
.|F-----7|.
.||OOOOO||.
.||OOOOO||.
.|L-7OF-J|.
.|II|O|II|.
.L--JOL--J.
.....O.....`,

`..........
.S------7.
.|F----7|.
.||OOOO||.
.||OOOO||.
.|L-7F-J|.
.|II||II|.
.L--JL--J.
..........`,

`.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`,

`FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`,
];



const input = test_input[2];
// const input = loadInput("input"); // 402 too low;
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

const goDownThePipesWhile = (matrix: Matrix, [a, b]: [DirectedPosition, DirectedPosition], visited: Set<string>): Set<string> => {
  visited.add(hash(a[0]));
  visited.add(hash(b[0]));

  while(hash(a[0]) !== hash(b[0])) {
    const [[ap, ad], [bp, bd]] = [a, b];
    
    // console.log(visited, { a: {ap, ad}, b: {bp,bd} });
    
    [a, b] = step(matrix, [[ap, ad], [bp, bd]]);
    
    visited.add(hash(a[0]));
    visited.add(hash(b[0]));
  }

  return visited;
};

const animalPosition = getAnimalPosition(matrix);
const [a, b] = findConnectedPipesAround(matrix, animalPosition);

// console.log(matrix);
// console.log({ a, b });
// when A and B meets that is the end, or when meets S then divide in half.

const startingPipes = new Set([hash(animalPosition)]);
// console.log( { startingPipes });

// const steps = goDownThePipes(matrix, [a, b], 1); // already at first step
const visited = goDownThePipesWhile(matrix, [a, b], startingPipes); // already at first step

  // console.log({ visited }, visited.size);

// flood everything and then filter out O to I.
// if has VISITED pipe from every side, or Inside tile. (tho not sure if tile is inside yet or not)



const mapAnimalToPipe = (matrix: Matrix): Pipe => {
  const animalPosition = getAnimalPosition(matrix);
  const [[_, dirA], [__, dirB]] = findConnectedPipesAround(matrix, animalPosition);
  
  const includesMany = (dirs: Direction[]) => dirs.every(dir => [dirA, dirB].includes(dir));
  // const pipes = [
  //   includesMany(["top", "bottom"]) && "|",
  //   includesMany(["left", "right"]) && "-",
  //   includesMany(["top", "right"]) && "L",
  //   includesMany(["top", "left"]) && "J",
  //   includesMany(["bottom", "left"]) && "7",
  //   includesMany(["bottom", "right"]) && "F"
  // ];
  // console.log({ pipes });

  const pipes: Record<Pipe, boolean> = {
    "|": includesMany(["top", "bottom"]),
    "-": includesMany(["left", "right"]),
    "L": includesMany(["top", "right"]),
    "J": includesMany(["top", "left"]),
    "7": includesMany(["bottom", "left"]),
    "F": includesMany(["bottom", "right"]),
  };

  const pipe = Object.entries(pipes).flatMap(([pipe, isAnimal]) => isAnimal ? pipe : [])[0] as Pipe;

  return pipe;
};





const inside = new Set<string>();
loopMatrix(matrix, (matrix, { x, y }) => {

});


const xmple = `OF----7F7F7F7F-7OOOO
O|F--7||||||||FJOOOO
O||OFJ||||||||L7OOOO
FJL7L7LJLJ||LJIL-7OO
L--JOL7IIILJS7F-7L7O
OOOOF-JIIF7FJ|L7L7L7
OOOOL7IF7||L7|IL7L7|
OOOOO|FJLJ|FJ|F7|OLJ
OOOOFJL-7O||O||||OOO
OOOOL---JOLJOLJLJOOO`;

const x = xmple.replaceAll("O", "").replaceAll("I", "").length;
// console.log({ x });

const renderPositions = (matrix: Matrix, positions: [Set<string>, string][]) => {
  const mask = positions.reverse().reduce<Record<string, string>>((acc, [hashes, color]) => {
    hashes.forEach(hash => {
      acc[hash] = acc[hash] ?? color;
    });

    return acc;
  }, {});

  for (let y=0; y<matrix.length; y++) {
    for (let x=0; x<matrix[y].length; x++) {
      const tile = matrix?.[y]?.[x];
      const h = hash({ x, y });
      
      const color = mask[h] ?? "";
      process.stdout.write(color);
      process.stdout.write(tile);
      process.stdout.write(COLOR.RESET);
    }

    console.log();
  }
  console.log();
};

enum COLOR {
  RESET     = "\x1b[0m",

  FgBlack   = "\x1b[30m",
  FgRed     = "\x1b[31m",
  FgGreen   = "\x1b[32m",
  FgYellow  = "\x1b[33m",
  FgBlue    = "\x1b[34m",
  FgMagenta = "\x1b[35m",
  FgCyan    = "\x1b[36m",
  FgWhite   = "\x1b[37m",
  FgGray    = "\x1b[90m",

  BgBlack   = "\x1b[40m",
  BgRed     = "\x1b[41m",
  BgGreen   = "\x1b[42m",
  BgYellow  = "\x1b[43m",
  BgBlue    = "\x1b[44m",
  BgMagenta = "\x1b[45m",
  BgCyan    = "\x1b[46m",
  BgWhite   = "\x1b[47m",
  BgGray    = "\x1b[100m",
};

// Object.values(COLOR).forEach(color => renderPositions([[visited, color]]));

// renderPositions(matrix, [[visited, COLOR.FgRed]]);
// renderPositions(matrix, [[visited, COLOR.BgRed]]);

const pipe = mapAnimalToPipe(matrix);
console.log({ pipe });
const rawMatrix = input.replace("S", pipe).split("\n").filter(Boolean).map(row => row.split(""));
renderPositions(rawMatrix, [[visited, COLOR.FgRed]]);
console.log(visited.size);


const pipes = ["|", "-", "L", "J", "7", "F"];
const horizontalPipes = pipes.filter(p => p !== "-");
const verticalPipes = pipes.filter(p => p !== "|");

const isHorizontal = (tile: string, hash: string) => visited.has(hash) && horizontalPipes.includes(tile);
const isVertical = (tile: string, hash: string) => visited.has(hash) && verticalPipes.includes(tile);

const rows = rawMatrix.map((row, y) => row.map((tile, x) => ({tile, hash: hash({ x, y }) })));
const cols = rawMatrix[0].map((_, x) => rawMatrix.map((row, y) => ({ tile: row[x], hash: hash({ x, y }) })));

// console.log(rows);
// console.log();
// console.log(cols);

// filter rows and cols ({[]})
// intersection

const horizontalHashes = rows.flatMap((row) => {
  const inner = [];
  let opened = false;
  for (let i=0; i<row.length; i++) {
    const { tile, hash } = row[i];
    
    if (isHorizontal(tile, hash)) {
      opened = !opened;
    }

    if(!visited.has(hash) && opened) inner.push(row[i]);
  }
  return inner.map(x => x.hash);
});


renderPositions(rawMatrix, [[visited, COLOR.FgRed], [new Set(horizontalHashes), COLOR.BgBlue]]);

const verticalHashes = cols.flatMap((row) => {
  const inner = [];
  let opened = false;
  for (let i=0; i<row.length; i++) {
    const { tile, hash } = row[i];
    
    if (isVertical(tile, hash)) {
      opened = !opened;
    }

    if(!visited.has(hash) && opened) inner.push(row[i]);
  }
  return inner.map(x => x.hash);
});

renderPositions(rawMatrix, [[visited, COLOR.FgRed], [new Set(verticalHashes), COLOR.BgMagenta]]);

const vert = [...new Set(verticalHashes)];
const hor = new Set(horizontalHashes);
const intersection = vert.filter(v => hor.has(v));
console.log(intersection)

renderPositions(rawMatrix, [[new Set(intersection), COLOR.BgMagenta]]);

const intersectionSet = new Set(intersection);
const answer = intersectionSet.size;
console.log(answer);