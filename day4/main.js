const moment = require('moment');

function solve(lines) {
  const log = lines
    .map(line => /^\[(.*)\] (.*)$/.exec(line))
    .map(([, timestamp, detail]) => ({ timestamp: moment(timestamp, "YYYY-MM-DD HH:mm"), detail }))
    .sort((a, b) => a.timestamp.isBefore(b.timestamp) ? -1 : 1);

  const map = new Map();
  const heatMap = new Map();
  let currentId = undefined;
  let asleepTimestamp;
  let match;

  for (const { timestamp, detail } of log) {
    if (match = /Guard #(\d+) begins shift/.exec(detail)) {
      currentId = parseInt(match[1]);
    } else if (detail === 'falls asleep') {
      asleepTimestamp = timestamp;
    } else { // wakes up
      map.set(currentId, (map.get(currentId) || 0) + timestamp.diff(asleepTimestamp, 'minutes'));

      let heat = heatMap.get(currentId);

      if (!heat) {
        heat = new Array(60).fill(0);
        heatMap.set(currentId, heat);
      }

      let i = asleepTimestamp;
      while (i.isBefore(timestamp)) {
        heat[i.minutes()]++;
        i = i.add(1, 'minute');
      }
    }
  }

  const id = Array.from(map.entries())
    .sort(([, a], [, b]) => b - a)[0][0];

  return { heatMap, id };
}

function part1(lines) {
  const { heatMap, id } = solve(lines);

  const heat = heatMap.get(id);
  let minute;
  let max = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < heat.length; i++) {
    if (heat[i] > max) {
      minute = i;
      max = heat[i];
    }
  }

  return id * minute
}

function part2(lines) {
  const { heatMap } = solve(lines);

  let minute;
  let guardId;
  let max = Number.NEGATIVE_INFINITY;

  for (const [id, heat] of heatMap) {
    for (let i = 0; i < heat.length; i++) {
      if (heat[i] > max) {
        minute = i;
        guardId = id;
        max = heat[i];
      }
    }
  }

  return guardId * minute;
}

function main() {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin });

  let lines = [];
  rl.on('line', line => lines.push(line));
  rl.on('close', () => console.log(part2(lines)));
}

main();