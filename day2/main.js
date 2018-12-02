/**
 * @returns Uma lista com dois numeros:
 *  - se tem duplicados
 *  - se tem triplicados
 */
function checkWord(word) {
  let set1 = new Set();
  let set2 = new Set();
  let set3 = new Set();
  let set4 = new Set();

  for (let letra of word) {
    if (set4.has(letra)) {
      // nada acontece!
    } else if (set3.has(letra)) {
      set4.add(letra);
      set3.delete(letra);
    } else if (set2.has(letra)) {
      set3.add(letra);
      set2.delete(letra);
    } else if (set1.has(letra)) {
      set2.add(letra);
      set1.delete(letra);
    } else {
      set1.add(letra);
    }
  }

  return [set2.size > 0, set3.size > 0];
}

function conta(palavras) {
  let duplicados = 0;
  let triplicados = 0;

  for (let palavra of palavras) {
    let [temDuplicados, temTriplicados] = checkWord(palavra);

    if (temDuplicados) {
      duplicados = duplicados + 1;
    }

    if (temTriplicados) {
      triplicados = triplicados + 1;
    }
  }

  return duplicados * triplicados;
}

// Part 2

// Returns -1 if the words are not the ones we are looking for
// Else, returns the index of the mistake letter
function findSingleMistakeLetterIndex(word1, word2) {
  let index = -1;

  for (let i = 0; i < word1.length; i++) {
    const letra1 = word1[i];
    const letra2 = word2[i];

    if (letra1 !== letra2) {
      if (index > -1) {
        return -1;
      } else {
        index = i;
      }
    }
  }

  return index;
}

function findCorrectBoxes(words) {
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {

      // Returns -1 if the words are not the ones we are looking for
      // Else, returns the index of the mistake letter
      let index = findSingleMistakeLetterIndex(words[i], words[j]);

      if (index > -1) {
        return words[i].substring(0, index) + words[i].substring(index + 1);
      }
    }
  }
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  // output: process.stdout
});

function main() {
  let list = [];
  rl.on('line', line => list.push(line));
  rl.on('close', () => console.log(findCorrectBoxes(list)));
}

main();