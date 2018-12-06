function printSpace(space, maxX, maxY) {
  const index = (x, y) => y * maxX + x;

  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      const c = space[index(x, y)];
      process.stdout.write(c === -1 ? ' ' : (c === -2 ? '.' : String.fromCharCode('a'.charCodeAt(0) + c)));
    }
    console.log('');
  }
}

function dist(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function part1(lines) {
  const coords = lines.map(line => /^(\d+), (\d+)$/.exec(line))
    .map(([, x, y]) => ({ x: parseInt(x), y: parseInt(y) }));

  let minX = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, minY = Number.POSITIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY;

  for (const coord of coords) {
    minX = Math.min(minX, coord.x);
    maxX = Math.max(maxX, coord.x);
    minY = Math.min(minY, coord.y);
    maxY = Math.max(maxY, coord.y);
  }

  maxX = maxX - minX + 3;
  maxY = maxY - minY + 3;

  const index = (x, y) => y * maxX + x;
  const space = new Array(maxX * maxY);
  space.fill(-1);

  for (let i = 0; i < coords.length; i++) {
    const c = coords[i];
    c.x -= minX - 1;
    c.y -= minY - 1;
    space[index(c.x, c.y)] = i;
  }

  const map = new Map();
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      let min = Number.POSITIVE_INFINITY;
      let minId = -1;

      for (let i = 0; i < coords.length; i++) {
        const c = coords[i];
        const d = dist(x, y, c.x, c.y);

        if (d < min) {
          min = d;
          minId = i;
        } else if (d === min) {
          min = d;
          minId = -2;
        }
      }

      map.set(minId, (map.get(minId) || 0) + 1);
      space[index(x, y)] = minId;
    }
  }

  for (let x = 0; x < maxX; x++) {
    map.delete(space[index(x, 0)]);
    map.delete(space[index(x, maxY - 1)]);
  }

  for (let y = 0; y < maxX; y++) {
    map.delete(space[index(0, y)]);
    map.delete(space[index(maxX - 1, y)]);
  }

  // printSpace(space, maxX, maxY);

  return Array.from(map.entries()).sort(([, count1], [, count2]) => count2 - count1)[0][1];
}

function part2(lines) {
  const coords = lines.map(line => /^(\d+), (\d+)$/.exec(line))
    .map(([, x, y]) => ({ x: parseInt(x), y: parseInt(y) }));

  let minX = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, minY = Number.POSITIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY;

  for (const coord of coords) {
    minX = Math.min(minX, coord.x);
    maxX = Math.max(maxX, coord.x);
    minY = Math.min(minY, coord.y);
    maxY = Math.max(maxY, coord.y);
  }

  maxX = maxX - minX + 1;
  maxY = maxY - minY + 1;

  for (let i = 0; i < coords.length; i++) {
    const c = coords[i];
    c.x -= minX;
    c.y -= minY;
  }

  let result = 0;
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      let sum = 0;

      for (let i = 0; i < coords.length; i++) {
        const c = coords[i];
        sum += dist(x, y, c.x, c.y);
      }

      if (sum < 10000) {
        result++;
      }
    }
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