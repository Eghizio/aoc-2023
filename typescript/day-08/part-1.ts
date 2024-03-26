import { loadInput } from "../utils";


// Todo: put test_input into a "test" file.
const test_input = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const test_input2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;


// const input = test_input;
// const input = test_input2;
const input = loadInput("input");
const [directions, ...rows] = input.split("\n").filter(Boolean);

type Node = {
  value: string;
  left: string;
  right: string;
};

const toNode = (row: string): Node => {
  const [value, branches] = row.split(" = ");
  const [left, right] = branches.replace("(", "").replace(")", "").split(", ");
  return { value, left, right };
};

// const nodes = rows.map(toNode).reduce<Record<string, Node>>((acc, node) => {
//   acc[node.value] = node;
//   return acc;
// }, {});

const nodes = new Map<string, Node>(
  rows.map(toNode).map((node) => [node.value, node])
);

const getNode = (key: string): Node => {
  const node = nodes.get(key);
  if (node === undefined) throw new Error(`Could not find node: ${key}`);
  return node;
};

type Direction = "left" | "right";
const toDirection = (text: string): Direction => {
  switch (text.charAt(0)) {
    case "L": return "left";
    case "R": return "right";
    default: throw new Error(`Unknown direction: ${text.charAt(0)}`);
  }
};

const directionGenerator = (directions: string): (() => Direction) => {
  let i = 0;
  const len = directions.length;

  return () => {
    const dir = toDirection(directions[i]);
    i = (i+1) % len;
    return dir;
  };
};

const getNextDirection = directionGenerator(directions);

const nodeKey = { start: "AAA", finish: "ZZZ" };
let current = getNode(nodeKey.start);
let steps = 0;

console.log(nodes);
console.log(directions);
console.log("Start: ", directions[0], current);

while (current.value !== nodeKey.finish) {
  steps++;
  const direction = getNextDirection();
  const nextNode = getNode(current[direction]);
  
  // console.log({ steps, direction, current, nextNode });

  current = nextNode;
}

console.log({ steps, current });
