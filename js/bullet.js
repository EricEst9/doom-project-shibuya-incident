class Bullet {
  constructor(canvas, ctx, playerX, playerY, targetX, targetY) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.size = 30;
    
    // Player visual center approx
    const pCenterX = playerX + 30; // player.size/2
    const pCenterY = playerY + 30;

    this.x = pCenterX - this.size/2;
    this.y = pCenterY - this.size/2;

    const dx = targetX - pCenterX;
    const dy = targetY - pCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize dir
    const dirX = distance > 0 ? dx / distance : 0;
    const dirY = distance > 0 ? dy / distance : 0;

    // Base speed + extra speed based on distance (maintains original mechanics)
    // Adjust scale so it behaves uniformly
    const speed = 200 + distance * 1.5; // pixels per second

    this.vx = dirX * speed;
    this.vy = dirY * speed;

    this.imageEn = new Image();
    this.imageEn.src = "images/bullet.png";
    this.isEnemy = false;
    this.alive = true;
  }

  kill(){
    this.alive = false;
  }
  
  draw() {
    if (this.alive) {
      if (this.isEnemy) {
        this.ctx.save();
        this.ctx.filter = 'hue-rotate(180deg)';
        this.ctx.drawImage(this.imageEn, this.x, this.y, this.size, this.size);
        this.ctx.restore();
      } else {
        this.ctx.drawImage(this.imageEn, this.x, this.y, this.size, this.size);
      }
    }
  }

  move(deltaTime) {
    if (!deltaTime) return;
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    // If out of canvas, kill it so it doesn't pile up endlessly
    if (this.x < -this.size || this.x > this.canvas.width + this.size ||
        this.y < -this.size || this.y > this.canvas.height + this.size) {
        this.kill();
    }
  }

  didCollide(obstacle) {
    if (
      this.x + this.size >= obstacle.x &&
      this.x <= obstacle.x + obstacle.size &&
      this.y + this.size >= obstacle.y &&
      this.y <= obstacle.y + obstacle.size
    ) {
      return obstacle.id;
    } else {
      return false;
    }
  }
}