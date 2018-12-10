const time = document.querySelector('#time');
const label = document.querySelector('#label');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

async function getPoints() {
  const res = await fetch('/input');
  const lines = await res.text();

  return lines
    .split('\n')
    .map(line => /position=<([\-\d\s]+),([\-\d\s]+)> velocity=<([\-\d\s]+),([\-\d\s]+)>/.exec(line))
    .map(([, x, y, dx, dy]) => ({ x: parseInt(x.trim()), y: parseInt(y.trim()), dx: parseInt(dx.trim()), dy: parseInt(dy.trim()) }));
}

function plot(points, time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let dots = points.map(point => ({
    x: point.x + point.dx * time,
    y: point.y + point.dy * time
  }));

  const minX = dots.reduce((r, { x }) => Math.min(r, x), Number.POSITIVE_INFINITY);
  const minY = dots.reduce((r, { y }) => Math.min(r, y), Number.POSITIVE_INFINITY);

  dots = dots.map(({ x, y }) => ({ x: x - minX, y: y - minY }));

  for (const { x, y } of dots) {
    ctx.fillRect(x, y, 1, 1);
  }

  label.textContent = time;
}

async function main() {
  const points = await getPoints();
  plot(points, time.value);
  time.addEventListener('input', () => plot(points, time.value));
}

main();