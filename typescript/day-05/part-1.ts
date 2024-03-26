import { loadInput, toInt } from "../utils";

// Todo: put test_input into a "test" file.
const test_input = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;


// const input = test_input;
const input = loadInput("input");
const [seedChunk, ...chunks] = input.split("\n\n").map(chunk => chunk.split("\n")); //.filter(Boolean);

const seeds = seedChunk[0].replace("seeds: ", "").trim().split(" ").map(toInt);

type Mapping = Record<number, number>; // results
const getMapping = (mapping: Mapping, num: number) => mapping[num] ?? num;

type RangeMap = [number, number, number];
/**/ const toRangeMap = ([a,b,c]: number[]): RangeMap => [a,b,c];

// const maps = chunks.map(chunk => chunk.filter((_, i) => i !== 0).map(nums => nums.split(" ").map(toInt)));
const maps: RangeMap[][] = chunks.map(chunk => chunk.filter((_, i) => i !== 0).map(nums => toRangeMap(nums.split(" ").map(toInt))));
// console.log(maps);

/*************************************************************************************************************/
const mapXY = (x: number, ranges: RangeMap[]) => {
  const validRanges = ranges.filter(([destination, source, length]) => 
    x >= source && x <= source + length -1
  );
  // console.log(validRanges)
  
  const theRange = validRanges.shift();

  if (theRange === undefined) return x;
  
  // map to destination
  const [destination, source] = theRange;
  
  const delta = destination - source;
  
  return x + delta;
  
};

const soils = seeds.map(seed => mapXY(seed, maps[0]));
console.log({ soils });

const getLocation = (seed: number) => maps.reduce((seed, ranges) => mapXY(seed, ranges), seed);
const locations = seeds.map(getLocation);
console.log({ locations });
console.log(Math.min(...locations));

type Range = { destination: number[], source: number[] };

const getRange = (src: number, length: number) => { 
  // console.log({ length }); // this fucks up memory.
  return Array.from({ length }, (_, i) => src + i);
}

const mapRanges = ([destination, source, length]: RangeMap): Range => ({
  destination: getRange(destination, length),
  source: getRange(source, length),
});

// prolly part 2 needs lazy evaluation.
const rangeToMapping = ({ source, destination }: Range) => source.reduce<Mapping>((acc, num, i) => {
  acc[num] = destination[i];
  return acc;
}, {});
/*************************************************************************************************************/






// console.log("dupa");
// const mappings = maps.map(m => m.map(dsl => mapRanges(toRangeMap(dsl))).reduce<Mapping>((acc, range) => ({ ...acc, ...rangeToMapping(range) }), {}));
// // console.log({ mappings });

// const demapLocation = (seed: number, mappings: Mapping[]) => {
//   return mappings.reduce((prevSeed, mapping) => getMapping(mapping, prevSeed), seed);
// };

// const getLocations = (seeds: number[], mappings: Mapping[]) => seeds.map(seed => demapLocation(seed, mappings));
// const locations = getLocations(seeds, mappings);
// // console.log({ locations });
// console.log(Math.min(...locations));












// Debug
// const soil2fertilizerMap = maps[1].map(dsl => mapRanges(toRangeMap(dsl)));
// const fertilizerMapping = soil2fertilizerMap.reduce<Mapping>((acc, range) => ({ ...acc, ...rangeToMapping(range) }), {});
// const x = seeds.map(seed => getMapping(fertilizerMapping, seed));
// console.log({ x });