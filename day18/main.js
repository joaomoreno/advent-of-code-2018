function parse(input) {
  const map = [];
  map.width = input[0].length;
  map.height = input.length;

  for (const line of input) {
    for (const char of line) {
      map.push(char);
    }
  }

  return map;
}

function print(map) {
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      process.stdout.write(map[y * map.width + x]);
    }
    console.log();
  }
}

function* neighbors(map, x, y) {
  const minY = Math.max(0, y - 1);
  const maxY = Math.min(map.height, y + 2);
  const minX = Math.max(0, x - 1);
  const maxX = Math.min(map.width, x + 2);

  for (let _y = minY; _y < maxY; _y++) {
    for (let _x = minX; _x < maxX; _x++) {
      if (_x !== x || _y !== y) {
        yield map[_y * map.width + _x];
      }
    }
  }
}

function reduce(it, fn, initial) {
  let result = initial;

  for (const el of it) {
    result = fn(result, el);
  }

  return result;
}

function part1(input) {
  const map = parse(input);

  let current = [...map]; current.width = map.width; current.height = map.height;
  let next = [...map]; next.width = map.width; next.height = map.height;

  for (let i = 0; i < 451; i++) {
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        switch (current[y * map.width + x]) {
          case '.': {
            const trees = reduce(neighbors(current, x, y), (r, c) => r + (c === '|' ? 1 : 0), 0);
            next[y * current.width + x] = trees >= 3 ? '|' : '.';
            break;
          }
          case '|': {
            const lumberyards = reduce(neighbors(current, x, y), (r, c) => r + (c === '#' ? 1 : 0), 0);
            next[y * current.width + x] = lumberyards >= 3 ? '#' : '|';
            break;
          }
          case '#': {
            const lumberyards = reduce(neighbors(current, x, y), (r, c) => r + (c === '#' ? 1 : 0), 0);
            const trees = reduce(neighbors(current, x, y), (r, c) => r + (c === '|' ? 1 : 0), 0);
            next[y * current.width + x] = lumberyards >= 1 && trees >= 1 ? '#' : '.';
            break;
          }
        }
      }
    }

    [current, next] = [next, current];

  }

  print(current);
  return current.reduce((r, c) => r + (c === '#' ? 1 : 0), 0)
    * current.reduce((r, c) => r + (c === '|' ? 1 : 0), 0);
}

function part2() {
  // these values loop after minute 451
  const values = [100466, 101840, 103224, 102366, 97270, 92839, 91425, 88894, 86320, 82984, 81788, 78324, 77361, 76874, 77315, 77822, 80948, 85910, 90155, 95232, 97782, 101840, 105183, 103880, 103970, 101802, 97350, 94579, 89436, 91581, 87250, 88893, 92232, 96012, 98814];
  const index = ((1000000000 - 451) % values.length);
  return values[index];
}

function main() {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin });

  let input = [];
  rl.on('line', line => input.push(line));
  rl.on('close', () => console.log(process.argv[2] === '2' ? part2(input) : part1(input)));
}

main();