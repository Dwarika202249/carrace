const score = document.querySelector(".score");
const highScore = document.querySelector(".highScore");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const sound = document.getElementById("sound");
const bgm = document.getElementById("bgm");
const coinSound = new Audio("./audio/coin.mp3");
const coinCount = document.querySelector(".coinCount");

document.addEventListener("DOMContentLoaded", () => {
  const levelButtons = document.querySelectorAll(".startScreen button");
  levelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Extract difficulty level from the button's data-level attribute
      const difficulty = button.getAttribute("data-level");
      setDifficulty(difficulty);
      start(); // Start the game after choosing the difficulty level
    });
  });
});

let player = {
  speed: 0,
  score: 0,
  highScore: 0,
  newHighScore: false,
  coins: 0,
  paused: false,
};

let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  Space: false,
};

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// adding for mobile plays
document.addEventListener("touchstart", touchStart);
document.addEventListener("touchend", touchEnd);

// Define difficulty levels
const difficultyLevels = {
  easy: { speed: 5 },
  medium: { speed: 10 },
  hard: { speed: 15 },
};

// Set the initial difficulty level
let currentDifficulty = "easy";
setDifficulty(currentDifficulty);

// Add these lines near the top of your script.js
const pauseButton = document.querySelector(".pauseButton");
pauseButton.addEventListener("click", togglePause);

// Add this function at the end of your script.js
function togglePause() {
  player.paused = !player.paused;
  if (player.paused) {
    pauseButton.textContent = "<>";
    bgm.pause();
    console.log("pause hua");
  } else {
    pauseButton.textContent = "||";
    window.requestAnimationFrame(gamePlay);
    console.log("play hoon");
    bgm.play();
  }
}

// function togglePause() {
//     player.paused = !player.paused;
//     if (!player.paused) {
//         // If unpausing, request the next animation frame
//         window.requestAnimationFrame(gamePlay);
//     }
// }

function setDifficulty(difficulty) {
  player.speed = difficultyLevels[difficulty].speed;
}

function touchStart(e) {
  e.preventDefault();
  // For simplicity, assume one touch point
  const touchX = e.touches[0].clientX;
  const touchY = e.touches[0].clientY;

  if (touchX < window.innerWidth / 2) {
    keys.ArrowLeft = true;
    keys.ArrowRight = false;
  } else {
    keys.ArrowLeft = false;
    keys.ArrowRight = true;
  }
}

// Adding this event listener with the { passive: false } option for removing paasive warning for touch event in mobile
document.addEventListener("touchstart", touchStart, { passive: false });

function touchEnd() {
  keys.ArrowLeft = false;
  keys.ArrowRight = false;
}

function keyDown(e) {
  e.preventDefault();
  keys[e.key] = true;
}

function keyUp(e) {
  e.preventDefault();
  keys[e.key] = false;
}

function isCollide(a, b) {
  aRect = a.getBoundingClientRect();
  bRect = b.getBoundingClientRect();

  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function moveLines() {
  let lines = document.querySelectorAll(".lines");
  lines.forEach(function (item) {
    if (item.y >= 700) {
      item.y -= 750;
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

function moveCoins(car) {
  let coins = document.querySelectorAll(".coin");
  coins.forEach(function (item) {
    if (isCollide(car, item)) {
      item.style.display = "none"; // hide the coin
      player.coins++; // increment collected coins
      coinSound.play(); // play coin collection sound
      updateCoins(); // update the displayed collected coins
    }

    if (item.y >= 750) {
      item.y = -300;
      item.style.left = Math.floor(Math.random() * 350) + "px";
      item.style.display = "block"; // show the coin at a new position
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

function updateCoins() {
  const coinCount = document.querySelector(".coinCount");
  coinCount.classList.remove("hide");
  coinCount.innerHTML = "Coins: " + player.coins;
}

function celebrateNewHighScore() {
  // Show celebration pop-up
  const celebrationPopup = document.createElement("div");
  celebrationPopup.classList.add("celebration-popup");
  celebrationPopup.innerHTML = "New High Score: " + player.score;
  document.body.appendChild(celebrationPopup);

  // Play celebration audio
  const celebrationSound = new Audio("./audio/celebration.mp3");
  celebrationSound.play();

  // Remove pop-up and audio after some time (e.g., 5 seconds)
  setTimeout(() => {
    celebrationPopup.remove();
    celebrationSound.pause();
    celebrationSound.currentTime = 0;
    // After celebrating new high score, show game over div
    // endGame();
    player.score = player.score - 1;
    showGameOverDiv();
    goHome();
  }, 5000);
}

function endGame() {
  player.start = false;
  player.paused = !player.paused;

  // Check if a new high score is achieved before showing game over div
  updateHighScore();

  // If new high score is achieved, show high score div first
  if (player.newHighScore) {
    player.newHighScore = false;
    celebrateNewHighScore();
  } else {
    showGameOverDiv();
    goHome();
  }
}

function updateHighScore() {
  let highscore = localStorage.getItem("highScore");
  if (highscore === null || player.score > parseInt(highscore)) {
    localStorage.setItem("highScore", player.score);
    highScore.innerHTML = "High Score : " + player.score;
    player.newHighScore = true;
  }
}

function showGameOverDiv() {
  const pause = document.querySelector(".pauseButton")
  pause.classList.add("hide")
  // Show game over div
  const gameOverDiv = document.createElement("div");
  gameOverDiv.classList.add("gameOverDiv");
  gameOverDiv.innerHTML =
    "Game Over <br> Your final score is " +
    player.score +
    "<br> Click here to restart the Game";
  gameOverDiv.addEventListener("click", restartGame);
  document.body.appendChild(gameOverDiv);
}

function goHome() {
  const homeButton = document.createElement("div");
  homeButton.classList.add("homeButton");
  homeButton.innerHTML = "HOME";
  homeButton.addEventListener("click", goToStartScreen);
  document.body.appendChild(homeButton);
}

function goToStartScreen() {
  const homeButton = document.querySelector(".homeButton");
  player.paused = false;
  // Show the start screen
  startScreen.classList.remove("hide");

  const gameOverDiv = document.querySelector(".gameOverDiv");
  if (gameOverDiv) {
    gameOverDiv.remove();
    homeButton.remove();
  }
}

function continueGameAfterHighScore() {
  // Remove high score div and start the game again
  document.querySelector(".gameOverDiv").remove();
  start();
}

function restartGame() {
  // Remove game over div and start the game again
  document.querySelector(".gameOverDiv").remove();
  document.querySelector(".homeButton").remove();
  player.paused = !player.paused;
  start();
}

function moveEnemy(car) {
  let enemy = document.querySelectorAll(".enemy");
  enemy.forEach(function (item) {
    if (isCollide(car, item)) {
      const soundFlag = true;
      if (soundFlag) {
        sound.pause();
        sound.currentTime = 0;
        sound.play();
      }
      bgm.pause();
      bgm.currentTime = 0;
      endGame();
    }

    if (item.y >= 750) {
      item.y = -300;
      item.style.left = Math.floor(Math.random() * 350) + "px";
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

function gamePlay() {
  let car = document.querySelector(".car");
  let road = gameArea.getBoundingClientRect();

  // if (player.start) {
  if (!player.paused) {
    bgm.play();
    moveLines();
    moveEnemy(car);
    moveCoins(car);

    if (keys.ArrowUp && player.y > road.top + 70) {
      player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < road.bottom - 85) {
      player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < road.width - 70) {
      player.x += player.speed;
    }

    car.style.top = player.y + "px";
    car.style.left = player.x + "px";

    window.requestAnimationFrame(gamePlay);

    player.score++;
    let ps = player.score - 1;
    score.innerHTML = "Score : " + ps;
  }
}

function start() {
  startScreen.classList.add("hide");
  gameArea.innerHTML = "";
  const pause = document.querySelector(".pauseButton");
  pause.classList.remove("hide");

  player.start = true;
  player.score = 0;
  player.coins = 0; // Reset collected coins
  updateCoins(); // Initialize displayed coins

  window.requestAnimationFrame(gamePlay);

  for (x = 0; x < 5; x++) {
    let roadLine = document.createElement("div");
    roadLine.setAttribute("class", "lines");
    roadLine.y = x * 150;
    roadLine.style.top = roadLine.y + "px";
    gameArea.appendChild(roadLine);
  }
  let car = document.createElement("div");
  car.setAttribute("class", "car");
  gameArea.appendChild(car);

  player.x = car.offsetLeft;
  player.y = car.offsetTop;

  for (x = 0; x < 3; x++) {
    let enemyCar = document.createElement("div");
    enemyCar.setAttribute("class", "enemy");
    enemyCar.y = (x + 1) * 350 * -1;
    enemyCar.style.top = enemyCar.y + "px";
    enemyCar.style.backgroundColor = randomColor();
    enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
    gameArea.appendChild(enemyCar);
    // console.log("enemy hoon");
  }

  for (let x = 0; x < 3; x++) {
    let coin = document.createElement("div");
    coin.setAttribute("class", "coin");
    coin.y = (x + 1) * 400 * -1;
    coin.style.top = coin.y + "px";
    coin.style.left = Math.floor(Math.random() * 350) + "px";
    gameArea.appendChild(coin);
    // console.log("coin hoon");
  }
}

function randomColor() {
  function c() {
    let hex = Math.floor(Math.random() * 256).toString(16);
    return ("0" + String(hex)).substr(-2);
  }
  return "#" + c() + c() + c();
}
