import { loadInput, toInt } from "../utils";

// Todo: put test_input into a "test" file.
const test_input = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

// const input = test_input;
const input = loadInput("input");
const rows = input.split("\n").filter(Boolean);

const cards = rows.map(row => {
  const [head, tail] = row.split(": ");
  const cardId = toInt(head.replace("Card ", "").trim());

  const [winning, owned] = tail.trim().split(" | ")
    .map(nums => nums.split(" ").filter(x => x.trim().length).map(toInt));

  return { cardId, winning, owned };
});

const howManyOverlap = (winning: number[], owned: number[]) => owned.filter(own => winning.includes(own)).length;

const overlaps = cards.map(({ cardId, winning, owned }) => [cardId, howManyOverlap(winning, owned)]);
const ScratchCards: Record<number, number> = Object.fromEntries(overlaps);

const getCardIdsForId = (id: number) => Array.from({ length: ScratchCards[id] }, (_, i) => id+i+1);

interface Card {
  id: number;
  score: number;
}

const Cards: Card[] = overlaps.map(([id, score]) => ({ id, score }));
const copyCard = (id: number): Card => ({ id, score: ScratchCards[id] });

let resolvedCounter = 0;

// Card interface and mapping might not be needed.
const resolveCard = ({ id, score }: Card) => {
  resolvedCounter++;
  const ids = getCardIdsForId(id);

  const cards = ids.map(copyCard);
  cards.forEach(card => resolveCard(card));
};

Cards.forEach(card => resolveCard(card));

console.log(resolvedCounter);
