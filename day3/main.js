function getConflictArea(claims) {
  const single = new Set();
  const conflicts = new Set();

  for (let claim of claims) {
    for (let i = 0; i < claim.width; i++) {
      for (let j = 0; j < claim.height; j++) {
        const x = i + claim.left;
        const y = j + claim.top;
        const id = (y * 1000) + x;

        if (conflicts.has(id)) {
          continue;
        } else if (single.has(id)) {
          conflicts.add(id);
          single.delete(id);
        } else {
          single.add(id);
        }
      }
    }
  }

  return conflicts.size;
}

function getConflictFreeClaimId(claims) {
  const single = new Set();
  const conflicts = new Set();

  for (let claim of claims) {
    for (let i = 0; i < claim.width; i++) {
      for (let j = 0; j < claim.height; j++) {
        const x = i + claim.left;
        const y = j + claim.top;
        const id = (y * 1000) + x;

        if (conflicts.has(id)) {
          continue;
        } else if (single.has(id)) {
          conflicts.add(id);
          single.delete(id);
        } else {
          single.add(id);
        }
      }
    }
  }

  findClaim:
  for (let claim of claims) {
    for (let i = 0; i < claim.width; i++) {
      for (let j = 0; j < claim.height; j++) {
        const x = i + claim.left;
        const y = j + claim.top;
        const id = (y * 1000) + x;

        if (conflicts.has(id)) {
          continue findClaim;
        }
      }
    }

    return claim.id;
  }

  return conflicts.size;
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  // output: process.stdout
});

function main() {
  let list = [];
  rl.on('line', line => {
    let [, id, left, top, width, heigth] = /^\#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/.exec(line);

    list.push({
      id,
      left: parseInt(left),
      top: parseInt(top),
      width: parseInt(width),
      height: parseInt(heigth),
    });
  });
  rl.on('close', () => console.log(getConflictFreeClaimId(list)));
}

main();