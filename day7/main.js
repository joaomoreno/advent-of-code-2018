function createDependencyMap(lines) {
  const map = new Map();

  for (const line of lines) {
    const [, from, to] = /Step (\w) must be finished before step (\w) can begin./.exec(line);

    if (!map.has(to)) {
      map.set(to, new Set());
    }

    if (!map.has(from)) {
      map.set(from, new Set());
    }

    const deps = map.get(to);
    deps.add(from);
    map.set(to, deps);
  }

  return map;
}

function peek(steps, exclude) {
  let minSize = Number.POSITIVE_INFINITY;
  let minStep = undefined;

  for (const [step, fromSet] of steps) {
    if (!exclude.has(step) && (fromSet.size < minSize || (fromSet.size === minSize && step < minStep))) {
      minSize = fromSet.size;
      minStep = step;
    }
  }

  return minSize === 0 ? minStep : undefined;
}

function part1(lines) {
  const map = createDependencyMap(lines);
  const sets = [];

  for (const [, set] of map) {
    sets.push(set);
  }

  const result = [];
  const done = new Set();
  const steps = Array.from(map.entries());

  for (let i = 0; i < steps.length; i++) {
    const minStep = peek(steps, done);

    done.add(minStep);
    result.push(minStep);

    for (const set of sets) {
      set.delete(minStep);
    }
  }

  return result.join('');
}

function part2(lines) {
  const map = createDependencyMap(lines);
  const sets = [];

  for (const [, set] of map) {
    sets.push(set);
  }

  const steps = Array.from(map.entries());
  const doing = new Set();
  const done = new Set();
  let exclude = new Set();

  const workers = new Array(5);
  let result = 0;
  let step = undefined;

  while (done.size < map.size || workers.some(w => !!w)) {
    const justDone = new Set();
    for (let i = 0; i < workers.length; i++) {
      if (done.size < map.size && !workers[i] && (step = peek(steps, exclude))) { // worker free
        doing.add(step);
        exclude = new Set([...doing, ...done]);

        const left = 60 + step.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        workers[i] = { step, left };
      }

      if (workers[i] && --workers[i].left === 0) {
        justDone.add(workers[i].step);
        workers[i] = undefined;
      }
    }

    for (const step of justDone) {
      doing.delete(step);
      done.add(step);
      exclude = new Set([...doing, ...done]);

      for (const set of sets) {
        set.delete(step);
      }
    }

    result++;
  }

  return result;
}

function main() {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin });

  let lines = [];
  rl.on('line', line => lines.push(line));
  rl.on('close', () => console.log(process.argv[2] === '2' ? part2(lines) : part1(lines)));
}

main();