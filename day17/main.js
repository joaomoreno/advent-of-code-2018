const { createCanvas } = require('canvas');
const fs = require('fs');

function print(game) {
  for (let y = 0; y < game.map.length; y++) {
    const row = game.map[y];
    for (let x = 0; x < row.length; x++) {
      process.stdout.write(row[x]);
    }
    process.stdout.write('\n');
  }
}

const shift = 0;

function getCanvas(game, sources) {
  function isSource(x, y) {
    return sources.some(s => x === s[0] && y === s[1]);
  }

  const canvas = createCanvas(game.map[0].length, game.map.length - shift);
  const ctx = canvas.getContext('2d');

  for (let y = 0; y < game.map.length - shift; y++) {
    const row = game.map[y + shift];

    for (let x = 0; x < row.length; x++) {
      if (isSource(x, y + shift)) {
        ctx.fillStyle = 'red';
      } else {
        switch (row[x]) {
          case '|':
            ctx.fillStyle = 'green';
            break;
          case '~':
            ctx.fillStyle = 'blue';
            break;
          case '#':
            ctx.fillStyle = 'black';
            break;
          default:
            ctx.fillStyle = 'white';
            break;
        }
      }

      ctx.fillRect(x, y, 1, 1);
    }
  }

  return canvas;
}

function parse(input) {
  const ranges = [];
  let minX = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY;

  for (const line of input) {
    let [, a, minA, minB, maxB] = /^(\w)=(\d+), \w=(\d+)..(\d+)$/.exec(line);
    let maxA = minA;

    [minA, maxA, minB, maxB] = [parseInt(minA), parseInt(maxA), parseInt(minB), parseInt(maxB)];

    if (a === 'y') {
      [minA, maxA, minB, maxB] = [minB, maxB, minA, maxA];
    }

    ranges.push([minA, maxA, minB, maxB]);
    minX = Math.min(minX, minA);
    maxX = Math.max(maxX, maxA);
    minY = Math.min(minY, minB);
    maxY = Math.max(maxY, maxB);
  }

  minX--;
  maxX++;
  maxY++;

  const source = [500 - minX, minY];
  const map = [];

  for (let i = 0; i < maxY; i++) {
    const row = new Array(maxX - minX + 1);
    row.fill('.');
    map.push(row);
  }

  for (const range of ranges) {
    for (let y = range[2]; y <= range[3]; y++) {
      for (let x = range[0]; x <= range[1]; x++) {
        map[y][x - minX] = '#';
      }
    }
  }

  map[source[1]][source[0]] = '|';

  return { map, source };
}

function above(coord) {
  return [coord[0], coord[1] - 1];
}

function below(coord) {
  return [coord[0], coord[1] + 1];
}

function flow(game) {
  const sources = [game.source];

  while (sources.length > 0) {
    const current = sources.shift();

    if (game.map[current[1]][current[0]] === '~') {
      continue;
    }

    const next = below(current);

    if (next[1] >= game.map.length) {
      continue;
    }

    const nextChar = game.map[next[1]][next[0]];

    if (nextChar === '.') {
      game.map[next[1]][next[0]] = '|';
      sources.unshift(next);

    } else if (nextChar === '#' || nextChar === '~') {
      const nextSources = [];
      const range = [current[0], current[0] + 1];
      let type = '~';

      for (const next of [x => x + 1, x => x - 1]) {
        for (let x = next(current[0]); game.map[current[1]][x] !== '#'; x = next(x)) {
          range[0] = Math.min(range[0], x);
          range[1] = Math.max(range[1], x + 1);

          const under = below([x, current[1]]);
          const underChar = game.map[under[1]][under[0]];

          if (underChar === '|') {
            break;
          } else if (underChar === '.') {
            type = '|';
            nextSources.push([x, current[1]]);
            break;
          }
        }
      }

      for (let x = range[0]; x < range[1]; x++) {
        game.map[current[1]][x] = type;
      }

      if (type === '~') {
        sources.unshift(above(current));
      } else {
        sources.unshift(...nextSources);
      }
    }
  }
}

function part1(input) {
  const game = parse(input);
  flow(game);

  // const canvas = getCanvas(game, sources);
  // canvas.createPNGStream().pipe(fs.createWriteStream(`out.png`));

  return game.map.reduce((r, l) => r + l.reduce((r, c) => r + (c === '|' || c === '~' ? 1 : 0), 0), 0);
}

function part2(input) {
  const game = parse(input);
  flow(game);

  // const canvas = getCanvas(game, sources);
  // canvas.createPNGStream().pipe(fs.createWriteStream(`out.png`));

  return game.map.reduce((r, l) => r + l.reduce((r, c) => r + (c === '~' ? 1 : 0), 0), 0);
}

function main() {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin });

  let input = [];
  rl.on('line', line => input.push(line));
  rl.on('close', () => console.log(process.argv[2] === '2' ? part2(input) : part1(input)));
}

main();