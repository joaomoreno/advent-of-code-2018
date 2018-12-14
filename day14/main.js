function part1(lines) {
  const input = parseInt(lines[0]);
  const recipes = [3, 7];
  let a = 0;
  let b = 1;

  while (recipes.length < input + 10) {
    const sum = recipes[a] + recipes[b];
    const digits = `${sum}`.split('').map(d => parseInt(d));
    recipes.push(...digits);

    a = (a + recipes[a] + 1) % recipes.length;
    b = (b + recipes[b] + 1) % recipes.length;
  }

  return recipes.slice(input, input + 10).join('');
}

function part2(lines) {
  const input = lines[0];
  const recipes = [3, 7];
  let a = 0;
  let b = 1;

  while (true) {
    const sum = recipes[a] + recipes[b];
    const digits = `${sum}`.split('');

    for (const digit of digits) {
      recipes.push(parseInt(digit));

      if (recipes.slice(recipes.length - input.length).join('') === input) {
        return recipes.length - input.length;
      }
    }

    a = (a + recipes[a] + 1) % recipes.length;
    b = (b + recipes[b] + 1) % recipes.length;
  }
}

function main() {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin });

  let lines = [];
  rl.on('line', line => lines.push(line));
  rl.on('close', () => console.log(process.argv[2] === '2' ? part2(lines) : part1(lines)));
}

main();