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
    // Escala de velocidad para deltaTime: type 0 = ~60px/s, type 1 = ~150px/s
    const spd = this.type == 0 ? 60 : 150;

    if (this.direction == 0) { // up (spawns bot, moves up)
      this.x = Math.random() * this.canvas.width;
      this.y = this.canvas.height + this.size;
      this.speedX = 0;
      this.speedY = -spd;
    }
    if (this.direction == 1) { // down
      this.x = Math.random() * this.canvas.width;
      this.y = -this.size;
      this.speedX = 0;
      this.speedY = spd;
    }

    if (this.direction == 2) { // left (spawns left, moves right) - The original logic commented left but spawned x=-size moving right (+spd)
      this.x = -this.size;
      this.y = Math.random() * this.canvas.height;
      this.speedX = spd;
      this.speedY = 0;
    }

    if (this.direction == 3) { // right
      this.x = this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.speedX = -spd;
      this.speedY = 0;
    }
  }

  draw() {
    if (this.alive) {
      this.ctx.drawImage(this.imageEn, this.x, this.y, this.size, this.size);
    }
  }

  move(deltaTime) {
    if (!deltaTime) return;
    this.x += this.speedX * deltaTime;
    this.y += this.speedY * deltaTime;

    // Remove if way off screen
    if (this.x < -200 || this.x > this.canvas.width + 200 ||
        this.y < -200 || this.y > this.canvas.height + 200) {
        this.kill();
    }
  }
}
