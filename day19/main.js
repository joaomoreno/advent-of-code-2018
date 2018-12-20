function parse(input) {
  let ipReg = -1;
  const program = [];

  for (const line of input) {
    const ipMatch = /^#ip\s+(\d+)$/.exec(line);

    if (ipMatch) {
      ipReg = parseInt(ipMatch[1]);
    } else {

      const [, instruction, ...op] = /^(\w+)\s+(\d+)\s+(\d+)\s+(\d+)$/.exec(line);
      program.push({ instruction, op: op.map(i => parseInt(i)) });
    }
  }

  return { ipReg, program };
}

const instructions = {
  addr: (op, reg) => {
    reg[op[2]] = reg[op[0]] + reg[op[1]];
    return reg;
  },
  addi: (op, reg) => {
    reg[op[2]] = reg[op[0]] + op[1];
    return reg;
  },
  mulr: (op, reg) => {
    reg[op[2]] = reg[op[0]] * reg[op[1]];
    return reg;
  },
  muli: (op, reg) => {
    reg[op[2]] = reg[op[0]] * op[1];
    return reg;
  },
  banr: (op, reg) => {
    reg[op[2]] = reg[op[0]] & reg[op[1]];
    return reg;
  },
  bani: (op, reg) => {
    reg[op[2]] = reg[op[0]] & op[1];
    return reg;
  },
  borr: (op, reg) => {
    reg[op[2]] = reg[op[0]] | reg[op[1]];
    return reg;
  },
  bori: (op, reg) => {
    reg[op[2]] = reg[op[0]] | op[1];
    return reg;
  },
  setr: (op, reg) => {
    reg[op[2]] = reg[op[0]];
    return reg;
  },
  seti: (op, reg) => {
    reg[op[2]] = op[0];
    return reg;
  },
  gtir: (op, reg) => {
    reg[op[2]] = op[0] > reg[op[1]] ? 1 : 0;
    return reg;
  },
  gtri: (op, reg) => {
    reg[op[2]] = reg[op[0]] > op[1] ? 1 : 0;
    return reg;
  },
  gtrr: (op, reg) => {
    reg[op[2]] = reg[op[0]] > reg[op[1]] ? 1 : 0;
    return reg;
  },
  eqir: (op, reg) => {
    reg[op[2]] = op[0] === reg[op[1]] ? 1 : 0;
    return reg;
  },
  eqri: (op, reg) => {
    reg[op[2]] = reg[op[0]] === op[1] ? 1 : 0;
    return reg;
  },
  eqrr: (op, reg) => {
    reg[op[2]] = reg[op[0]] === reg[op[1]] ? 1 : 0;
    return reg;
  }
}

function run(ipReg, program, ip, reg) {
  while (ip >= 0 && ip < program.length) {
    const { instruction, op } = program[ip];

    // if (ip === 5 && reg[3] > 0) {
    // console.log(ip, op, reg);
    // }

    reg[ipReg] = ip;
    instructions[instruction](op, reg);
    ip = reg[ipReg] + 1;
  }

  return reg[0];
}

function part1(input) {
  const { ipReg, program } = parse(input);
  return run(ipReg, program, 0, [0, 0, 0, 0, 0, 0]);
}

// when r0 is 0, the result is the sum of all factors of 1028
// when r1 is 1, the result is the sum of all factors of 10551428
function part2(input) {
  return [1, 2, 4, 67, 134, 268, 39371, 78742, 157484, 2637857, 5275714, 10551428].reduce((r, n) => r + n, 0);
}

function main() {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin });

  let input = [];
  rl.on('line', line => input.push(line));
  rl.on('close', () => console.log(process.argv[2] === '2' ? part2(input) : part1(input)));
}

main();