import { loadInput, sum, toInt } from "../utils";


type Color = "red" | "green" | "blue";
type CensusRGB = Record<Color, number>;
type RGB = [number, number, number];

const toColor = (colour: string): Color => {
  switch (colour) {
    case "red": return "red";
    case "green": return "green";
    case "blue": return "blue";
    default: throw new Error(`Invalid color: ${colour}!`);
  }
};

const getColorsPerGameSet = (gameSet: string) => {
  const cubes = gameSet.split(", ");
  
  return cubes.reduce<CensusRGB>((acc, cube) => {
    const [amount, colour] = cube.split(" ");
    const num = toInt(amount);
    const color = toColor(colour);
    acc[color] = num;
    return acc;
  }, {} as CensusRGB);
};

const toRGB = ({ red, green, blue }: CensusRGB): RGB => [red ?? 0, green ?? 0, blue ?? 0];

const input = loadInput("input");
const rows = input.split("\n").filter(Boolean);

const LIMIT: CensusRGB = { red: 12, green: 13, blue: 14 };

const gameSets = rows.map(row => row.split(": ")[1].split("; "));
const colorsPerGameSet = gameSets.map(sets => sets.map(getColorsPerGameSet));
const rgbs = colorsPerGameSet.map(censuses => censuses.map(toRGB));

const limit = toRGB(LIMIT);
const isPossibleGameSet = (game: RGB) => limit.every((lc, i) => game[i] <= lc);

const isGamePossible = rgbs.map(sets => sets.every(isPossibleGameSet));
const ids = isGamePossible.flatMap((possible, i) => possible ? i+1 : []);

console.log(sum(ids));
