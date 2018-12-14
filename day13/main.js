function isCart(char) {
  return char === '<' || char === '>' || char === 'v' || char === '^';
}

function getOrientation(char) {
  return (char === '<' || char === '>') ? '-' : '|';
}

function getCoords(index, width) {
  return {
    x: index % width,
    y: Math.floor(index / width)
  };
}

function getIndex(x, y, width) {
  return y * width + x;
}

function move(x, y, direction) {
  switch (direction) {
    case '<': return { x: x - 1, y };
    case '>': return { x: x + 1, y };
    case 'v': return { x, y: y + 1 };
    case '^': return { x, y: y - 1 };
  }
}

function compareCarts(a, b) {
  if (a.y !== b.y) {
    return a.y - b.y;
  } else {
    return a.x - b.x;
  }
}

function turn(state, direction) {
  switch (state) {
    case 0:
      switch (direction) {
        case '^': return '<';
        case '>': return '^';
        case 'v': return '>';
        case '<': return 'v';
      }
    case 1:
      return direction;
    case 2:
      switch (direction) {
        case '^': return '>';
        case '>': return 'v';
        case 'v': return '<';
        case '<': return '^';
      }
  }
}

function parse(input) {
  const map = [];
  const carts = [];
  const width = input[0].length;

  for (const line of input) {
    for (let char of line) {
      let cart = undefined;

      if (isCart(char)) {
        const { x, y } = getCoords(map.length, width);
        cart = { direction: char, x, y, state: 0 };
        carts.push(cart);
        char = getOrientation(char);
      }

      map.push({ char, cart });
    }
  }

  return { map, carts, width };
}

function part1(lines) {
  const { map, carts, width } = parse(lines);

  while (true) {
    carts.sort(compareCarts);

    for (const cart of carts) {
      map[getIndex(cart.x, cart.y, width)].cart = undefined;

      const { x, y } = move(cart.x, cart.y, cart.direction);
      const cell = map[getIndex(x, y, width)];

      if (cell.cart) {
        return `${x},${y}`;
      }

      if (cell.char === '/') {
        switch (cart.direction) {
          case '^': cart.direction = '>'; break;
          case '>': cart.direction = '^'; break;
          case 'v': cart.direction = '<'; break;
          case '<': cart.direction = 'v'; break;
        }
      } else if (cell.char === '\\') {
        switch (cart.direction) {
          case '^': cart.direction = '<'; break;
          case '>': cart.direction = 'v'; break;
          case 'v': cart.direction = '>'; break;
          case '<': cart.direction = '^'; break;
        }
      } else if (cell.char === '+') {
        cart.direction = turn(cart.state, cart.direction);
        cart.state = (cart.state + 1) % 3;
      }

      cart.x = x;
      cart.y = y;
      cell.cart = cart;
    }
  }
}

function part2(lines) {
  const { map, carts, width } = parse(lines);

  let cartCount = carts.length;

  while (true) {
    carts.sort(compareCarts);

    for (let i = 0; i < carts.length; i++) {
      const cart = carts[i];

      if (cart.disabled) {
        continue;
      }

      map[getIndex(cart.x, cart.y, width)].cart = undefined;

      const { x, y } = move(cart.x, cart.y, cart.direction);
      const cell = map[getIndex(x, y, width)];

      if (cell.cart) {
        cell.cart.disabled = true;
        cell.cart = undefined;
        cart.disabled = true;
        cartCount -= 2;

        if (cartCount === 1) {
          const cart = carts.filter(c => !c.disabled)[0];
          return `${cart.x},${cart.y}`;
        }

        continue;
      }

      if (cell.char === '/') {
        switch (cart.direction) {
          case '^': cart.direction = '>'; break;
          case '>': cart.direction = '^'; break;
          case 'v': cart.direction = '<'; break;
          case '<': cart.direction = 'v'; break;
        }
      } else if (cell.char === '\\') {
        switch (cart.direction) {
          case '^': cart.direction = '<'; break;
          case '>': cart.direction = 'v'; break;
          case 'v': cart.direction = '>'; break;
          case '<': cart.direction = '^'; break;
        }
      } else if (cell.char === '+') {
        cart.direction = turn(cart.state, cart.direction);
        cart.state = (cart.state + 1) % 3;
      }

      cart.x = x;
      cart.y = y;
      cell.cart = cart;
    }
  }

  return `${carts[0].x},${carts[0].y}`;
}

function main() {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin });

  let lines = [];
  rl.on('line', line => lines.push(line));
  rl.on('close', () => console.log(process.argv[2] === '2' ? part2(lines) : part1(lines)));
}

main();