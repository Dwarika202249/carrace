const score = document.querySelector(".score");
const highScore = document.querySelector(".highScore");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const sound = document.getElementById("sound");
const bgm = document.getElementById("bgm");

// console.log(gameArea);

startScreen.addEventListener("click", start);
// document.addEventListener('space', start);

let player = {
  speed: 15,
  score: 0,
  highScore: 0,
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
document.addEventListener('touchstart', touchStart);
document.addEventListener('touchend', touchEnd);

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

function touchEnd() {
    keys.ArrowLeft = false;
    keys.ArrowRight = false;
}

function keyDown(e) {
  e.preventDefault();
  keys[e.key] = true;
  // console.log(e.key);
  // console.log(keys);
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

function updateHighScore() {
    let highscore = localStorage.getItem('highScore');
    if (highscore === null || player.score > parseInt(highscore)) {
        localStorage.setItem('highScore', player.score);
        highScore.innerHTML = "High Score : " + player.score;
        celebrateNewHighScore();
    }
}

function celebrateNewHighScore() {
    // Show celebration pop-up
    const celebrationPopup = document.createElement('div');
    celebrationPopup.classList.add('celebration-popup');
    celebrationPopup.innerHTML = "New High Score: " + player.score;
    document.body.appendChild(celebrationPopup);

    // Play celebration audio
    const celebrationSound = new Audio('./audio/celebration.mp3');
    celebrationSound.play();

    // Remove pop-up and audio after some time (e.g., 5 seconds)
    setTimeout(() => {
        celebrationPopup.remove();
        celebrationSound.pause();
        celebrationSound.currentTime = 0;
    }, 5000);
}

function endGame() {
  player.start = false;
  startScreen.classList.remove("hide");
  startScreen.innerHTML =
    "Game Over <br> Your final score is " +
    player.score +
    "<br> Press here to restart the Game";
    updateHighScore();
}

function moveEnemy(car) {
  let enemy = document.querySelectorAll(".enemy");
  enemy.forEach(function (item) {
    if (isCollide(car, item)) {
      // console.log("boom hit");
      const soundFlag = true;
      if (soundFlag) {
        sound.pause();
        sound.currentTime = 0;
        sound.play();
        // soundFlag = false;
      }
      bgm.pause();
      bgm.currentTime = 0;
      endGame();
      // HighScore();
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
  // console.log("heyy i am clicked");
  let car = document.querySelector(".car");
  let road = gameArea.getBoundingClientRect();
  // console.log(road);

  if (player.start) {
    bgm.play();
    moveLines();
    moveEnemy(car);

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
    // console.log(player.score++);

    player.score++;
    let ps = player.score - 1;
    score.innerHTML = "Score : " + ps;
  }
}

function start() {
  // gameArea.classList.remove('hide');
  startScreen.classList.add("hide");
  gameArea.innerHTML = "";

  player.start = true;
  player.score = 0;
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
  // car.innerHTML = "Hey i am ur car";
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
  }
}

function randomColor() {
  function c() {
    let hex = Math.floor(Math.random() * 256).toString(16);
    return ("0" + String(hex)).substr(-2);
  }
  return "#" + c() + c() + c();
}
