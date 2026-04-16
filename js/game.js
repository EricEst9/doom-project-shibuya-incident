"use strict";

class Game {
  constructor(musicEnabled = true, isEasyMode = false) {
    this.canvas = null;
    this.ctx = null;
    this.obstacles = [];
    this.bullets = [];
    this.enemyBullets = [];
    this.powerups = [];
    this.player = null;
    this.gameIsOver = false;
    this.score = 0;
    this.finalScore = 0;
    this.timer = 60;
    this.accumulatedTime = 0;
    this.animationId = null;
    this.lastTime = 0;
    this.isEasyMode = isEasyMode;
    this.activeMusic = null;
    this.activeEndSfx = null;

    // --- MUSIC TRACKS ---
    this.musicIntro = new Audio();
    this.musicIntro.src = "music/musicainicio.mp3";
    this.musicCanvas = new Audio();
    this.musicCanvas.src = "music/backgroundsong8bit.mp3";
    this.musicWin = new Audio();
    this.musicWin.src = "music/win3.mp3";
    this.musicLose = new Audio();
    this.musicLose.src = "music/ending.mp3";

    // --- SFX TRACKS ---
    this.musicShot = new Audio();
    this.musicShot.src = "music/ bullet.mp3";
    this.musicDeath = new Audio();
    this.musicDeath.src = "music/enemy.mp3";
  }

  getMusicTracks() {
    return [this.musicIntro, this.musicCanvas];
  }

  updateVolume() {
    this.updateMusicState();
  }

  updateMusicState() {
    let musicVol = window.appAudioMuted ? 0 : window.appAudioVolume;
    
    // Apply changes to all music tracks instantly
    this.getMusicTracks().forEach(track => {
      track.volume = musicVol;
      track.muted = window.appAudioMuted;
    });

    // Handle pausing/resuming real playback
    if (this.activeMusic) {
      if (window.appAudioMuted && !this.activeMusic.paused) {
        this.activeMusic.pause();
      } else if (!window.appAudioMuted && this.activeMusic.paused) {
        this.activeMusic.play().catch(e => console.log("Autoplay blocked", e));
      }
    }
  }

  playMusic(track, loop = false) {
    // Stop currently active track before playing the new one
    if (this.activeMusic && this.activeMusic !== track) {
      this.activeMusic.pause();
      this.activeMusic.currentTime = 0;
    }
    
    this.activeMusic = track;
    this.activeMusic.loop = loop;
    this.activeMusic.volume = window.appAudioMuted ? 0 : window.appAudioVolume;
    this.activeMusic.muted = window.appAudioMuted;

    if (!window.appAudioMuted) {
      this.activeMusic.play().catch(e => console.log("Autoplay blocked", e));
    }
  }

  playSFX(track) {
    if (window.appSfxMuted) return; // Completely decouple SFX from Music flag
    let clone = track.cloneNode();
    clone.volume = window.appAudioVolume; // Adjust clone volume accurately
    clone.play().catch(e => console.log("SFX autoplay blocked", e));
  }

  playEndSfx(track) {
    if (window.appSfxMuted) return; // Managed as pure SFX

    if (this.activeEndSfx && this.activeEndSfx !== track) {
      this.activeEndSfx.pause();
      this.activeEndSfx.currentTime = 0;
    }
    
    this.activeEndSfx = track;
    this.activeEndSfx.volume = window.appAudioVolume;
    this.activeEndSfx.currentTime = 0;
    
    this.activeEndSfx.play().catch(e => console.log("End SFX blocked", e));
  }

  start() {
    this.canvas = document.querySelector("canvas");
    this.ctx = canvas.getContext("2d");

    // Play background music
    this.playMusic(this.musicCanvas, true);

    this.handleShootInput = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const targetX = (clientX - rect.left) * scaleX;
      const targetY = (clientY - rect.top) * scaleY;

      if (this.player.rapidFireTimer > 0) {
        let pCenterX = this.player.x + 30;
        let pCenterY = this.player.y + 30;
        let dx = targetX - pCenterX;
        let dy = targetY - pCenterY;
        let angle = Math.atan2(dy, dx);
        let dist = Math.sqrt(dx*dx + dy*dy);
        const angles = [-0.15, 0, 0.15];
        angles.forEach(a => {
           let nAngle = angle + a;
           let tX = pCenterX + Math.cos(nAngle) * dist;
           let tY = pCenterY + Math.sin(nAngle) * dist;
           let bullet = new Bullet(
             this.canvas, this.ctx, this.player.x, this.player.y, tX, tY
           );
           this.bullets.push(bullet);
        });
      } else {
        let bullet = new Bullet(
          this.canvas,
          this.ctx,
          this.player.x,
          this.player.y,
          targetX,
          targetY
        );
        this.bullets.push(bullet);
      }
      
      this.playSFX(this.musicShot); // Uses separated SFX logic exclusively
    };

    this.handleMouseDown = (event) => {
      event.preventDefault();
      this.handleShootInput(event.clientX, event.clientY);
    };

    this.handleTouchStartCanvas = (event) => {
      event.preventDefault(); // Prevent scrolling on tap
      for (let i = 0; i < event.changedTouches.length; i++) {
        let t = event.changedTouches[i];
        this.handleShootInput(t.clientX, t.clientY);
      }
    };

    this.player = new Player(this.canvas);

    this.handleKeyboard = (event) => {
      if (event.type === "keydown") {
        if (event.code === "ArrowUp" || event.code === "KeyW") this.player.setDirection("up");
        else if (event.code === "ArrowDown" || event.code === "KeyS") this.player.setDirection("down");
        else if (event.code === "ArrowLeft" || event.code === "KeyA") this.player.setDirection("left");
        else if (event.code === "ArrowRight" || event.code === "KeyD") this.player.setDirection("right");
      } else if (event.type === "keyup") {
        this.player.setDirection(null);
      }
    };

    document.body.addEventListener("keydown", this.handleKeyboard);
    document.body.addEventListener("keyup", this.handleKeyboard);
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("touchstart", this.handleTouchStartCanvas);

    // Touch controls bindings
    const bindTouchDir = (id, dir) => {
      let btn = document.getElementById(id);
      if(btn) {
        btn.addEventListener("touchstart", (e) => { e.preventDefault(); e.stopPropagation(); this.player.setDirection(dir); });
        btn.addEventListener("touchend", (e) => { e.preventDefault(); e.stopPropagation(); this.player.setDirection(null); });
      }
    };
    bindTouchDir('btn-up', 'up');
    bindTouchDir('btn-down', 'down');
    bindTouchDir('btn-left', 'left');
    bindTouchDir('btn-right', 'right');

    this.lastTime = performance.now();
    this.startLoop();
  }

  stopActiveAudio() {
    // Forcefully stop and reset all tracks specific to this game instance
    this.getMusicTracks().forEach(track => {
      if (track) {
        track.pause();
        track.currentTime = 0;
      }
    });
    this.activeMusic = null;

    if (this.activeEndSfx) {
      this.activeEndSfx.pause();
      this.activeEndSfx.currentTime = 0;
      this.activeEndSfx = null;
    }
  }

  terminate() {
      this.gameIsOver = true;
      if (this.animationId) cancelAnimationFrame(this.animationId);
      
      this.stopActiveAudio();
      
      document.body.removeEventListener("keydown", this.handleKeyboard);
      document.body.removeEventListener("keyup", this.handleKeyboard);
      this.canvas.removeEventListener("mousedown", this.handleMouseDown);
      this.canvas.removeEventListener("touchstart", this.handleTouchStartCanvas);
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

      // Escalation and Spawning
      let escalationFactor = this.isEasyMode ? 1 : 1 + (60 - this.timer) * 0.1;
      let spawnRate = (this.isEasyMode ? 0.3 : 0.6) * escalationFactor * deltaTime;

      if (Math.random() < spawnRate) {
        let type;
        if (this.isEasyMode) {
           type = Math.random() < 0.8 ? 0 : 4; // Mostly goomba, some slime
        } else {
           let rand = Math.random();
           if (rand < 0.4) type = 0;       // Goomba (40%)
           else if (rand < 0.7) type = 1;  // Metroid (30%)
           else if (rand < 0.85) type = 2; // Robot (15%)
           else if (rand < 0.95) type = 3; // Alien (10%)
           else type = 4;                  // Slime (5%)
        }
        let newObstacle = new Obstacle(
          Date.now() + Math.random(),
          this.ctx,
          this.canvas,
          Math.floor(Math.random() * 4),
          type,
          this
        );
        newObstacle.calculateInits();
        this.obstacles.push(newObstacle);
      }

      if (!this.isEasyMode && Math.random() < 0.05 * deltaTime) { // Powerup drop
         let type = Math.floor(Math.random() * 3);
         let pX = Math.random() * (this.canvas.width - 40) + 20;
         let pY = Math.random() * (this.canvas.height - 40) + 20;
         this.powerups.push(new PowerUp(this.ctx, this.canvas, pX, pY, type));
      }

      // UPDATE ENTITIES
      this.player.update(deltaTime);
      this.obstacles.forEach((obstacle) => obstacle.move(deltaTime));
      this.bullets.forEach((bullet) => bullet.move(deltaTime));
      this.enemyBullets.forEach((bullet) => bullet.move(deltaTime));
      this.powerups.forEach((powerup) => powerup.move(deltaTime));

      this.checkCollisions();

      // GARBAGE COLLECTION
      this.obstacles = this.obstacles.filter(o => o.alive);
      this.bullets = this.bullets.filter(b => b.alive);
      this.enemyBullets = this.enemyBullets.filter(b => b.alive);
      this.powerups = this.powerups.filter(p => p.alive);

      // DRAW
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.powerups.forEach((powerup) => powerup.draw());
      this.player.draw();
      this.obstacles.forEach((obstacle) => obstacle.draw());
      this.bullets.forEach((bullet) => bullet.draw());
      this.enemyBullets.forEach((bullet) => bullet.draw());

      this.printTime();

      // GAME STATE
      if (!this.gameIsOver && this.timer > 0) {
        this.animationId = window.requestAnimationFrame(loop);
      } else if (!this.gameIsOver && this.timer <= 0) {
        this.terminate();
        buildYouWin();
        this.finalScore = this.score;
        document.querySelector("#SCORE1").innerText = this.finalScore;
        this.playEndSfx(this.musicWin);
      } else {
        this.terminate();
        buildGameOver();
        this.playEndSfx(this.musicLose);
      }
    };

    this.animationId = window.requestAnimationFrame(loop);
  }

  checkCollisions() {
    this.powerups.forEach(p => {
       if (this.player.didCollide(p) && p.alive) {
          p.kill();
          if (p.type === 0) this.player.immunityTimer = 5;
          if (p.type === 1) this.player.rapidFireTimer = 5;
          if (p.type === 2) { 
             this.obstacles.forEach(o => o.kill());
             this.enemyBullets.forEach(b => b.kill());
             this.score += 100;
             document.querySelector("#score").innerText = this.score;
          }
       }
    });

    this.enemyBullets.forEach((bullet) => {
      if (this.player.didCollide(bullet) && bullet.alive && this.player.immunityTimer <= 0) {
        this.gameIsOver = true;
      }
    });

    this.obstacles.forEach((obstacle) => {
      if (this.player.didCollide(obstacle) && obstacle.alive && this.player.immunityTimer <= 0) {
        this.gameIsOver = true;
      }
      this.bullets.forEach((bullet) => {
        if (bullet.didCollide(obstacle) && obstacle.alive && bullet.alive) {
          bullet.kill();
          obstacle.hp -= 1;
          if (obstacle.hp <= 0) {
            obstacle.kill();
            this.playSFX(this.musicDeath); // SFX completely uncoupled
            this.score += (obstacle.type === 2 ? 50 : 25);
            document.querySelector("#score").innerText = this.score;
          }
        }
      });
    });
  }
}
