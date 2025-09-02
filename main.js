'use strict';
var snake = [
    { x: 40, y: 40 }
];
var dx = 0;
var dy = 0;
var gridSize = 20;
var food = {
    x: 0,
    y: 0
};
var score = 0;
var highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
var displayText = document.getElementById('display');
var nextDirection = { dx: 0, dy: 0 };
var LEFT = -1;
var RIGHT = 1;
var UP = -1;
var DOWN = 1;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 660;
canvas.height = 540;
addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            nextDirection = { dx: 0, dy: UP * gridSize };
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            nextDirection = { dx: 0, dy: DOWN * gridSize };
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            nextDirection = { dx: LEFT * gridSize, dy: 0 };
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            nextDirection = { dx: RIGHT * gridSize, dy: 0 };
            break;
        default:
            break;
    }
});
function getRandomFoodPosition(food) {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}
function gameLoop() {
    updateDisplay();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)'; // 薄いグレー
    ctx.lineWidth = 1;
    for (var i = 0; i <= canvas.width / gridSize; i++) {
        // 縦線
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
    }
    for (var i = 0; i <= canvas.height / gridSize; i++) {
        // 横線
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
    dx = nextDirection.dx;
    dy = nextDirection.dy;
    var head = { x: snake[0].x + dx, y: snake[0].y + dy };
    ctx.fillStyle = 'green';
    snake.forEach(function (item) {
        return ctx.fillRect(item.x, item.y, gridSize, gridSize);
    });
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
    snake.unshift(head);
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 100;
        getRandomFoodPosition(food);
    }
    else {
        snake.pop();
    }
    if ((snake[0].x < 0) || (snake[0].x >= canvas.width) ||
        (snake[0].y < 0) || (snake[0].y >= canvas.height)) {
        displayGameOver(gameInterval, "Out of range");
        return;
    }
    for (var i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            displayGameOver(gameInterval, "You ate yourself");
            return;
        }
    }
}
getRandomFoodPosition(food);
function updateDisplay() {
    if (displayText) {
        displayText.innerText = "Score :".concat(score, " | High Score: ").concat(highScore);
    }
}
function displayGameOver(gameInterval, reason) {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore.toString());
    }
    clearInterval(gameInterval);
    if (displayText) {
        displayText.innerText = "GAME OVER! ".concat(reason, " | Final Score: ").concat(score, " | High Score: ").concat(highScore);
    }
}
var gameInterval = setInterval(function () {
    gameLoop();
}, 150);
