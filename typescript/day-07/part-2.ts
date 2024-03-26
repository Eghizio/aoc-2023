import { loadInput, sum, toInt } from "../utils";

// Todo: put test_input into a "test" file.
const test_input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;


// const input = test_input; // 5905
const input = loadInput("input"); // 249544402 too low; 249962739 too high; 249521448 too low;
const rows = input.split("\n").filter(Boolean);

const tiers = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"].reverse();

type Card = [string, number]; // cards, bid
const cards: Card[] = rows.map(row => {
  const [card, bid] = row.split(" ");
  return [card, toInt(bid)];
});

// console.log(cards);

/*****************************************************************************/
const countDuplicates = (arr: string[]) => arr.reduce<Record<string, number>>((acc, value) => ({
  ...acc,
  [value]: (acc[value] ?? 0) + 1
}), {});

type TypedCard = [string, number, number]; // cards, bid, type


const countJokers = (xs: string[]) => xs.filter(c => c === "J").length;

// Top tier code here xd just realised i could use sets xd
const isOnePair = (xs: string[]): boolean => {
  const counts = Object.values(countDuplicates(xs));

  const jokers = countJokers(xs);
  const jk = false
    || jokers === 1;
  
  return counts.filter(c => c === 2).length === 1
  || jk;
};

const isTwoPair = (xs: string[]): boolean => {
  const counts = Object.values(countDuplicates(xs));

  const jokers = countJokers(xs);
  const jk = false
    || (counts.filter(c => c === 2).length === 1 && jokers === 1)
    || jokers === 2;
  
  return counts.filter(c => c === 2).length === 2
  || jk;
};

const isThreeOfAKind = (xs: string[]): boolean => {
  const counts = Object.values(countDuplicates(xs));

  const jokers = countJokers(xs);
  const jk = false
    || (counts.filter(c => c === 2).length === 1 && jokers === 1)
    // || jokers === 3; 
  
  return (counts.includes(3) && counts.filter(c => c === 1).length === 2)
  || jk;
};

// testinput: 5905

// Three & Two
const isFullHouse = (xs: string[]): boolean => {
  const counts = Object.values(countDuplicates(xs));
  
  const jokers = countJokers(xs);
  const jk = false
    || (counts.includes(3) && jokers === 1)
    || (counts.includes(2) && jokers === 2)
    || (counts.filter(c => c === 2).length === 2 && jokers === 1)
    || jokers === 3;
    // || jokers === 4  // this gets covered by Five & Four oaK.
    // || jokers === 5; // this gets covered by Five of a kind.

  return (counts.includes(3) && counts.includes(2))
  || jk;
};

const isFourOfAKind = (xs: string[]): boolean => {
  const counts = Object.values(countDuplicates(xs));
  
  const jokers = countJokers(xs);
  const jk = false
    || (counts.some(c => c === 3) && jokers === 1)
    || (counts.some(c => c === 2) && jokers === 2)
    || (counts.some(c => c === 1) && jokers === 3)
    || jokers === 4;

  return counts.some(c => c === 4)
  || jk;
};

const isFiveOfAKind = (xs: string[]): boolean => {
  const counts = Object.values(countDuplicates(xs));

  const jokers = countJokers(xs);
  const jk = false
    || (counts.some(c => c === 4) && jokers === 1)
    || (counts.some(c => c === 3) && jokers === 2)
    || (counts.some(c => c === 2) && jokers === 3)
    || (counts.some(c => c === 1) && jokers === 4)
    || jokers === 5;

  return counts.some(c => c === 5)
  || jk; // new Set(xs).size === 1;
};

const checkJokers = (xs: string[]): number | null => {
  // const jokers = countJokers(xs);
  // if(jokers === 5) return 6;
  // tbd?
  return null;
};

// [
//   "JJJJJ",
//   "JJJJA",
//   "JJJAA",
//   "JJAAA",
//   "JAAAA",
// ].forEach(card => console.log("__chuj__", checkJokers(card.split(""))));



const getType = ([cards]: Card): number => {
  const xs = cards.split("");

  // if fails, maybe we just need to precheck joker cases here, all 6 cases
  // const jokers = checkJokers(xs);
  // if (jokers !== null) return jokers;

  // mlg code xd
  if (isFiveOfAKind(xs)) return 6;
  if (isFourOfAKind(xs)) return 5;
  if (isFullHouse(xs)) return 4;
  if (isThreeOfAKind(xs)) return 3;
  if (isTwoPair(xs)) return 2;
  if (isOnePair(xs)) return 1;  
  return 0;
};
const toTypedCard = ([cards, bid]: Card): TypedCard => [cards, bid, getType([cards, bid])];

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

/*****************************************************************************/

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

// console.log(groups);

const sorted = Object.values(groups).map(typeGroups => {
  const sorted = typeGroups.sort(compareCards);
  return sorted;
});

// console.log(sorted);

const hands: RankedCard[] = sorted.flat().map((typedCard, i) => [...typedCard, i+1]);
// console.log(hands)


const getWinnings = (hands: RankedCard[]) => hands.map(([_, bid, type, rank]) => bid * rank);
const totalWinnings = sum(getWinnings(hands));

console.log(totalWinnings);