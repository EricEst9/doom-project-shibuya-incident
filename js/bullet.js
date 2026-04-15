

class Bullet {
  constructor(canvas, ctx, playerX, playerY, clientX, clientY) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = playerX;
    this.y = playerY;
    // https://gist.github.com/conorbuck/2606166
    this.angleRadians = Math.atan2(clientY - playerY, clientX - playerX) * 180 / Math.PI;
    this.velocity = 0.25;
    this.vx = (clientX - playerX).map(-550, 1000, -50, 50) * this.velocity;
    this.vy = (clientY - playerY).map(-100, 600, -50, 50) * this.velocity;
    this.size = 30;
    this.imageEn = new Image();
    this.imageEn.src = "images/bullet.png";
    this.alive = true;
  }

  kill(){
    this.alive = false;
  }
  
  draw() {
    if (this.alive) {
      this.ctx.fillStyle = this.color;
      this.ctx.drawImage(this.imageEn, this.x +15 , this.y +20, this.size, this.size);
    }
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
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
      return obstacle.id;
    } else {
      return false;
    }
  }

}

// https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}