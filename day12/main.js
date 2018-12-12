function str(state) {
  return state.map(v => v ? '#' : '.').join('');
}

function parseInput(lines) {
  const state = [];
  const raw = /^initial state: (.*)$/.exec(lines[0])[1];

  for (let i = 0; i < raw.length; i++) {
    state.push(raw[i] === '#');
  }

  const rules = [];

  for (let i = 2; i < lines.length; i++) {
    const [, rawPattern, rawOutcome] = /^(.{5}) => (.)$/.exec(lines[i]);

    if (rawOutcome === '.') {
      continue;
    }

    const pattern = [];
    for (let j = 0; j < rawPattern.length; j++) {
      pattern.push(rawPattern[j] === '#');
    }

    rules.push({ pattern, outcome: rawOutcome === '#' });
  }

  return { state, rules };
}

function matches(state, min, i, rule) {
  for (let j = 0; j < 5; j++) {
    if (!!state[i + j - 2 - min] !== !!rule.pattern[j]) {
      return false;
    }
  }

  return true;
}

function part1(lines) {
  let { state, rules } = parseInput(lines);
  let min = 0, max = state.length;

  for (let gen = 0; gen < 40; gen++) {
    let newState = [];
    let newMin = min;
    let newMax = max;

    for (let i = min - 2; i < max + 2; i++) {
      let matchedRule = undefined;

      for (const rule of rules) {
        if (matches(state, min, i, rule)) {
          matchedRule = rule;
          break;
        }
      }

      if (!matchedRule || !matchedRule.outcome) {
        if (i >= min) {
          newState.push(false);
        }
      } else {
        newState.push(true);
        newMin = Math.min(i, newMin);
        newMax = Math.max(i, newMax);
      }
    }

    state = newState;
    min = newMin;
    max = newMax;

    console.log(gen, state.reduce((r, v, i) => r + (v ? i + min : 0), 0), state.reduce((r, v) => r + (v ? 1 : 0), 0));
  }

  return state.reduce((r, v, i) => r + (v ? i + min : 0), 0);
}

function part2(lines) {
  const gen120 = '.................................#..##.#..##.#..##.#..##.#......#....#..##.#....#.......#....#.......#....#......#....#..##.#..##.#..##.#......#..##.#..##.#.......#.......#....#....#......#....#..##.#.......#..##.#......#'.split('');

  const sum = gen120.reduce((r, v, i) => r + (v === '#' ? i : 0), 0);
  const count = gen120.reduce((r, v) => r + (v === '#' ? 1 : 0), 0);

  return (50000000000 - 120) * count + sum;
}

function main() {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin });

  let lines = [];
  rl.on('line', line => lines.push(line));
  rl.on('close', () => console.log(process.argv[2] === '2' ? part2(lines) : part1(lines)));
}

main();