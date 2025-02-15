// --------------------------
// 1. Clase Persona
// --------------------------
class Persona {
  constructor(nombre, score) {
    this.nombre = nombre;
    this.score = score;
  }
}

// --------------------------
// 2. Control de audio general
// --------------------------
const backgroundSound = document.getElementById("background-sound");
const muteButton = document.getElementById("mute-button");
const muteIcon = document.getElementById("mute-icon");

// Verifica si la música está silenciada al cargar la página
let isMuted = localStorage.getItem("isMuted") === "true";

function initializeBackgroundSound() {
  if (!backgroundSound) return; // Por si en esta página no existe el audio

  backgroundSound.volume = 0.2;
  if (isMuted) {
    backgroundSound.pause();
    if (muteIcon) muteIcon.textContent = "🔇";
  } else {
    backgroundSound.play();
    if (muteIcon) muteIcon.textContent = "🔊";
  }
}

// Botón de mute / unmute
muteButton?.addEventListener("click", () => {
  isMuted = !isMuted;
  localStorage.setItem("isMuted", isMuted);

  if (!backgroundSound) return;

  if (isMuted) {
    backgroundSound.pause();
    if (muteIcon) muteIcon.textContent = "🔇";
  } else {
    backgroundSound.play();
    if (muteIcon) muteIcon.textContent = "🔊";
  }
});

// Inicializamos el sonido de fondo al cargar
window.addEventListener("load", initializeBackgroundSound);

// --------------------------
// 3. Control del volumen
// --------------------------
const volumeSlider = document.getElementById("volume-slider");
if (volumeSlider && backgroundSound) {
  volumeSlider.value = backgroundSound.volume; // Valor inicial
  volumeSlider.addEventListener("input", () => {
    backgroundSound.volume = volumeSlider.value;
  });
}

// --------------------------
// 4. Efecto de sonido al pasar el mouse
// --------------------------
const hoverSound = document.getElementById("hover-sound");

function playHoverSound() {
  if (!hoverSound) return;
  hoverSound.volume = 0.2;
  hoverSound.currentTime = 0;
  hoverSound.play();
}

// Para todos los botones que NO tengan clase "color"
document.querySelectorAll("button:not(.color)").forEach((button) => {
  button.addEventListener("mouseenter", () => {
    playHoverSound();
  });
});

// --------------------------
// 5. Efecto de sonido al hacer clic
// --------------------------
function playButtonSound() {
  const soundButton = document.getElementById("sound-button");
  if (!soundButton) return;
  soundButton.currentTime = 0;
  soundButton.play();
}

// Para los botones con clase "color" (en el juego)
document.querySelectorAll(".color").forEach((colorBtn) => {
  colorBtn.addEventListener("click", () => {
    playButtonSound();
  });
});

// --------------------------
// 6. Lógica ESPECÍFICA DE LA PÁGINA "index.html"
//    (Sólo se ejecuta si existe el elemento #startButton)
// --------------------------
const startButtonIndex = document.getElementById("startButton");
if (startButtonIndex) {
  // Reproduce sonido en cada botón de la página index
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", playButtonSound);
  });

  // Evento para el botón de iniciar juego
  startButtonIndex.addEventListener("click", function () {
    const username = document.getElementById("username").value;
    if (username) {
      localStorage.setItem("username", username);
      // Ir a la pantalla de juego
      // (si "index.html" y "game.html" están en la misma carpeta)
      window.location.href = "./game.html";
    } else {
      alert("Por favor, ingresa tu nombre.");
    }
  });

  // Mostrar tabla de puntuaciones cuando cargue la página index
  window.addEventListener("load", function () {
    let scores = JSON.parse(localStorage.getItem("scores")) || Array(10).fill(null);
    const tbody = document.querySelector("#scoreTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    // Ordenar puntuaciones de mayor a menor
    scores.sort((a, b) => {
      if (!a && !b) return 0;
      if (!a) return 1;
      if (!b) return -1;
      return b.score - a.score;
    });

    // Crear siempre 10 filas
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

// --------------------------
// 7. Lógica ESPECÍFICA DE LA PÁGINA "game.html"
//    (Sólo se ejecuta si existe el elemento #start en el HTML)
// --------------------------
const startButtonGame = document.getElementById("start");
if (startButtonGame) {
  // Sonidos de colores
  const soundRed = document.getElementById("sound-red");
  const soundBlue = document.getElementById("sound-blue");
  const soundGreen = document.getElementById("sound-green");
  const soundYellow = document.getElementById("sound-yellow");

  // Colores disponibles en el juego
  const colors = ["red", "blue", "green", "yellow"];

  let sequence = [];
  let playerSequence = [];
  let score = 0;
  let isGameActive = false;
  let isShowingSequence = false;

  const scoreDisplay = document.getElementById("score");
  const backToMenuButton = document.getElementById("backToMenu");

  // Botón para volver al menú
  backToMenuButton?.addEventListener("click", () => {
    playButtonSound();
    // Volver al index (misma carpeta)
    window.location.href = "./index.html";
  });

  // Iniciar juego
  startButtonGame.addEventListener("click", startGame);

  // Manejar clicks en los 4 botones de colores
  document.querySelectorAll(".color").forEach((button) => {
    button.addEventListener("click", handleColorClick);
  });

  // Reproducir el sonido al hacer clic en "Start Game" o "Volver al Menú"
  [startButtonGame, backToMenuButton].forEach((btn) => {
    btn?.addEventListener("click", playButtonSound);
  });

  // Función para iniciar el juego
  function startGame() {
    sequence = [];
    score = 0;
    updateScore();
    startButtonGame.disabled = true;
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

  // Reproduce la secuencia
  function showSequence() {
    isShowingSequence = true;
    let i = 0;
    const interval = setInterval(() => {
      highlightColor(sequence[i]);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        // Esperamos un poco antes de permitir clicks
        setTimeout(() => {
          isShowingSequence = false;
        }, 500);
      }
    }, 1000);
  }

  function highlightColor(color) {
    const button = document.getElementById(color);
    if (!button) return;
    button.classList.add("active");
    // Sólo reproducimos el sonido durante la "demostración" de la secuencia
    if (isShowingSequence) {
      playColorSound(color);
    }
    setTimeout(() => {
      button.classList.remove("active");
    }, 500);
  }

  function handleColorClick(e) {
    // Si no está activo el juego o se está mostrando la secuencia, ignoramos clicks
    if (!isGameActive || isShowingSequence) return;

    const color = e.target.id;
    highlightColor(color);
    playerSequence.push(color);

    // Verificamos si el último color pulsado coincide con la secuencia
    if (!checkPlayerInput()) {
      gameOver();
      return;
    }

    // Si ya completó toda la secuencia, subimos puntaje y pasamos a la siguiente ronda
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
    if (scoreDisplay) {
      scoreDisplay.textContent = score;
    }
  }

  function playColorSound(color) {
    let soundToPlay;
    switch (color) {
      case "red":
        soundToPlay = soundRed;
        break;
      case "blue":
        soundToPlay = soundBlue;
        break;
      case "green":
        soundToPlay = soundGreen;
        break;
      case "yellow":
        soundToPlay = soundYellow;
        break;
    }
    if (soundToPlay) {
      soundToPlay.currentTime = 0; // Reiniciamos por si se está reproduciendo
      soundToPlay.play();
    }
  }

  function gameOver() {
    const username = localStorage.getItem("username") || "Anónimo";
    const newScore = new Persona(username, score);
    let scores = JSON.parse(localStorage.getItem("scores")) || Array(10).fill(null);

    // Agregar nueva puntuación y ordenar
    scores.push(newScore);
    scores = scores
      .filter((s) => s !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // Rellenar con null si quedan huecos
    while (scores.length < 10) {
      scores.push(null);
    }

    localStorage.setItem("scores", JSON.stringify(scores));
    alert(`¡Juego Terminado! Puntuación: ${score}`);
    isGameActive = false;
    startButtonGame.disabled = false;
    sequence = [];
  }
}