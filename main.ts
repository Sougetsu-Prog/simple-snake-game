'use strict';

interface Position {
    x: number;
    y: number;
}

let snake: Position[] = [
    {x: 40, y: 40}
];

let dx: number = 0;
let dy: number = 0;

let gridSize: number = 20;

let food: Position = {
    x: 0,
    y: 0
};

let score: number = 0;
let highScore: number = parseInt(localStorage.getItem('snakeHighScore') || '0');

let displayText: HTMLElement | null = document.getElementById('display');

interface Direction {
    dx: number;
    dy: number;
}

let nextDirection: Direction = {dx: 0, dy: 0};

const LEFT: number = -1;
const RIGHT: number = 1;
const UP: number = -1;
const DOWN: number = 1;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

canvas.width = 660;
canvas.height = 540;

addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            nextDirection = {dx: 0, dy: UP * gridSize}
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            nextDirection = {dx: 0, dy: DOWN * gridSize};
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            nextDirection = {dx: LEFT * gridSize, dy: 0};
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            nextDirection = {dx: RIGHT * gridSize, dy: 0};
            break;
        default:
            break;
    }
});

function getRandomFoodPosition(food: Position): void {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}

function gameLoop(): void {
    updateDisplay();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';  // 薄いグレー
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width / gridSize; i++) {
        // 縦線
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= canvas.height / gridSize; i++) {
        // 横線
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    dx = nextDirection.dx;
    dy = nextDirection.dy;
    let head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    ctx.fillStyle = 'green';
    snake.forEach((item) =>
        ctx.fillRect(item.x, item.y, gridSize, gridSize)
    );

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    snake.unshift(head);

    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 100;
        getRandomFoodPosition(food);
    } else {
        snake.pop();
    }
    
    if ( (snake[0].x < 0) || (snake[0].x >= canvas.width) ||
         (snake[0].y < 0) || (snake[0].y >= canvas.height) ) {
        displayGameOver(gameInterval, "Out of range");
        return;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            displayGameOver(gameInterval, "You ate yourself");
            return;
        }
    }
}

getRandomFoodPosition(food);

function updateDisplay(): void {
    if (displayText) {
        displayText.innerText = `Score :${score} | High Score: ${highScore}`;
    }
}

function displayGameOver(gameInterval: number, reason: string) {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore.toString());
    }
    clearInterval(gameInterval);
    if (displayText) {
        displayText.innerText = `GAME OVER! ${reason} | Final Score: ${score} | High Score: ${highScore}`;
    }
}

let gameInterval: number = Number(setInterval(() => {
    gameLoop();
}, 150));
