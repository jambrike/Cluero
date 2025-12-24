function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const suspects = ["Janitor", "Aunt", "Chef", "James", "Butler", "Grandfather"];
const weapons = ["knife", "candlestick", "revolver", "wrench", "rope"];
const rooms = ["kitchen", "ballroom", "conservatory", "library", "study"];

const answer = {
  suspect: randomFrom(suspects),
  weapon: randomFrom(weapons),
  room: randomFrom(rooms)
};

const rows = 18;
const cols = 18;
const gameArea = document.getElementById("game");

const board = [];
for (let y = 0; y < rows; y++) {
  board[y] = [];
  for (let x = 0; x < cols; x++) {
    board[y][x] = 1;
  }
}

const player = {
  x: 6,
  y: 1
};

document.addEventListener("keydown", e => {
  let dx = 0;
  let dy = 0;

  if (e.key === "ArrowUp") dy = -1;
  if (e.key === "ArrowDown") dy = 1;
  if (e.key === "ArrowLeft") dx = -1;
  if (e.key === "ArrowRight") dx = 1;

  const nx = player.x + dx;
  const ny = player.y + dy;

  if (
    nx >= 0 && nx < cols &&
    ny >= 0 && ny < rows &&
    board[ny][nx] === 1
  ) {
    player.x = nx;
    player.y = ny;
    render();
  }
});

function render() {
  gameArea.innerHTML = "";

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      if (player.x === x && player.y === y) {
        cell.classList.add("player");
      }

      gameArea.appendChild(cell);
    }
  }
}

render();

