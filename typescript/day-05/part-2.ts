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

console.log(maps);
console.log({ seeds });
type SeedRange = [number, number];
const toPairs = (seeds: number[]): SeedRange[] => {
  const chunkSize = 2;
  const chunks: SeedRange[] = [];
  for (let i=0; i<seeds.length; i=i+chunkSize) {
    const [a,b] = seeds.slice(i, i+chunkSize);
    const chunk: [number, number] = [a, b];
    chunks.push(chunk);
  }
  return chunks;
};
const seedPairs = toPairs(seeds);
console.log({ seedPairs });



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

// const soils = seeds.map(seed => mapXY(seed, maps[0]));
// console.log({ soils });



// const getLocation = (seed: number) => maps.reduce((seed, ranges) => mapXY(seed, ranges), seed);
// const locations = seeds.map(getLocation);
// console.log({ locations });
// console.log(Math.min(...locations));



// evaluate seed one by one and accumulate minimum.
const getMinLocationForSeedRange = ([start, length]: SeedRange, rangeMaps: RangeMap[][]) => {
  let minLocation = Infinity;
  const total = start + length; // -1
  
  console.log({ start, length, total: start+length });
  
  for(let seed = start; seed < total; seed++){
    const location = rangeMaps.reduce((seed, ranges) => mapXY(seed, ranges), seed);
    minLocation = Math.min(minLocation, location);
    
    // const perc = (seed/total) * 100;
    // const progress = toInt(perc.toFixed(0));
    // if (progress % 2 === 0) console.log(`${progress} %`);
    // // console.log({ seed, location, minLocation })

  }

  return minLocation;
};


// const min = getMinLocationForSeedRange(seedPairs[0], maps);
const minLocations = seedPairs.map(pair => getMinLocationForSeedRange(pair, maps));
console.log({ minLocations });
console.log(Math.min(...minLocations));







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