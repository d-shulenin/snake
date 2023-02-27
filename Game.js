class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.dimensions = {
      boardWidth: this.canvas.width,
      boardHeight: this.canvas.height,
      blockWidth: this.canvas.width / 25,
      blockHeight: this.canvas.height / 25,
    };
    this.colors = {
      boardColor: "black",
      snakeColor: "green",
      foodColor: "red",
    };
    this.gameOver = true;
    this.headCoords = {
      x: 0,
      y: 0,
    };
    this.body = [];
    this.foodCoords = {
      x: 0,
      y: 0,
    };
    this.horizontalMovement = 1;
    this.verticalMovement = 0;
    this.lastKeyUp = "";
  }
  updateFood() {
    this.foodCoords.x =
      Math.floor(Math.random() * 25) * this.dimensions.blockWidth;
    this.foodCoords.y =
      Math.floor(Math.random() * 25) * this.dimensions.blockHeight;
  }
  changeMovement(key) {
    switch (key) {
      case "ArrowLeft":
        if (this.horizontalMovement !== 1) {
          this.horizontalMovement = -1;
          this.verticalMovement = 0;
        }
        break;
      case "ArrowRight":
        if (this.horizontalMovement !== -1) {
          this.horizontalMovement = 1;
          this.verticalMovement = 0;
          break;
        }
      case "ArrowUp":
        if (this.verticalMovement !== 1) {
          this.horizontalMovement = 0;
          this.verticalMovement = -1;
          break;
        }
      case "ArrowDown":
        if (this.verticalMovement !== -1) {
          this.horizontalMovement = 0;
          this.verticalMovement = 1;
          break;
        }
      default:
        break;
    }
  }
  move() {
    this.ctx.fillStyle = this.colors.boardColor;
    this.ctx.fillRect(
      0,
      0,
      this.dimensions.boardWidth,
      this.dimensions.boardHeight
    );
    this.ctx.fillStyle = this.colors.foodColor;
    this.ctx.fillRect(
      this.foodCoords.x,
      this.foodCoords.y,
      this.dimensions.blockWidth,
      this.dimensions.blockHeight
    );
    if (
      this.foodCoords.x === this.headCoords.x &&
      this.foodCoords.y === this.headCoords.y
    ) {
      this.body.push({ x: this.foodCoords.x, y: this.foodCoords.y });
      this.updateFood();
    }
    if (this.body.length) {
      for (let i = this.body.length - 1; i > 0; i--) {
        this.body[i].x = this.body[i - 1].x;
        this.body[i].y = this.body[i - 1].y;
      }
      this.body[0].x = this.headCoords.x;
      this.body[0].y = this.headCoords.y;
    }
    this.ctx.fillStyle = this.colors.snakeColor;
    this.headCoords.x += this.horizontalMovement * this.dimensions.blockWidth;
    this.headCoords.y += this.verticalMovement * this.dimensions.blockHeight;
    const { x, y } = this.headCoords;
    if (
      x === 25 * this.dimensions.blockWidth ||
      y === 25 * this.dimensions.blockHeight ||
      x < 0 ||
      y < 0
    ) {
      this.gameOver = true;
    } else {
      this.ctx.fillRect(
        this.headCoords.x,
        this.headCoords.y,
        this.dimensions.blockWidth,
        this.dimensions.blockHeight
      );
      this.body.forEach((part) => {
        if (this.headCoords.x === part.x && this.headCoords.y === part.y)
          this.gameOver = true;
        else
          this.ctx.fillRect(
            part.x,
            part.y,
            this.dimensions.blockWidth,
            this.dimensions.blockHeight
          );
      });
    }
  }
  listener(e) {
    const { key } = e;
    if (key !== this.lastKeyUp) {
      this.lastKeyUp = key;
      this.changeMovement(key);
      this.move();
    }
  }
  bindedListener = this.listener.bind(this);
  start() {
    this.gameOver = false;
    this.updateFood();
    window.addEventListener("keyup", this.bindedListener);
    const gameInterval = setInterval(() => {
      if (!this.gameOver) this.move();
      else {
        alert("Game over");
        clearInterval(gameInterval);
        window.removeEventListener("keyup", this.bindedListener);
        debugger;
      }
    }, 200);
  }
}

export default Game;
