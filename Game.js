class Game {
  constructor({ scoreElement, bestElement, bestScore }) {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.dimensions = {
      boardWidth: this.canvas.width,
      boardHeight: this.canvas.height,
      blockWidth: this.canvas.width / 25,
      blockHeight: this.canvas.height / 25,
    };
    this.colors = {
      boardColor: "#C6C6C6",
      snakeColor: "#333333",
      foodColor: "#DE401D",
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
    this.score = 0;
    this.scoreElement = scoreElement;
    this.bestElement = bestElement;
    this.bestScore = bestScore;
    this.horizontalMovement = 1;
    this.verticalMovement = 0;
    this.lastKeyUp = "";
    this.swipe = {
      treshold: Math.max(1, Math.floor(0.01 * window.innerWidth)),
      touchstartX: 0,
      touchstartY: 0,
      touchendX: 0,
      touchendY: 0,
      limit: Math.tan(((45 * 1.5) / 180) * Math.PI),
    };
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
        }
        break;
      case "ArrowUp":
        if (this.verticalMovement !== 1) {
          this.horizontalMovement = 0;
          this.verticalMovement = -1;
        }
        break;
      case "ArrowDown":
        if (this.verticalMovement !== -1) {
          this.horizontalMovement = 0;
          this.verticalMovement = 1;
        }
        break;
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
      this.scoreElement.innerText = `Score: ${++this.score}`;
      this.bestElement.innerText = `Best: ${
        this.score > this.bestScore ? this.score : this.bestScore
      }`;
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
  keyUpListener(e) {
    const { key } = e;
    if (key !== this.lastKeyUp) {
      this.lastKeyUp = key;
      this.changeMovement(key);
      this.move();
    }
  }
  touchStartListener(e) {
    this.touchstartX = e.changedTouches[0].screenX;
    this.touchstartY = e.changedTouches[0].screenY;
  }
  touchEndListener(e) {
    this.touchendX = e.changedTouches[0].screenX;
    this.touchendY = e.changedTouches[0].screenY;
    let x = this.touchendX - this.touchstartX;
    let y = this.touchendY - this.touchstartY;
    let xy = Math.abs(x / y);
    let yx = Math.abs(y / x);
    if (
      Math.abs(x) > this.swipe.treshold ||
      Math.abs(y) > this.swipe.treshold
    ) {
      if (yx <= this.swipe.limit) {
        if (x < 0) {
          this.changeMovement("ArrowLeft");
        } else {
          this.changeMovement("ArrowRight");
        }
      }
      if (xy <= this.swipe.limit) {
        if (y < 0) {
          this.changeMovement("ArrowUp");
        } else {
          this.changeMovement("ArrowDown");
        }
      }
    }
  }
  bindedKeyUpListener = this.keyUpListener.bind(this);
  bindedTouchStartListener = this.touchStartListener.bind(this);
  bindedTouchEndListener = this.touchEndListener.bind(this);
  start() {
    this.gameOver = false;
    this.updateFood();
    window.addEventListener("keyup", this.bindedKeyUpListener);
    window.addEventListener("touchstart", this.bindedTouchStartListener);
    window.addEventListener("touchend", this.bindedTouchEndListener);
    const gameInterval = setInterval(() => {
      if (!this.gameOver) this.move();
      else {
        if (this.score > this.bestScore)
          localStorage.setItem("best", this.score);
        alert("Game over");
        clearInterval(gameInterval);
        window.removeEventListener("keyup", this.bindedKeyUpListener);
        window.removeEventListener("touchstart", this.bindedTouchStartListener);
        window.removeEventListener("touchend", this.bindedTouchEndListener);
      }
    }, 200);
  }
}

export default Game;
