function hundreds(n) {
  return n < 100 ? 0 : Math.floor(n / 100) % 10;
}

function getPower(gsn, x, y) {
  const rackId = x + 1 + 10;
  let power = rackId * (y + 1);
  power += gsn;
  power *= rackId;
  power = hundreds(power);
  power -= 5;
  return power;
}

function createGrid(gsn) {
  const grid = new Array(300e2);

  for (let y = 0; y < 300; y++) {
    for (let x = 0; x < 300; x++) {
      grid[y * 300 + x] = getPower(gsn, x, y);
    }
  }

  return grid;
}

function part1(gsn) {
  const grid = createGrid(gsn);
  let max = Number.NEGATIVE_INFINITY;
  let maxPos = undefined;

  for (let minY = 0; minY + 2 < 300; minY++) {
    for (let minX = 0; minX + 2 < 300; minX++) {
      let sum = 0;

      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          sum += grid[(minY + y) * 300 + minX + x];
        }
      }

      if (sum > max) {
        max = sum;
        maxPos = { x: minX, y: minY };
      }
    }
  }

  return `${maxPos.x + 1},${maxPos.y + 1}`;
}

function part2(gsn) {
  const mem = new Array(300e3);

  function getSquarePower(size, x, y) {
    const index = size * 300e2 + y * 300 + x;

    if (typeof mem[index] === 'undefined') {
      if (size === 1) {
        mem[index] = getPower(gsn, x, y);
      } else {
        const halfSize = Math.floor(size / 2);
        mem[index] = getSquarePower(halfSize, x, y)
          + getSquarePower(halfSize, x + halfSize, y)
          + getSquarePower(halfSize, x, y + halfSize)
          + getSquarePower(halfSize, x + halfSize, y + halfSize);

        if (size % 2 === 1) {
          for (let i = 0; i < size - 1; i++) {
            mem[index] += getSquarePower(1, x + size - 1, y + i) + getSquarePower(1, x + i, y + size - 1);
          }

          mem[index] += getSquarePower(1, x + size - 1, y + size - 1);
        }
      }
    }

    return mem[index];
  }

  let max = Number.NEGATIVE_INFINITY;
  let maxPos = undefined;

  for (let size = 1; size <= 300; size++) {
    for (let y = 0; y + size - 1 < 300; y++) {
      for (let x = 0; x + size - 1 < 300; x++) {
        const sum = getSquarePower(size, x, y);

        if (sum > max) {
          max = sum;
          maxPos = { x: x, y: y, size };
        }
      }
    }
  }

  return `${maxPos.x + 1},${maxPos.y + 1},${maxPos.size}`;
}
/*

f(size, x, y) = {
  grid[y,x]                                                     , size === 1
  f(size / 2, x, y) + f(size / 2, x + size/2, y) + ...          , size % 2 === 0
  f(size / 2, x, y) + f(size / 2, x + size/2, y) + ... + ...    , size % 2 === 1
}

*/

function main() {
  if (process.argv.length < 4) {
    console.error('Usage: node main.js PART ID');
    process.exit(1);
  }

  console.log(process.argv[2] === '2' ? part2(parseInt(process.argv[3])) : part1(parseInt(process.argv[3])));
}

main();