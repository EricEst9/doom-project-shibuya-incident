// General function that will update the HTML content dinamically
const buildDom = (html) => {
  const main = document.querySelector("main");
  main.innerHTML = html;
};

// First Screen => Splash Screen
const buildSplashScreen = () => {
  buildDom(`
  <img src="./images/logo.png" alt="" style="width:50%;" />
  <br />
  <button id="start-button">Start Game</button>
  <div>&nbsp;</div>
  <div class= "pointer"> 
  <img src="./images/instructions.png" alt="" style="width:50%;" />
  <br />
  `);
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", buildGameScreen);
};

// Second Screen => Game Screen
const buildGameScreen = () => {
  buildDom(`
  <section id="clock">
        <span>SURVIVE:&nbsp;</span>
        <span id="secDec" class="number">0</span>
        <span id="secUni" class="number">0</span>
  </section>
    <div class="container-score">
        <p class="score-info"><span>Score:&nbsp;</span> <span id="score">0</span></p>
    </div>
  <div id="game-board">
  <canvas id="canvas" width="1000" height="600"></canvas>
  </div>  
  <button id="end-button">End Game</button>
  `);
  const endButton = document.getElementById("end-button");
  endButton.addEventListener("click", buildGameOver);

  const game = new Game();
  game.start();
};

// Third Screen => Game Over
const buildGameOver = () => {
  buildDom(`
  <section class="game-over">
  <h1>Game Over</h1>
  <button id = "game"> TRY AGAIN</button>
  <div class= "pointer"> 
  <img src="images/gameover.jpeg" alt="" style="width:50%;" />
  <br />
  </div>
  </section>
  `);

  const restartButton = document.querySelector("button");
  restartButton.addEventListener("click", buildSplashScreen);
};

const buildYouWin = () => {
  buildDom(`
  <section class="You-Win">
  <h1>You Win</h1>
  <button id = "game"> TRY AGAIN</button>
  <div class= "pointer"> 
  <section id="SCORE">
        <span>SCORE:&nbsp;</span>
        <span id="SCORE1" class="number">0</span>
  </section>
  <img src="images/background.jpeg" alt="" style="width:50%;" />
  <br />
  </div>
  </section>
  `);

  const restartButton = document.querySelector("button");
  restartButton.addEventListener("click", buildSplashScreen);
};

// When the window loads, then we will run the "buildSplashScreen" function
// "load" waits for the html and JS
window.addEventListener("load", buildSplashScreen);
