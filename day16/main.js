function parse(input) {
  const samples = [];
  const program = [];

  for (let i = 0; i < input.length; i++) {
    const beforeMatch = /^Before:\s+\[(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\]$/.exec(input[i]);

    if (beforeMatch) {
      const before = beforeMatch.slice(1, 5).map(i => parseInt(i));
      const op = input[i + 1].split(' ').map(i => parseInt(i));
      const after = /^After:\s+\[(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\]$/.exec(input[i + 2]).slice(1, 5).map(i => parseInt(i));

      samples.push({ before, op, after });
      i += 2;
    } else if (input[i]) {
      program.push(input[i].split(' ').map(i => parseInt(i)));
    }
  }

  return { samples, program };
}

function addr(op, reg) {
  reg[op[3]] = reg[op[1]] + reg[op[2]];
  return reg;
}

function addi(op, reg) {
  reg[op[3]] = reg[op[1]] + op[2];
  return reg;
}

function mulr(op, reg) {
  reg[op[3]] = reg[op[1]] * reg[op[2]];
  return reg;
}

function muli(op, reg) {
  reg[op[3]] = reg[op[1]] * op[2];
  return reg;
}

function banr(op, reg) {
  reg[op[3]] = reg[op[1]] & reg[op[2]];
  return reg;
}

function bani(op, reg) {
  reg[op[3]] = reg[op[1]] & op[2];
  return reg;
}

function borr(op, reg) {
  reg[op[3]] = reg[op[1]] | reg[op[2]];
  return reg;
}

function bori(op, reg) {
  reg[op[3]] = reg[op[1]];
  return reg;
}

function setr(op, reg) {
  reg[op[3]] = op[1];
  return reg;
}

function seti(op, reg) {
  reg[op[3]] = reg[op[1]] | op[2];
  return reg;
}

function gtir(op, reg) {
  reg[op[3]] = op[1] > reg[op[2]] ? 1 : 0;
  return reg;
}

function gtri(op, reg) {
  reg[op[3]] = reg[op[1]] > op[2] ? 1 : 0;
  return reg;
}

function gtrr(op, reg) {
  reg[op[3]] = reg[op[1]] > reg[op[2]] ? 1 : 0;
  return reg;
}

function eqir(op, reg) {
  reg[op[3]] = op[1] === reg[op[2]] ? 1 : 0;
  return reg;
}

function eqri(op, reg) {
  reg[op[3]] = reg[op[1]] === op[2] ? 1 : 0;
  return reg;
}

function eqrr(op, reg) {
  reg[op[3]] = reg[op[1]] === reg[op[2]] ? 1 : 0;
  return reg;
}

const ops = [addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr];

function arrayEquals(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function part1(input) {
  const { samples } = parse(input);

  return samples
    .map(sample => ops.reduce((r, op) => r + (arrayEquals(op(sample.op, sample.before.slice()), sample.after) ? 1 : 0), 0))
    .filter(r => r >= 3)
    .length;
}

function solve(sets, i = 0, visited = new Set()) {
  if (i === sets.length) {
    return [];
  }

  for (const op of sets[i]) {
    if (visited.has(op)) {
      continue;
    }

    const result = solve(sets, i + 1, new Set([...visited, op]));

    if (result) {
      return [op, ...result];
    }
  }

  return undefined;
}

function part2(input) {
  const { samples, program } = parse(input);
  const sets = ops.map(_ => new Set(ops.map((_, i) => i)));

  for (const sample of samples) {
    for (let i = 0; i < ops.length; i++) {
      const after = ops[i](sample.op, sample.before.slice());

      if (!arrayEquals(after, sample.after)) {
        sets[sample.op[0]].delete(i);
      }
    }
  }

  const map = solve(sets);
  const reg = [0, 0, 0, 0];

  for (const op of program) {
    ops[map[op[0]]](op, reg);
  }

  return reg[0];
}

function main() {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin });

  let input = [];
  rl.on('line', line => input.push(line));
  rl.on('close', () => console.log(process.argv[2] === '2' ? part2(input) : part1(input)));
}

main();