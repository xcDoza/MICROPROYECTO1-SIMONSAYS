const colors = ['red', 'blue', 'green', 'yellow'];
let sequence = [];
let playerSequence = [];
let score = 0;
let isGameActive = false;
let isShowingSequence = false;

const startButton = document.getElementById('start');
const scoreDisplay = document.getElementById('score');

startButton.addEventListener('click', startGame);
document.querySelectorAll('.color').forEach(button => {
    button.addEventListener('click', handleColorClick);
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
    button.classList.add('active');
    setTimeout(() => {
        button.classList.remove('active');
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
    scoreDisplay.textContent = `${score}`;
}

function gameOver() {
    alert(`Game Over! Score: ${score}`);
    isGameActive = false;
    startButton.disabled = false;
    sequence = [];
}