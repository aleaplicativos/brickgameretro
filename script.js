let isOn = false;
let end = false;
let intervalMiliseconds = 100;
let cont = 0;
let kartPosition = 0;
let grid = [];
let interval = null;
let audio = null;
let stoppedSoundOnce = false;
const borders = [1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1];
let opponents = [];
const clearGrid = () => {
  grid = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
  ];
};
const setBorders = () => {
  grid = grid.map((r, index) => {
    return [borders[index], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], borders[index]];
  });
  const lastValue = borders.pop();
  borders.unshift(lastValue);
};
const setKartPosition = () => {
  grid[16][3] = Number(!kartPosition);
  grid[16][6] = Number(kartPosition);
  grid[17][2] = Number(!kartPosition);
  grid[17][3] = Number(!kartPosition);
  grid[17][4] = Number(!kartPosition);
  grid[17][5] = Number(kartPosition);
  grid[17][6] = Number(kartPosition);
  grid[17][7] = Number(kartPosition);
  grid[18][3] = Number(!kartPosition);
  grid[18][6] = Number(kartPosition);
  grid[19][2] = Number(!kartPosition);
  grid[19][4] = Number(!kartPosition);
  grid[19][5] = Number(kartPosition);
  grid[19][7] = Number(kartPosition);
};
const setOpponents = () => {
  opponents = opponents
    .map(o => [o[0] + 1, o[1]])
    .filter(o => o[0] < 25);
  opponents.forEach(opponent => {
    const isLeft = !opponent[1];
    const y = opponent[0];
    if (y < 20) {
      const x1 = isLeft ? 2 : 5;
      const x2 = isLeft ? 4 : 7;
      grid[y][x1] = 1;
      grid[y][x2] = 1;
    }
    if (y < 21 && y > 0) {
      const x = isLeft ? 3 : 6;
      grid[y - 1][x] = 1;
    }
    if (y < 22 && y > 1) {
      const x1 = isLeft ? 2 : 5;
      const x2 = isLeft ? 3 : 6;
      const x3 = isLeft ? 4 : 7;
      grid[y - 2][x1] = 1;
      grid[y - 2][x2] = 1;
      grid[y - 2][x3] = 1;
    }
    if (y < 23 && y > 2) {
      const x = isLeft ? 3 : 6;
      grid[y - 3][x] = 1;
    }
  });
}
const addOpponent = () => {
  opponents.push([0, Math.round(Math.random())]);
};
const setScore = () => {
  document.getElementById("score").innerText = cont.toString();
}
const render = () => {
  if (grid.length) {
    const gameDiv = document.getElementById('grid');
    gameDiv.innerHTML = '';
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 10; j++) {
        const square = document.createElement('div');
        square.className = 'square';
        square.style.gridArea = `${i+1} / ${j+1} / ${i+2} / ${j+2}`;
        if (grid[i][j]) {
          square.className += ' selected';
        }
        gameDiv.appendChild(square);
      }
    }
  }
};
const checkCollision = () => {
  if (opponents.find(o => o[0] > 15 && o[1] === kartPosition)) {
    if (interval) {
      clearInterval(interval);
      grid = [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [1,1,1,0,1,0,1,0,0,1],
        [1,0,0,0,1,0,1,1,1,1],
        [1,,0,0,1,0,1,0,0,1],
        [1,1,0,0,1,0,1,0,0,1],
        [1,0,0,0,1,0,1,0,0,1],
        [1,0,0,0,1,0,1,0,0,1],
        [1,0,0,0,1,0,1,0,0,1],
        [1,0,0,0,1,0,1,0,0,1],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
      ];
      render();
      cont = 0;
      opponents = [];
      end = true;
      intervalMiliseconds = 100;
    }
  }
};
function sound(forceStart = false) {
  if (!forceStart) {
    stoppedSoundOnce = true;
  }
  if (forceStart || !audio) {
    if (audio) {
      audio.pause();
      audio = null;
    }
    audio = new Audio('/sounds/game-music.mp3');
    audio.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
    audio.play();
  } else {
    audio.pause();
    audio = null;
  }
}
function left() {
  kartPosition = 0;
  setKartPosition();
  render();
}
function right() {
  kartPosition = 1;
  setKartPosition();
  render();
}
function setOn() {
  const screenMessage = document.getElementById("screen-message");
  screenMessage.style.display = "block";
  const gameDiv = document.getElementById('grid');
  gameDiv.style.display = "grid";
  grid = [
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,1],
    [0,0,1,1,1,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,0],
    [1,0,1,0,1,0,0,0,0,1],
  ];
  render();
  isOn = true;
}
function setOff() {
  const screenMessage = document.getElementById("screen-message");
  screenMessage.style.display = "none";
  const gameDiv = document.getElementById('grid');
  gameDiv.style.display = "none";
  isOn = false;
}
function start() {
  if (isOn) {
    setOff();
  } else {
    setOn();
  }
}
function play() {
  if (isOn) {
    if (!stoppedSoundOnce) {
      sound(true);
    }
    end = false;
    grid = [
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,1,0,0,0,0,0,1],
      [0,0,1,1,1,0,0,0,0,0],
      [0,0,0,1,0,0,0,0,0,0],
      [1,0,1,0,1,0,0,0,0,1],
    ];
    render();
    startTimeout();
  }
}
const iterate = () => {
  clearGrid();
  setBorders();
  setKartPosition();
  setOpponents();
  setScore();
  if (cont % 15 === 0) {
    addOpponent();
  }
  checkCollision();
  cont++;
  render();
}
const startTimeout = () => {
  if (interval) {
    clearTimeout(interval);
  }
  if (!end) {
    interval = setTimeout(() => {
      if (intervalMiliseconds > 20 && cont % 30 === 0) {
        intervalMiliseconds -= (10 / 100) * intervalMiliseconds;
      }
      iterate();
      startTimeout();
    }, intervalMiliseconds);
  }
}
function rotate() {
  const brickGame = document.getElementById("brick-game");
  brickGame.classList.toggle("rotated");
}
window.addEventListener('load', function() {
  document.onkeydown = key => {
    if (key.key === "ArrowRight") {
      right();
    } else if (key.key === "ArrowLeft") {
      left();
    } else if (key.key === " " && key.key === "Enter") {
      if (end) {
        play();
      }
    }
  };
  render();
});