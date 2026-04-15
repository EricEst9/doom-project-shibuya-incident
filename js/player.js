"use strict";

class Player {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.size = 60;
    this.x = canvas.width / 2 - this.size / 2;
    this.y = canvas.height / 2 - this.size / 2;
    this.move = 5;
    this.canUp = true;
    this.canDown = true;
    this.canLeft = true;
    this.canRight = true;
    this.direction = null;
    this.imagePj = new Image();
    this.imagePj.src = "images/spriteGojo3.png";
  }

  update() {
    if (this.canMoveUp && this.direction == "up") {
      this.y -= this.move;
    }
    if (this.canMoveDown && this.direction == "down") {
      this.y += this.move;
    }
    if (this.canMoveLeft && this.direction == "left") {
      this.x -= this.move;
    }
    if (this.canMoveRight && this.direction == "right") {
      this.x += this.move;
    }

    this.checkScreen();
  }

  setDirection(direction) {
    const directions = ["up", "down", "left", "right"];
    if (directions.includes(direction)) {
      this.direction = direction;
    } else {
      this.direction = null;
    }
  }

  // Check if the player is out of the screen / canvas
  checkScreen() {
    this.canMoveDown = this.y >= this.canvas.height - this.size ? false : true;
    this.canMoveUp = this.y <= 0 ? false : true;
    this.canMoveLeft = this.x <= 0 ? false : true;
    this.canMoveRight = this.x >= this.canvas.width - this.size ? false : true;
  }

  draw() {
    this.ctx.drawImage(this.imagePj, this.x, this.y, this.size, this.size);
    this.ctx.fillStyle = "#000000";
  }

  didCollide(obstacle) {
    if (
      this.x + this.size >= obstacle.x &&
      this.y + this.size > obstacle.y &&
      this.y < obstacle.y + obstacle.size &&
      this.x <= obstacle.x + obstacle.size &&
      this.y + this.size > obstacle.y &&
      this.y < obstacle.y + obstacle.size
    ) {
      return true;
    } else {
      return false;
    }
  }
}
