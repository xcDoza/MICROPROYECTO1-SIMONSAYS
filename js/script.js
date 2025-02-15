// clase Persona para almacenar nombre y puntuacion
class Persona {
  constructor(nombre, score) {
    this.nombre = nombre;
    this.score = score;
  }
}

// el audio y el botón de silenciar
const backgroundSound = document.getElementById("background-sound");
const muteButton = document.getElementById("mute-button");
const muteIcon = document.getElementById("mute-icon");

// verifica si la musica está silenciada al cargar la pagina
let isMuted = localStorage.getItem("isMuted") === "true";

function initializeBackgroundSound() {
  backgroundSound.volume = 0.2;
  if (isMuted) {
    backgroundSound.pause();
    muteIcon.textContent = "🔇";
  } else {
    backgroundSound.play();
    muteIcon.textContent = "🔊";
  }
}

muteButton?.addEventListener("click", () => {
  isMuted = !isMuted;
  localStorage.setItem("isMuted", isMuted);

  if (isMuted) {
    backgroundSound.pause();
    muteIcon.textContent = "🔇";
  } else {
    backgroundSound.play();
    muteIcon.textContent = "🔊";
  }
});

window.addEventListener("load", initializeBackgroundSound);

const volumeSlider = document.getElementById("volume-slider");

volumeSlider?.addEventListener("input", () => {
  backgroundSound.volume = volumeSlider.value;
});

if (volumeSlider) {
  volumeSlider.value = backgroundSound.volume;
}

const hoverSound = document.getElementById("hover-sound");
function playHoverSound() {
  hoverSound.volume = 0.2;
  hoverSound.currentTime = 0;
  hoverSound.play();
}
document.querySelectorAll("button:not(.color)").forEach((button) => {
  button.addEventListener("mouseenter", () => {
      playHoverSound();
  });
});

document.querySelectorAll(".color").forEach((color) => {
  color.addEventListener("click", () => {
      playButtonSound();
  });
});

if (
  window.location.pathname.endsWith("index.html") ||
  window.location.pathname === "/"
) {
  const soundButton = document.getElementById("sound-button");

  function playButtonSound() {
    soundButton.currentTime = 0;
    soundButton.play();
  }

  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      playButtonSound();
    });
  });
  document
    .getElementById("startButton")
    ?.addEventListener("click", function () {
      const username = document.getElementById("username").value;
      if (username) {
        localStorage.setItem("username", username);
        window.location.href = "game.html";
      } else {
        alert("Por favor, ingresa tu nombre.");
      }
    });

  window.addEventListener("load", function () {
    let scores =
      JSON.parse(localStorage.getItem("scores")) || Array(10).fill(null);
    const tbody = document.querySelector("#scoreTable tbody");
    tbody.innerHTML = "";

    // ordenar puntuaciones de mayor a menor
    scores.sort((a, b) => {
      if (!a && !b) return 0;
      if (!a) return 1;
      if (!b) return -1;
      return b.score - a.score;
    });

    // crear siempre 10 filas
    for (let i = 0; i < 10; i++) {
      const row = document.createElement("tr");
      if (scores[i]) {
        row.innerHTML = `
                    <td>${scores[i].nombre}</td>
                    <td>${scores[i].score}</td>
                `;
      } else {
        row.innerHTML = `
                    <td>---</td>
                    <td>0</td>
                `;
      }
      tbody.appendChild(row);
    }
  });
}

if (window.location.pathname.endsWith("game.html")) {
  const soundRed = document.getElementById("sound-red");
  const soundBlue = document.getElementById("sound-blue");
  const soundGreen = document.getElementById("sound-green");
  const soundYellow = document.getElementById("sound-yellow");
  const soundButton = document.getElementById("sound-button");
  const colors = ["red", "blue", "green", "yellow"];
  let sequence = [];
  let playerSequence = [];
  let score = 0;
  let isGameActive = false;
  let isShowingSequence = false;

  const startButton = document.getElementById("start");
  const scoreDisplay = document.getElementById("score");
  const backButton = document.createElement("button");
  backButton.id = "backToMenu";
  backButton.textContent = "Volver al Menú";
  backButton.className = "neon-button";
  backButton.style.marginTop = "20px";
  backButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
  document.querySelector(".container")?.appendChild(backButton);

  startButton?.addEventListener("click", startGame);
  document.querySelectorAll(".color").forEach((button) => {
    button.addEventListener("click", handleColorClick);
  });

  function startGame() {
    sequence = [];
    score = 0;
    updateScore();
    startButton.disabled = true;
    isGameActive = true;
    nextRound();
  }

  function nextRound() {
    playerSequence = [];
    sequence.push(generateNextStep());
    showSequence();
  }

  function generateNextStep() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function showSequence() {
    isShowingSequence = true;
    let i = 0;
    const interval = setInterval(() => {
      highlightColor(sequence[i]);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          isShowingSequence = false;
        }, 500);
      }
    }, 1000);
  }

  function highlightColor(color) {
    const button = document.getElementById(color);
    button.classList.add("active");
    if (isShowingSequence) {
      playColorSound(color);
    }
    setTimeout(() => {
      button.classList.remove("active");
    }, 500);
  }

  function handleColorClick(e) {
    if (!isGameActive || isShowingSequence) return;

    const color = e.target.id;
    highlightColor(color);
    playerSequence.push(color);

    if (!checkPlayerInput()) {
      gameOver();
      return;
    }

    if (playerSequence.length === sequence.length) {
      score++;
      updateScore();
      setTimeout(nextRound, 1000);
    }
  }

  function checkPlayerInput() {
    const index = playerSequence.length - 1;
    return playerSequence[index] === sequence[index];
  }

  function updateScore() {
    scoreDisplay.textContent = score;
  }

  function playColorSound(color) {
    switch (color) {
      case "red":
        soundRed.currentTime = 0; // Reiniciar el sonido si ya está reproduciéndose
        soundRed.play();
        break;
      case "blue":
        soundBlue.currentTime = 0;
        soundBlue.play();
        break;
      case "green":
        soundGreen.currentTime = 0;
        soundGreen.play();
        break;
      case "yellow":
        soundYellow.currentTime = 0;
        soundYellow.play();
        break;
    }
  }

  function playButtonSound() {
    soundButton.currentTime = 0;
    soundButton.play();
  }

  [startButton, backButton].forEach((button) => {
    button.addEventListener("click", playButtonSound);
  });

  function gameOver() {
    const username = localStorage.getItem("username") || "Anónimo";
    const newScore = new Persona(username, score);
    let scores =
      JSON.parse(localStorage.getItem("scores")) || Array(10).fill(null);
    scores.push(newScore);
    scores = scores
      .filter((s) => s !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    while (scores.length < 10) {
      scores.push(null);
    }
    localStorage.setItem("scores", JSON.stringify(scores));
    alert(`¡Juego Terminado! Puntuación: ${score}`);
    isGameActive = false;
    startButton.disabled = false;
    sequence = [];
  }
}
