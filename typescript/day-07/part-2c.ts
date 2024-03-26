import { loadInput, sum, toInt } from "../utils";

// Todo: put test_input into a "test" file.
const test_input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const test = true;
// const input = test !== undefined ? test_input : loadInput("input");
const input = test_input;
// const input = loadInput("input"); // 249896232 nope; 249745563 nope;
const rows = input.split("\n").filter(Boolean);

const tiers = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"].reverse();

type Card = [string, number]; // cards, bid
const cards: Card[] = rows.map(row => {
  const [card, bid] = row.split(" ");
  return [card, toInt(bid)];
});

// console.log(cards);

const countDuplicates = (arr: string[]) => arr.reduce<Record<string, number>>((acc, value) => ({
  ...acc,
  [value]: (acc[value] ?? 0) + 1
}), {});

type TypedCard = [string, number, number]; // cards, bid, type


// Top tier code here xd
const getType = ([cards]: Card): 6|5|4|3|2|1|0 => {
  const xs = cards.split("");
  const counts = Object.values(countDuplicates(xs));

  // Five of a kind
  if (counts.some(c => c === 5)) return 6; // new Set(xs).size === 1;

  // Four of a kind
  if (counts.some(c => c === 4)) return 5;

  // Full house - Three & Two
  if (counts.includes(3) && counts.includes(2)) return 4;
  
  // Three of a kind
  if (counts.includes(3) && counts.filter(c => c === 1).length === 2) return 3;
  
  // Two pair
  if (counts.filter(c => c === 2).length === 2) return 2;
  
  // One pair
  if (counts.filter(c => c === 2).length === 1) return 1;
  
  // High card
  return 0;
};

const getJokerizedType = (card: Card) => {
  const oldType = getType(card);

  const xs = card[0].split("");
  const dupes = countDuplicates(xs);
  const counts = Object.values(dupes);
  
  const jokers = dupes["J"] ?? 0;
  if (jokers === 0) return oldType;

   // Five of a kind
   // Four of a kind
   // Full house - Three & Two
   // Three of a kind
   // Two pair
   // One pair
   // High card





  switch(oldType) {
    case 6: {
      return 6;
    }
    case 5: {
      if (jokers === 1) return 6;
      return 5;
    }
    case 4: {
      if (jokers === 1) return 5;
      if (jokers === 2) return 6;
      return 4;
    }
    case 3: {
      if (jokers === 1) return 5;
      if (jokers === 2) return 6;
      return 3;
    }
    case 2: {
      if (jokers === 1) return 4;
      if (jokers === 2) return 5;
      return 2;
    }
    case 1: {
      if (jokers === 1) return 3;
      return 1;
    }
    case 0: {
      if (jokers === 1) return 1; // 249745563
    }
    default: {
      return oldType;
      // throw new Error(`Wrong type ${oldType}`);
    }
  }
  
};

const toTypedCard = ([cards, bid]: Card): TypedCard => {
  // const x: TypedCard = [cards, bid, getType([cards, bid])];
  const x: TypedCard = [cards, bid, getJokerizedType([cards, bid])];
  console.log({ x });
  return x;
};

const typedCards = cards.map(toTypedCard);
// console.log("\n");
// toTypedCard(["AAAAA", 0]);

// return value?
// High Card.
const compareCards = (a: TypedCard, b: TypedCard): number => {
  const xs = a[0].split("").map(x => tiers.indexOf(x))
  const ys = b[0].split("").map(y => tiers.indexOf(y));
  
  for(let i=0; i<xs.length; i++) {
    const x = xs[i];
    const y = ys[i];
    if (x === y) continue;
    return x > y ? 1 : -1;
  }
  return 1;
};

// compareCards(cards[0], cards[1]);

type RankedCard = [string, number, number, number]; // cards, bid, type, rank

const groups: Record<number, TypedCard[]> = {
  0: typedCards.filter(([,, type]) => type === 0),
  1: typedCards.filter(([,, type]) => type === 1),
  2: typedCards.filter(([,, type]) => type === 2),
  3: typedCards.filter(([,, type]) => type === 3),
  4: typedCards.filter(([,, type]) => type === 4),
  5: typedCards.filter(([,, type]) => type === 5),
  6: typedCards.filter(([,, type]) => type === 6),
};

console.log(groups);

const sorted = Object.values(groups).map(typeGroups => {
  const sorted = typeGroups.sort(compareCards);
  return sorted;
});

// console.log(sorted);

const hands: RankedCard[] = sorted.flat().map((typedCard, i) => [...typedCard, i+1]);
// console.log(hands);


const getWinnings = (hands: RankedCard[]) => hands.map(([_, bid, type, rank]) => bid * rank);
const totalWinnings = sum(getWinnings(hands));

console.log(totalWinnings);