class Obstacle {
  constructor(id, ctx, canvas, direction, type, game) {
    this.id = id;
    this.ctx = ctx;
    this.canvas = canvas;
    this.direction = direction;
    this.type = type; // 0: Goomba, 1: Metroid, 2: Robot, 3: Alien, 4: Slime
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.size = type === 2 ? 40 : 30; // Robot is bigger
    this.hp = type === 2 ? 3 : 1;
    this.shootTimer = 0;
    
    this.imageEn = new Image();
    if (type === 0 || type === 4) this.imageEn.src = "images/goomba.png";
    else this.imageEn.src = "images/metroid.png";
    
    this.alive = true;
  }

  kill() {
    this.alive = false;
  }

  calculateInits() {
    const spd = this.type === 0 ? 60 : (this.type === 1 ? 150 : 80);

    if (this.direction == 0) {
      this.x = Math.random() * this.canvas.width;
      this.y = this.canvas.height + this.size;
      this.speedX = 0;
      this.speedY = -spd;
    }
    if (this.direction == 1) {
      this.x = Math.random() * this.canvas.width;
      this.y = -this.size;
      this.speedX = 0;
      this.speedY = spd;
    }
    if (this.direction == 2) {
      this.x = -this.size;
      this.y = Math.random() * this.canvas.height;
      this.speedX = spd;
      this.speedY = 0;
    }
    if (this.direction == 3) {
      this.x = this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.speedX = -spd;
      this.speedY = 0;
    }
  }

  draw() {
    if (!this.alive) return;
    this.ctx.save();
    
    if (this.type === 2) {
      this.ctx.filter = 'grayscale(100%) brightness(50%)'; // Robot is dark
    } else if (this.type === 3) {
      this.ctx.filter = 'hue-rotate(90deg)'; // Alien is green
    } else if (this.type === 4) {
      this.ctx.filter = 'hue-rotate(270deg)'; // Slime is purple
    }

    this.ctx.drawImage(this.imageEn, this.x, this.y, this.size, this.size);
    this.ctx.restore();
  }

  move(deltaTime) {
    if (!deltaTime) return;

    if (this.type === 4 && this.game.player) {
      const dx = this.game.player.x - this.x;
      const dy = this.game.player.y - this.y;
      const m = Math.sqrt(dx*dx + dy*dy);
      if (m > 0) {
         this.speedX = (dx/m) * 70;
         this.speedY = (dy/m) * 70;
      }
    }

    this.x += this.speedX * deltaTime;
    this.y += this.speedY * deltaTime;

    if (this.type === 3 && this.game.player) {
      this.shootTimer += deltaTime;
      if (this.shootTimer > 2.5) {
         this.shootTimer = 0;
         let bullet = new Bullet(
           this.canvas, this.ctx, this.x, this.y, this.game.player.x, this.game.player.y
         );
         bullet.isEnemy = true;
         this.game.enemyBullets.push(bullet);
      }
    }

    if (this.x < -200 || this.x > this.canvas.width + 200 ||
        this.y < -200 || this.y > this.canvas.height + 200) {
        this.kill();
    }
  }
}

class PowerUp {
  constructor(ctx, canvas, x, y, type) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.size = 20;
    this.type = type; // 0: Immunity, 1: RapidFire, 2: Bomb
    this.alive = true;
    this.lifeTime = 10; // Disappears after 10 seconds
  }

  kill() {
    this.alive = false;
  }

  draw() {
    if (!this.alive) return;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(this.x + this.size/2, this.y + this.size/2, this.size/2, 0, Math.PI * 2);
    if (this.type === 0) this.ctx.fillStyle = 'blue';
    else if (this.type === 1) this.ctx.fillStyle = 'orange';
    else if (this.type === 2) this.ctx.fillStyle = 'red';
    this.ctx.fill();
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    let char = this.type === 0 ? 'I' : (this.type === 1 ? 'S' : 'B');
    this.ctx.fillText(char, this.x + this.size/2, this.y + this.size/2);
    this.ctx.restore();
  }

  move(deltaTime) {
    if (!deltaTime) return;
    this.lifeTime -= deltaTime;
    if (this.lifeTime <= 0) this.kill();
  }
}
