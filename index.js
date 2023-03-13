import Game from "./Game.js";

const menu = document.getElementById("menu");
const statistics = document.getElementById("statistics");
const startButton = document.getElementById("start");
const scoreElement = document.getElementById("score");
const bestElement = document.getElementById("best");
const bestScore = localStorage.getItem("best") || 0;

startButton.addEventListener("click", () => {
  bestElement.innerText = `Best: ${bestScore}`;
  const game = new Game({ scoreElement, bestElement, bestScore });
  game.start();
  statistics.style.display = "block";
  menu.style.display = "none";
});
