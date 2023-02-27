import Game from "./Game.js";

const startButton = document.getElementById("start");

startButton.addEventListener("click", () => {
  const game = new Game();
  game.start();
  startButton.style.display = "none";
});
