function findDuplicate(list) {
  var knownFrequencies = new Set();
  var frequency = 0;

  knownFrequencies.add(0);

  while (true) { // ciclo infinito
    for (var element of list) {
      frequency = frequency + element;

      if (knownFrequencies.has(frequency)) {
        // se encontrarmos, já está!!!
        return frequency;
      } else {
        // caso contrário, guardamos e continuamos
        knownFrequencies.add(frequency);
      }
    }
  }
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function main() {
  let list = [];
  rl.on('line', line => list.push(parseInt(line)));
  rl.on('close', () => console.log(findDuplicate(list)));
}

main();