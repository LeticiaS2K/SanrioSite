const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 45;  
const canvasWidth = 900;
const canvasHeight = 500;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let snake = [{ x: 5 * box, y: 5 * box }];
let direction = '';
let game;
let score = 0;
let food = {};
let segmentSprites = [];

const characterImages = [
  "images/fg1.jpeg",
  "images/fg2.jpeg",
  "images/fg3.jpeg",
  "images/fg4.jpeg",
  "images/fg5.jpeg",
  "images/fg6.jpeg"
].map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

let availableImages = [...characterImages];

const foodImg = new Image();
foodImg.src = "images/fg7.jpeg";

// Imagem de fundo do jogo
const backgroundImg = new Image();
backgroundImg.src = "images/fundo1.jpeg";

// Desenha só o fundo na tela inicial, sem o jogo rodando
backgroundImg.onload = () => {
  ctx.drawImage(backgroundImg, 0, 0, canvasWidth, canvasHeight);
}

function createFood() {
  food = {
    x: Math.floor(Math.random() * (canvasWidth / box)) * box,
    y: Math.floor(Math.random() * (canvasHeight / box)) * box
  };
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(backgroundImg, 0, 0, canvasWidth, canvasHeight);

  for (let i = 0; i < snake.length; i++) {
    const sprite = segmentSprites[i] || characterImages[0];
    ctx.drawImage(sprite, snake[i].x, snake[i].y, box, box);
  }

  ctx.drawImage(foodImg, food.x, food.y, box, box);

  let head = { x: snake[0].x, y: snake[0].y };
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  if (head.x === food.x && head.y === food.y) {
    score++;
    createFood();

    if (availableImages.length === 0) {
      availableImages = [...characterImages];
    }

    const index = Math.floor(Math.random() * availableImages.length);
    const newImg = availableImages.splice(index, 1)[0];

    snake.unshift(head);
    segmentSprites.unshift(newImg);

  } else {
    snake.pop();
    segmentSprites.pop();

    snake.unshift(head);
    segmentSprites.unshift(segmentSprites[1] || segmentSprites[0]);
  }

  if (
    head.x < 0 || head.x >= canvasWidth ||
    head.y < 0 || head.y >= canvasHeight ||
    collision(head, snake)
  ) {
    gameOver();
    return;
  }
}

function collision(head, body) {
  return body.slice(1).some(part => part.x === head.x && part.y === head.y);
}

document.addEventListener("keydown", event => {
  const key = event.key.toLowerCase();
  if (key === "w" && direction !== "DOWN") direction = "UP";
  if (key === "s" && direction !== "UP") direction = "DOWN";
  if (key === "a" && direction !== "RIGHT") direction = "LEFT";
  if (key === "d" && direction !== "LEFT") direction = "RIGHT";
});

function gameOver() {
  clearInterval(game);
  document.getElementById("playBtn").style.display = "block";
  alert("Game Over 💀");
}

document.getElementById("playBtn").addEventListener("click", () => {
  snake = [{ x: 5 * box, y: 5 * box }];
  direction = '';
  score = 0;
  createFood();

  availableImages = [...characterImages];
  const initialImg = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
  segmentSprites = [initialImg];

  clearInterval(game);
  game = setInterval(draw, 150);
  document.getElementById("playBtn").style.display = "none";
});






