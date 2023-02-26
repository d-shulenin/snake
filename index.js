const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const boardWidth = canvas.width;
const boardHeight = canvas.height;
const blockWidth = boardWidth / 25;
const blockHeight = boardHeight / 25;
const boardColor = "black";
const snakeColor = "green";
const foodColor = "red";

let gameOver = false;

const headCoords = {
  x: 0,
  y: 0,
};

const foodCoords = {
  x: 0,
  y: 0,
};

const body = [];

let horizontalMovement = 1;
let verticalMovement = 0;
let keyUp = "ArrowRight";

function changeMovement(key) {
  switch (key) {
    case "ArrowLeft":
      if (horizontalMovement !== 1) {
        horizontalMovement = -1;
        verticalMovement = 0;
      }
      break;
    case "ArrowRight":
      if (horizontalMovement !== -1) {
        horizontalMovement = 1;
        verticalMovement = 0;
        break;
      }
    case "ArrowUp":
      if (verticalMovement !== 1) {
        horizontalMovement = 0;
        verticalMovement = -1;
        break;
      }
    case "ArrowDown":
      if (verticalMovement !== -1) {
        horizontalMovement = 0;
        verticalMovement = 1;
        break;
      }
    default:
      break;
  }
}

window.addEventListener("keyup", (e) => {
  const { key } = e;
  if (key !== keyUp) {
    keyUp = key;
    update(key);
  }
});

function movement() {
  if (gameOver) {
    alert("Game over");
    clearInterval(gameInterval);
    return;
  }
  ctx.fillStyle = boardColor;
  ctx.fillRect(0, 0, boardWidth, boardHeight);
  const { x, y } = headCoords;
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodCoords.x, foodCoords.y, blockWidth, blockHeight);
  if (foodCoords.x === headCoords.x && foodCoords.y === headCoords.y) {
    body.push({ x: foodCoords.x, y: foodCoords.y });
    console.log("push");
    updateFood();
  }
  if (body.length) {
    for (let i = body.length - 1; i > 0; i--) {
      body[i].x = body[i - 1].x;
      body[i].y = body[i - 1].y;
    }
    body[0].x = headCoords.x;
    body[0].y = headCoords.y;
  }
  ctx.fillStyle = snakeColor;
  headCoords.x += horizontalMovement * blockWidth;
  headCoords.y += verticalMovement * blockHeight;
  if (x >= 25 * blockWidth || x < 0 || y < 0 || y >= 25 * blockHeight) {
    gameOver = true;
    return;
  }
  ctx.fillRect(headCoords.x, headCoords.y, blockWidth, blockHeight);
  body.forEach((part) => {
    if (headCoords.x === part.x && headCoords.y === part.y) gameOver = true;
    else ctx.fillRect(part.x, part.y, blockWidth, blockHeight);
  });
}

function update(key) {
  changeMovement(key);
  movement();
}

function updateFood() {
  foodCoords.x = Math.floor(Math.random() * 25) * blockWidth;
  foodCoords.y = Math.floor(Math.random() * 25) * blockHeight;
}

const gameInterval = setInterval(movement, 200);

updateFood();
