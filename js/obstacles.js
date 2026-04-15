class Obstacle {
  constructor(id, ctx, canvas, direction, type) {
    this.id = id;
    this.ctx = ctx;
    this.canvas = canvas;
    this.direction = direction;
    this.type = type;
    this.x = 0;
    this.y = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.color = "red";
    this.size = 30;
    this.imageEn = new Image();
    this.imageEn.src = type == 0 ? "images/goomba.png" : "images/metroid.png";
    this.alive = true;
  }
  kill() {
    this.alive = false;
  }

  calculateInits() {
    if (this.direction == 0) { // up
      this.x = Math.random() * this.canvas.width; // random
      this.y = this.canvas.height + this.size;
      this.speedX = 0;
      this.speedY = this.type == 0 ? -1 : -2.5;
    }
    if (this.direction == 1) { // down
      this.x = Math.random() * this.canvas.width; // random
      this.y = 0;
      this.speedX = 0;
      this.speedY = this.type == 0 ? 1 : 2.5;
    }

    if (this.direction == 2) { // left
      this.x = -this.size;
      this.y = Math.random() * this.canvas.height; // random
      this.speedX = this.type == 0 ? 1 : 2.5;
      this.speedY = 0;
    }

    if (this.direction == 3) { // right
      this.x = this.canvas.width;
      this.y = Math.random() * this.canvas.height; // random
      this.speedX = this.type == 0 ? -1 : -2.5;
      this.speedY = 0;
    }
  }

  draw() {
    if (this.alive) {
      // We will first draw squares
      this.ctx.fillStyle = this.color;
      // this.ctx.fillRect(this.x, this.y, this.size, this.size);
      this.ctx.drawImage(this.imageEn, this.x, this.y, this.size, this.size);
    }
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
}
