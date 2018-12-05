function reduce(polymer, markers) {
  function next(i) {
    do {
      i++;
    } while (i < polymer.length && !markers[i]);

    return i;
  }

  function prev(i) {
    do {
      i--;
    } while (i >= 0 && !markers[i]);

    return i;
  }

  let total = polymer.length;

  let i;
  for (let j = next(0); j < polymer.length; j = next(j)) {
    i = prev(j);

    while (i >= 0 && j < polymer.length && polymer[i].toLowerCase() === polymer[j].toLowerCase() && polymer[i] !== polymer[j]) {
      markers[i] = false;
      markers[j] = false;
      i = prev(i);
      j = next(j);
      total -= 2;
    }
  }

  return total;
}

function part1(lines) {
  const polymer = lines[0];
  const markers = new Array(polymer.length);
  markers.fill(true);

  return reduce(polymer, markers);
}

function part2(lines) {
  let result = Number.POSITIVE_INFINITY;
  const polymer = lines[0];
  const set = new Set();

  for (let i = 0; i < polymer.length; i++) {
    const lowercase = polymer[i].toLowerCase();

    if (set.has(lowercase)) {
      continue;
    }

    set.add(lowercase);

    const markers = new Array(polymer.length);
    markers.fill(true);
    let diff = 0;

    for (let j = i; j < polymer.length; j++) {
      if (lowercase === polymer[j].toLowerCase()) {
        markers[j] = false;
        diff++;
      }
    }

    result = Math.min(result, reduce(polymer, markers) - diff);
  }

  return result;
}

function main() {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin });

  let lines = [];
  rl.on('line', line => lines.push(line));
  rl.on('close', () => console.log(part2(lines)));
}

main();