let canvas, ctx, basket, blocks;
let score = 0;
let chances = 3;
let gameInterval;
let blockInterval;
let isGameOver = false;
let blockSpeed = 2;  // Initial block speed

// Constants for game
const canvasWidth = 800;
const canvasHeight = 600;
const basketWidth = 100;
const basketHeight = 20;
const blockSize = 20;
const basketSpeed = 10;

// Game setup
function startGame() {
    score = 0;
    chances = 3;
    isGameOver = false;
    blockSpeed = 2;  // Reset block speed at the start of a new game
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('scoreValue').innerText = score;
    document.getElementById('chancesLeft').innerText = chances;

    canvas = document.getElementById("gameCanvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");

    basket = {
        x: canvasWidth / 2 - basketWidth / 2,
        y: canvasHeight - basketHeight - 10,
        width: basketWidth,
        height: basketHeight,
        dx: 0
    };

    blocks = [];
    gameInterval = setInterval(updateGame, 1000 / 60);
    blockInterval = setInterval(createBlock, 1500);
    window.addEventListener("keydown", moveBasket);
    window.addEventListener("keyup", stopBasket);
}

// Create a new block
function createBlock() {
    if (isGameOver) return;

    // Random block type: more square blocks, fewer red/blue balls
    const blockType = Math.random() < 0.8 ? 'normal' : (Math.random() < 0.5 ? 'bigBlue' : 'bigRed');
    const blockColor = blockType === 'bigBlue' ? '#0000FF' : (blockType === 'bigRed' ? '#FF0000' : getRandomColor());
    const blockX = Math.random() * (canvasWidth - blockSize);
    blocks.push({ x: blockX, y: -blockSize, color: blockColor, type: blockType });
}

// Get random color for blocks
function getRandomColor() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#F3F33D'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Draw basket
function drawBasket() {
    ctx.fillStyle = "#FF6347"; // Basket color (tomato)
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

// Draw blocks
function drawBlocks() {
    blocks.forEach((block, index) => {
        ctx.fillStyle = block.color;
        if (block.type === 'bigBlue' || block.type === 'bigRed') {
            // Draw big blue or red balls (same size as regular block)
            ctx.beginPath();
            ctx.arc(block.x + blockSize / 2, block.y + blockSize / 2, blockSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        } else {
            ctx.fillRect(block.x, block.y, blockSize, blockSize);
        }

        block.y += blockSpeed;

        // Check if block hits the bottom of the screen
        if (block.y > canvasHeight) {
            blocks.splice(index, 1);
            handleMiss(block.type); // Pass the block type to handleMiss
        }

        checkCollision(block, index);
    });
}

// Check if the block hits the basket
function checkCollision(block, index) {
    if (block.y + blockSize > basket.y && block.x + blockSize > basket.x && block.x < basket.x + basket.width) {
        blocks.splice(index, 1); // Remove block

        if (block.type === 'normal') {
            score += 1; // Square block gives 1 point
        } else if (block.type === 'bigBlue') {
            score += 5; // Big Blue Ball gives 5 points
        } else if (block.type === 'bigRed') {
            score -= 5; // Big Red Ball gives -5 points
        }

        document.getElementById('scoreValue').innerText = score;

        // Check for speed increase based on score
        if (score >= 25 && score < 50) {
            blockSpeed = 3; // Increase speed after 25 points
        } else if (score >= 50 && score < 75) {
            blockSpeed = 4; // Increase speed after 50 points
        } else if (score >= 75) {
            blockSpeed = 5; // Increase speed after 75 points
        }
    }
}

// Handle missed block (do not decrease chances for bigBlue and bigRed)
function handleMiss(blockType) {
    // Only decrease chances for square blocks, fire, and blue fire
    if (blockType === 'normal' || blockType === 'bigBlue' || blockType === 'bigRed') {
        chances -= 1;
        document.getElementById('chancesLeft').innerText = chances;

        if (chances === 0) {
            gameOver();
        }
    }
}

// Update game elements
function updateGame() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBasket();
    drawBlocks();

    // Move basket
    basket.x += basket.dx;

    // Prevent basket from going out of bounds
    if (basket.x < 0) basket.x = 0;
    if (basket.x + basket.width > canvasWidth) basket.x = canvasWidth - basket.width;
}

// Move basket with arrow keys
function moveBasket(event) {
    if (event.key === "ArrowLeft") {
        basket.dx = -basketSpeed;
    } else if (event.key === "ArrowRight") {
        basket.dx = basketSpeed;
    }
}

// Stop basket when key is released
function stopBasket(event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        basket.dx = 0;
    }
}

// Game Over function
function gameOver() {
    clearInterval(gameInterval);
    clearInterval(blockInterval);
    isGameOver = true;

    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('finalScore').innerText = score;
}

// Start the game initially
startGame();
