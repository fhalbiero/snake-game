//difine html elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const score = document.getElementById('score');
const hightScoreEl = document.getElementById('hightScore');
//define game variables;
const GRID_SIZE = 26;

let snake = [{x: 10, y:10}];
let food = generateFood();
let direction = 'RIGHT';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let hightScore = 0;

//draw game map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
}

//draw snake
function drawSnake() {
    snake.forEach( segment => {
        const snakeEl = createGameElement('div', 'snake');
        setPosition(snakeEl, segment);
        board.appendChild(snakeEl);
    });
}

//create a snake or food div
function createGameElement(tag, className) {
    const el = document.createElement(tag);
    el.className = className;
    return el;
}

//set the position of snake or food
function setPosition(el, pos) {
    el.style.gridColumn = pos.x;
    el.style.gridRow = pos.y;
}

//draw food
function drawFood() {
    const foodEl = createGameElement('img', 'food');
    foodEl.style.width = '20px';
    foodEl.src = 'assets/food.png';
    setPosition(foodEl, food);
    board.appendChild(foodEl);
}

//generate food
function generateFood() {
    const x = Math.floor(Math.random() * GRID_SIZE) + 1;
    const y = Math.floor(Math.random() * GRID_SIZE) + 1;
    return { x, y };
}

//moving the snake
function move() {
    const head = {...snake[0]};
    switch (direction) {
        case 'RIGHT': 
            head.x++;
            break;
        case 'LEFT': 
            head.x--;
            break;
        case 'UP': 
            head.y--;
            break;
        case 'DOWN': 
            head.y++;
            break;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        console.log('eating food');
        food = generateFood();
        updateScore();
        increaseSpeed();
        clearInterval(gameInterval); //clear past interval
        gameInterval = setInterval(() => {
            move();
            checkColision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

function increaseSpeed() {
    gameSpeedDelay -= gameSpeedDelay > 150 ? 5 : 2;
}

function checkColision() {
    const head = snake[0];
    if (head.x < 1 || head.x > GRID_SIZE ||
        head.y < 1 || head.y > GRID_SIZE) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            console.log('colision with self at index', head, snake[i]);
            resetGame();
        }
    }
}

function resetGame() {
    direction = 'RIGHT';
    gameSpeedDelay = 200;
    gameStarted = false;
    updateScore();
    updateHightScore();
    snake = [];
    food = null;
    stopGame();
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function updateHightScore() {
    const currentScore = snake.length - 1;
    if (currentScore > hightScore) {
        hightScore = currentScore;
        hightScoreEl.textContent = hightScore.toString().padStart(3, '0');
    }
}

//start game function
function startGame() {
    snake = [{x: 10, y:10}];
    food = generateFood();
    gameStarted = true;
    instructionText.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkColision();
        draw();
    }, gameSpeedDelay);
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
}

//keypress event listener
function handleKeyPress(event) {
    if ((!gameStarted && event.code === 'Space') ||
        (!gameStarted && event.key === ' ')) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp': 
                direction = 'UP';
                break;
            case 'ArrowDown': 
                direction = 'DOWN';
                break;
            case 'ArrowRight': 
                direction = 'RIGHT';
                break;
            case 'ArrowLeft': 
                direction = 'LEFT';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);