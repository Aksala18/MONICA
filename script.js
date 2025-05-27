const player = document.getElementById("player");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const objects = document.querySelectorAll(".object");
const barriers = document.querySelectorAll(".barrier");

// Inicializa com valores atuais do player (em px)
let posX = player.offsetLeft;
let posY = player.offsetTop;
const step = 10;
let lastPopupObject = null;


document.addEventListener("keydown", (e) => {
  let newX = posX;
  let newY = posY;

  switch (e.key) {
    case "ArrowUp":
      newY = Math.max(0, posY - step);
      break;
    case "ArrowDown":
      newY = Math.min(600 - player.offsetHeight, posY + step);
      break;
    case "ArrowLeft":
      newX = Math.max(0, posX - step);
      break;
    case "ArrowRight":
      newX = Math.min(800 - player.offsetWidth, posX + step);
      break;
    default:
      return; // se tecla não for seta, ignora
  }

  if (!isCollidingWithBarrier(newX, newY)) {
    posX = newX;
    posY = newY;
    player.style.left = posX + "px";
    player.style.top = posY + "px";
    checkCollision();
  }
});

function isCollidingWithBarrier(newX, newY) {
  const playerBox = {
    left: newX,
    top: newY,
    right: newX + player.offsetWidth,
    bottom: newY + player.offsetHeight,
  };

  for (const barrier of barriers) {
    const rect = barrier.getBoundingClientRect();
    const containerRect = document.getElementById("game-container").getBoundingClientRect();

    // Ajusta as posições da barreira relativamente ao container
    const barrierBox = {
      left: rect.left - containerRect.left,
      top: rect.top - containerRect.top,
      right: rect.right - containerRect.left,
      bottom: rect.bottom - containerRect.top,
    };

    const isColliding =
      playerBox.left < barrierBox.right &&
      playerBox.right > barrierBox.left &&
      playerBox.top < barrierBox.bottom &&
      playerBox.bottom > barrierBox.top;

    if (isColliding) return true;
  }

  return false;
}

function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const containerRect = document.getElementById("game-container").getBoundingClientRect();

  const playerCenterX = playerRect.left + playerRect.width / 2;
  const playerCenterY = playerRect.top + playerRect.height / 2;

  let collided = false;

  objects.forEach((obj) => {
    const objRect = obj.getBoundingClientRect();

    const withinX = playerCenterX >= objRect.left && playerCenterX <= objRect.right;
    const withinY = playerCenterY >= objRect.top && playerCenterY <= objRect.bottom;

    if (withinX && withinY) {
      if (lastPopupObject !== obj) {
        lastPopupObject = obj;
        showPopup(obj.dataset.message);
        playSound();
      }
      collided = true;
    }
  });

  if (!collided) {
    lastPopupObject = null;
  }
}

function playSound() {
  const sound = new Audio("sounds/retro-blip.mp3");
  sound.play();
}

function showPopup(message) {
  popupMessage.textContent = message;
  popup.classList.remove("hidden");
}

function closePopup() {
  popup.classList.add("hidden");
  lastPopupObject = null;
}
