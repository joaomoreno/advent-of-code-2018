const out = process.stdout;

if (!out.isTTY) {
  throw new Error('Not a TTY');
}

async function wait(millis) {
  return new Promise(c => setTimeout(c, millis));
}

function print(game) {
  out.cursorTo(0, 0);
  out.clearScreenDown();

  for (let y = 0; y < game.map.height; y++) {
    for (let x = 0; x < game.map.width; x++) {
      out.cursorTo(x, y);
      const cell = game.map[y * game.map.width + x];

      if (cell.unit) {
        out.write(cell.unit.type === 'G' ? '\u001b[31m' : '\u001b[32m');
        out.write(`${cell.unit.id}`);
        out.write('\u001b[0m')
      } else if (cell.wall) {
        out.write('#');
      } else {
        out.write('.');
      }
    }
  }

  for (let y = 0; y < game.elves.length; y++) {
    if (game.elves[y].hp > 0) {
      out.cursorTo(game.map.width + 2, y);
      out.write(`\u001b[32mE${game.elves[y].id} ${game.elves[y].hp}\u001b[0m`);
    }
  }

  for (let y = 0; y < game.goblins.length; y++) {
    if (game.goblins[y].hp > 0) {
      out.cursorTo(game.map.width + 2, y + game.elves.length);
      out.write(`\u001b[31mG${game.goblins[y].id} ${game.goblins[y].hp}\u001b[0m`);
    }
  }

  out.cursorTo(game.map.width + 10, 0);
  out.write(`${game.step}`);

  out.cursorTo(game.map.width - 1, Math.max(game.map.height - 1, game.elves.length + game.goblins.length));
  out.write('\n');
}

function parse(input) {
  const map = [];
  const elves = [];
  const goblins = [];
  let x = 0, y = 0;

  for (const line of input) {
    x = 0;

    for (const char of line) {
      let unit = undefined;

      if (char === 'E') {
        unit = { type: 'E', id: elves.length, hp: 200, x, y };
        elves.push(unit);
      } else if (char === 'G') {
        unit = { type: 'G', id: goblins.length, hp: 200, x, y };
        goblins.push(unit);
      }

      map.push({ wall: char === '#', unit });
      x++;
    }

    y++;
  }

  map.width = input[0].length;
  map.height = input.length;

  return { map, elves, goblins, step: 0 };
}

function compareUnits(a, b) {
  return a.y === b.y ? a.x - b.x : a.y - b.y;
}

function compareAttackTargets(a, b) {
  return a.hp === b.hp ? compareUnits(a, b) : a.hp - b.hp;
}

function isNextTo(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}

function canAttack(unit, enemies) {
  return enemies.some(e => isNextTo(unit, e));
}

function getAttackTarget(unit, enemies) {
  return enemies.filter(e => isNextTo(unit, e)).sort(compareAttackTargets)[0];
}

function index(game, x, y) {
  return y * game.map.width + x;
}

function isCellFree(game, x, y) {
  if (x < 0 || x >= game.map.width || y < 0 || y >= game.map.height) {
    return false;
  }

  const cell = game.map[index(game, x, y)];
  return !cell.unit && !cell.wall;
}

function getInRange(game, x, y) {
  const result = [];

  if (isCellFree(game, x, y - 1)) {
    result.push({ x, y: y - 1 });
  }

  if (isCellFree(game, x - 1, y)) {
    result.push({ x: x - 1, y });
  }

  if (isCellFree(game, x + 1, y)) {
    result.push({ x: x + 1, y });
  }

  if (isCellFree(game, x, y + 1)) {
    result.push({ x, y: y + 1 });
  }

  return result;
}

function move(game, unit, enemies) {
  const indexesInRange = new Set(enemies.reduce((r, e) => [...r, ...getInRange(game, e.x, e.y).map(p => index(game, p.x, p.y))], []));
  const reachable = [];
  const indexesVisited = new Set([index(game, unit.x, unit.y)]);

  let current = [{ ...unit, path: [] }];
  let next = [];

  while (current.length > 0) {
    for (const target of current) {
      const neighbors = getInRange(game, target.x, target.y);

      for (const neighbor of neighbors) {
        const neighborIndex = index(game, neighbor.x, neighbor.y);

        if (indexesVisited.has(neighborIndex)) {
          continue;
        }

        indexesVisited.add(neighborIndex);

        const path = [...target.path, { x: neighbor.x, y: neighbor.y }];

        if (indexesInRange.has(neighborIndex)) {
          reachable.push({ ...neighbor, path });
        } else {
          next.push({ ...neighbor, path });
        }
      }
    }

    reachable.sort(compareUnits);

    if (reachable.length > 0) {
      const target = reachable[0].path[0];

      game.map[index(game, unit.x, unit.y)].unit = undefined;
      game.map[index(game, target.x, target.y)].unit = unit;
      unit.x = target.x;
      unit.y = target.y;
      return;
    }

    current = next;
    next = [];
  }
}

function step(game, power) {
  const units = [...game.elves, ...game.goblins]
    .filter(e => e.hp > 0)
    .sort(compareUnits);

  for (const unit of units) {
    if (unit.hp <= 0) {
      continue;
    }

    const enemies = [...(unit.type === 'E' ? game.goblins : game.elves)]
      .filter(e => e.hp > 0);

    if (enemies.length === 0) {
      return true;
    }

    if (!canAttack(unit, enemies)) {
      move(game, unit, enemies);
    }

    const target = getAttackTarget(unit, enemies);

    if (target) {
      target.hp -= power[unit.type];

      if (target.hp <= 0) {
        game.map[index(game, target.x, target.y)].unit = undefined;
      }
    }
  }

  game.step++;
  return false;
}

async function run(game, power, millis) {
  do {
    if (millis) {
      await wait(millis);
      print(game);
    }
  } while (!step(game, power));
}

async function part1(lines) {
  const game = parse(lines);

  await run(game, { 'E': 3, 'G': 3 }, 50);
  print(game);

  const hp = [...game.elves, ...game.goblins]
    .filter(unit => unit.hp > 0)
    .reduce((r, unit) => r + unit.hp, 0);

  const result = game.step * hp;
  console.log(hp, result);
}

async function part2(lines) {
  for (let power = 4; true; power++) {
    const game = parse(lines);
    await run(game, { 'E': power, 'G': 3 });

    if (game.elves.every(u => u.hp > 0)) {
      const hp = [...game.elves, ...game.goblins]
        .filter(unit => unit.hp > 0)
        .reduce((r, unit) => r + unit.hp, 0);

      const result = game.step * hp;
      console.log(power, hp, result);

      return;
    }
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