window.appAudioVolume = 0.5;
window.appAudioMuted = false;
window.appSfxMuted = false;

function getAudioUI() {
  return `
    <div class="audio-controls">
      <label class="audio-label audio-toggle-label">
        <input type="checkbox" id="music-toggle" ${window.appAudioMuted ? '' : 'checked'} />
        Music On/Off
      </label>
      <label class="audio-label audio-toggle-label">
        <input type="checkbox" id="sfx-toggle" ${window.appSfxMuted ? '' : 'checked'} />
        SFX On/Off
      </label>
      <label class="audio-label audio-volume-label">
        Music Volume: <span id="vol-display">${Math.round(window.appAudioVolume * 100)}%</span><br/>
        <input
          type="range"
          id="vol-slider"
          min="0"
          max="1"
          step="0.01"
          value="${window.appAudioVolume}"
          class="audio-slider"
        />
      </label>
    </div>
  `;
}

function attachAudioEvents() {
  const musicToggle = document.getElementById("music-toggle");
  const sfxToggle = document.getElementById("sfx-toggle");
  const slider = document.getElementById("vol-slider");
  const display = document.getElementById("vol-display");
  if (musicToggle) {
    musicToggle.addEventListener("change", (e) => {
      window.appAudioMuted = !e.target.checked;
      if (window.currentGame) window.currentGame.updateVolume();
    });
  }
  if (sfxToggle) {
    sfxToggle.addEventListener("change", (e) => {
      window.appSfxMuted = !e.target.checked;
      if (window.currentGame) window.currentGame.updateVolume();
    });
  }
  if (slider) {
    slider.addEventListener("input", (e) => {
      window.appAudioVolume = parseFloat(e.target.value);
      if (display) display.innerText = Math.round(window.appAudioVolume * 100) + "%";
      if (window.currentGame) window.currentGame.updateVolume();
    });
  }
}

const buildDom = (html) => {
  const main = document.querySelector("main");
  main.innerHTML = html;
};

// First Screen => Splash Screen
const buildSplashScreen = () => {
  buildDom(`
  <img src="./images/logo.png" alt="Logo" class="responsive-img-logo banner-img" />
  <div class="buttons-row">
    <button id="start-button-easy">Easy Mode</button>
    <button id="start-button-normal">Normal Mode</button>
  </div>
  <div class="pointer responsive-container"> 
    <img src="./images/instructions.png" alt="Instructions" class="responsive-img" />
    <br />
    ${getAudioUI()}
  </div>
  `);
  attachAudioEvents();
  const easyBtn = document.getElementById("start-button-easy");
  const normalBtn = document.getElementById("start-button-normal");
  easyBtn.addEventListener("click", () => buildGameScreen(true));
  normalBtn.addEventListener("click", () => buildGameScreen(false));
};

// Second Screen => Game Screen
const buildGameScreen = (isEasyMode = false) => {
  buildDom(`
  <div id="game-ui-header">
    <section id="clock">
          <span>SURVIVE:&nbsp;</span>
          <span id="secDec" class="number">0</span><span id="secUni" class="number">0</span>
    </section>
    <div class="container-score">
          <p class="score-info"><span>Score:&nbsp;</span> <span id="score">0</span></p>
    </div>
  </div>

  <div id="game-board">
    <canvas id="canvas" width="1000" height="600"></canvas>
    <div id="touch-controls" class="hide-desktop">
      <button class="dpad-btn" id="btn-up">↑</button>
      <div class="dpad-row">
        <button class="dpad-btn" id="btn-left">←</button>
        <button class="dpad-btn" id="btn-down">↓</button>
        <button class="dpad-btn" id="btn-right">→</button>
      </div>
    </div>
  </div>  

  <div class="game-footer-ui">
    ${getAudioUI()}
    <button id="end-button">End Game</button>
  </div>
  `);
  attachAudioEvents();

  const endButton = document.getElementById("end-button");
  endButton.addEventListener("click", () => {
    if (window.currentGame) window.currentGame.terminate();
    buildGameOver();
  });

  window.currentGame = new Game(true, isEasyMode);
  window.currentGame.start();
};

// Third Screen => Game Over
const buildGameOver = () => {
  buildDom(`
  <section class="game-over responsive-container">
  <h1>Game Over</h1>
  <button id="game-restart"> TRY AGAIN</button>
  <div class="pointer"> 
    <img src="images/gameover.jpeg" alt="Game Over" class="responsive-img" />
    <br />
    ${getAudioUI()}
  </div>
  </section>
  `);
  attachAudioEvents();
  document.getElementById("game-restart").addEventListener("click", () => {
    if (window.currentGame) window.currentGame.stopActiveAudio();
    buildSplashScreen();
  });
};

const buildYouWin = () => {
  buildDom(`
  <section class="You-Win responsive-container">
  <h1>You Win</h1>
  <button id="game-restart-win"> TRY AGAIN</button>
  <div class="pointer"> 
    <section id="SCORE">
          <span>SCORE:&nbsp;</span>
          <span id="SCORE1" class="number">0</span>
    </section>
    <img src="images/background.jpeg" alt="Win Background" class="responsive-img" />
    <br />
    ${getAudioUI()}
  </div>
  </section>
  `);
  attachAudioEvents();
  document.getElementById("game-restart-win").addEventListener("click", () => {
    if (window.currentGame) window.currentGame.stopActiveAudio();
    buildSplashScreen();
  });
};

window.addEventListener("load", buildSplashScreen);
