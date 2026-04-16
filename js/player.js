"use strict";

class Player {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.size = 60;
    this.x = canvas.width / 2 - this.size / 2;
    this.y = canvas.height / 2 - this.size / 2;
    this.moveSpeed = 300; // pixels per second
    this.direction = null;
    this.imagePj = new Image();
    this.imagePj.src = "images/spriteGojo3.png";
  }

  update(deltaTime) {
    if (!deltaTime) return;

    if (this.direction == "up") {
      this.y -= this.moveSpeed * deltaTime;
    }
    if (this.direction == "down") {
      this.y += this.moveSpeed * deltaTime;
    }
    if (this.direction == "left") {
      this.x -= this.moveSpeed * deltaTime;
    }
    if (this.direction == "right") {
      this.x += this.moveSpeed * deltaTime;
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

  // Check if the player is out of the screen / canvas and clamp
  checkScreen() {
    if (this.y < 0) this.y = 0;
    if (this.y > this.canvas.height - this.size) this.y = this.canvas.height - this.size;
    if (this.x < 0) this.x = 0;
    if (this.x > this.canvas.width - this.size) this.x = this.canvas.width - this.size;
  }

  draw() {
    this.ctx.drawImage(this.imagePj, this.x, this.y, this.size, this.size);
  }

  didCollide(obstacle) {
    if (
      this.x + this.size >= obstacle.x &&
      this.x <= obstacle.x + obstacle.size &&
      this.y + this.size >= obstacle.y &&
      this.y <= obstacle.y + obstacle.size
    ) {
      return true;
    } else {
      return false;
    }
  }
}
