class Reader {
  constructor(input) {
    this.input = input;
    this.pos = 0;
  }

  read() {
    return this.input[this.pos++];
  }

  done() {
    return this.pos === this.input.length;
  }
}

function parseNode(reader) {
  const childCount = reader.read();
  const metadataCount = reader.read();
  const children = [];

  for (let i = 0; i < childCount; i++) {
    children.push(parseNode(reader));
  }

  const metadata = [];

  for (let i = 0; i < metadataCount; i++) {
    metadata.push(reader.read());
  }

  return { children, metadata };
}

function metadataSum(node) {
  return node.metadata.reduce((r, m) => r + m, 0)
    + node.children.reduce((r, c) => r + metadataSum(c), 0);
}

function part1(lines) {
  const input = lines[0].split(' ').map(i => parseInt(i));
  const reader = new Reader(input);
  const root = parseNode(reader);

  return metadataSum(root);
}

function nodeValue(node) {
  if (node.children.length === 0) {
    return node.metadata.reduce((r, m) => r + m, 0);
  }

  const childrenValues = node.children.map(nodeValue);
  const indexes = node.metadata
    .map(i => i - 1)
    .filter(i => i >= 0 && i < node.children.length);

  return indexes.reduce((r, i) => r + childrenValues[i], 0);
}

function part2(lines) {
  const input = lines[0].split(' ').map(i => parseInt(i));
  const reader = new Reader(input);
  const root = parseNode(reader);

  return nodeValue(root);
}

function main() {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin });

  let lines = [];
  rl.on('line', line => lines.push(line));
  rl.on('close', () => console.log(process.argv[2] === '2' ? part2(lines) : part1(lines)));
}

main();