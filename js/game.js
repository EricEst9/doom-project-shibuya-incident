"use strict";

class Game {
  constructor(musicEnabled = true) {
    this.canvas = null;
    this.ctx = null;
    this.obstacles = [];
    this.player = null;
    this.gameIsOver = false;
    this.score = 0;
    this.finalScore = 0;
    this.timer = 60;
    this.accumulatedTime = 0;
    this.animationId = null;
    this.lastTime = 0;
    this.musicEnabled = musicEnabled;

    this.musicIntro = new Audio();
    this.musicIntro.src = "music/musicainicio.mp3";
    this.musicCanvas = new Audio();
    this.musicCanvas.src = "music/backgroundsong8bit.mp3";
    this.musicWin = new Audio();
    this.musicWin.src = "music/win3.mp3";
    this.musicLose = new Audio();
    this.musicLose.src = "music/ending.mp3";
    this.musicShot = new Audio();
    this.musicShot.src = "music/ bullet.mp3";
    this.musicDeath = new Audio();
    this.musicDeath.src = "music/enemy.mp3";
  }

  start() {
    this.canvas = document.querySelector("canvas");
    this.ctx = canvas.getContext("2d");

    if (this.musicEnabled) {
      this.musicCanvas.play();
    }

    this.bullets = [];
    this.handleMouseDown = (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const targetX = event.clientX - rect.left;
      const targetY = event.clientY - rect.top;

      let bullet = new Bullet(
        this.canvas,
        this.ctx,
        this.player.x,
        this.player.y,
        targetX,
        targetY
      );
      this.bullets.push(bullet);
      if (this.musicEnabled) this.musicShot.cloneNode().play();
    };

    this.player = new Player(this.canvas);

    this.handleKeyboard = (event) => {
      if (event.type === "keydown") {
        if (event.code === "ArrowUp" || event.code === "KeyW") {
          this.player.setDirection("up");
        } else if (event.code === "ArrowDown" || event.code === "KeyS") {
          this.player.setDirection("down");
        } else if (event.code === "ArrowLeft" || event.code === "KeyA") {
          this.player.setDirection("left");
        } else if (event.code === "ArrowRight" || event.code === "KeyD") {
          this.player.setDirection("right");
        }
      } else if (event.type === "keyup") {
        this.player.setDirection(null);
      }
    };

    document.body.addEventListener("keydown", this.handleKeyboard);
    document.body.addEventListener("keyup", this.handleKeyboard);
    this.canvas.addEventListener("mousedown", this.handleMouseDown);

    this.lastTime = performance.now();
    this.startLoop();
  }

  terminate() {
      this.gameIsOver = true;
      if (this.animationId) cancelAnimationFrame(this.animationId);
      this.musicCanvas.pause();
      document.body.removeEventListener("keydown", this.handleKeyboard);
      document.body.removeEventListener("keyup", this.handleKeyboard);
      this.canvas.removeEventListener("mousedown", this.handleMouseDown);
  }

  printTime() {
    const time = ("0" + Math.max(0, Math.floor(this.timer))).slice(-2);
    document.getElementById("secDec").innerText = time[0];
    document.getElementById("secUni").innerText = time[1];
  }

  startLoop() {
    const loop = (timestamp) => {
      let deltaTime = (timestamp - this.lastTime) / 1000;
      this.lastTime = timestamp;

      // Safety cap for deltaTime if we tab out
      if (deltaTime > 0.1) deltaTime = 0.1;

      this.accumulatedTime += deltaTime;
      if (this.accumulatedTime >= 1) {
          this.timer -= 1;
          this.accumulatedTime -= 1;
      }

      // We create the obstacles
      // The probability should be adjusted to deltaTime so it behaves uniformly
      let spawnRate = 0.5 * deltaTime; // Approx half chance per second
      if (Math.random() < spawnRate) {
        let newObstacle = new Obstacle(
          Date.now() + Math.random(),
          this.ctx,
          this.canvas,
          Math.floor(Math.random() * 4),
          Math.floor(Math.random() * 2)
        );
        newObstacle.calculateInits();
        this.obstacles.push(newObstacle);
      }

      // UPDATE ENTITIES
      this.player.update(deltaTime);
      this.obstacles.forEach((obstacle) => obstacle.move(deltaTime));
      this.bullets.forEach((bullet) => bullet.move(deltaTime));

      this.checkCollisions();

      // GARBAGE COLLECTION
      this.obstacles = this.obstacles.filter(o => o.alive);
      this.bullets = this.bullets.filter(b => b.alive);

      // DRAW
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.player.draw();
      this.obstacles.forEach((obstacle) => obstacle.draw());
      this.bullets.forEach((bullet) => bullet.draw());

      this.printTime();

      // GAME STATE
      if (!this.gameIsOver && this.timer > 0) {
        this.animationId = window.requestAnimationFrame(loop);
      } else if (!this.gameIsOver && this.timer <= 0) {
        this.terminate();
        buildYouWin();
        this.finalScore = this.score;
        document.querySelector("#SCORE1").innerText = this.finalScore;
        if (this.musicEnabled) this.musicWin.play();
      } else {
        this.terminate();
        buildGameOver();
        if (this.musicEnabled) this.musicLose.play();
      }
    };

    this.animationId = window.requestAnimationFrame(loop);
  }

  checkCollisions() {
    this.obstacles.forEach((obstacle) => {
      if (this.player.didCollide(obstacle) && obstacle.alive) {
        this.gameIsOver = true;
      }
      this.bullets.forEach((bullet) => {
        if (bullet.didCollide(obstacle) && obstacle.alive && bullet.alive) {
          obstacle.kill();
          bullet.kill();
          if (this.musicEnabled) this.musicDeath.cloneNode().play();
          this.score += 25;
          document.querySelector("#score").innerText = this.score;
        }
      });
    });
  }
}
