function insertAfter(reference, marble) {
  reference.next.prev = marble;
  marble.next = reference.next;
  reference.next = marble;
  marble.prev = reference;
}

function remove(marble) {
  marble.next.prev = marble.prev;
  marble.prev.next = marble.next;
  marble.prev = null;
  marble.next = null;
}

function next(marble, n = 1) {
  while (n--) {
    marble = marble.next;
  }

  return marble;
}

function prev(marble, n = 1) {
  while (n--) {
    marble = marble.prev;
  }

  return marble;
}

function part1(lines) {
  const match = /^(\d+) players; last marble is worth (\d+) points/.exec(lines[0]);
  const players = parseInt(match[1]);
  const marbles = parseInt(match[2]);

  let current = { value: 0, next: null, prev: null };
  current.next = current;
  current.prev = current;

  const scores = new Array(players);
  scores.fill(0);

  let player = 1;

  for (let value = 1; value <= marbles; value++) {
    if (value % 23 === 0) {
      const marble = prev(current, 7);
      current = marble.next;
      remove(marble);

      scores[player] += value + marble.value;
    } else {
      const marble = { value, next: null, prev: null };
      insertAfter(next(current), marble);
      current = marble;
    }

    player = (player + 1) % players;
  }

  return Math.max(...scores);
}

function part2(lines) {
}

function main() {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin });

  let lines = [];
  rl.on('line', line => lines.push(line));
  rl.on('close', () => console.log(process.argv[2] === '2' ? part2(lines) : part1(lines)));
}

main();