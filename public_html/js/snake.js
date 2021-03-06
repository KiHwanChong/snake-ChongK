/* ---------------------------------------------------------------------------
 * Variables
 * ---------------------------------------------------------------------------
 */

//Preloading audio stuff
var mainMusic = document.getElementById("main_music"),
        foodMusic = document.getElementById("food"),
        goMusic = document.getElementById("gameOverM");

var files = [mainMusic, foodMusic, goMusic];
var counter = 0;

var snake;
var snakeLength;
var snakeSize;
var snakeDirection;

var food;

var context;
var screenWidth;
var screenHeight;

var gameState;
var gameOverMenu;
var restartButton;
var playHUD;
var startScreen;
var difficulty;

/* ---------------------------------------------------------------------------
 * Executing Game Code
 * ---------------------------------------------------------------------------
 */
gameInitialize();
snakeInitialize();
foodInitialize();
foodDraw();
setInterval(gameLoop, 1000/30);

/* ---------------------------------------------------------------------------
 * Game Functions
 * ---------------------------------------------------------------------------
 */

function gameInitialize() {
    
    mainMusic.play();
    
    var canvas = document.getElementById("game-screen");
    context = canvas.getContext("2d");
    
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    
    document.addEventListener("keydown", keyboardHandler);
    
    startScreen = document.getElementById("startScreen");
    centerMenuPosition(startScreen);        
    
    //Set difficullty
    difficulty = document.getElementById("easy");
    difficulty.addEventListener("click", gameStart);
    
    difficulty = document.getElementById("hard");
    difficulty.addEventListener("click", gameStart2);
    
    
    gameOverMenu = document.getElementById("gameOver");
    centerMenuPosition(gameOverMenu);
    
    restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", gameRestart);
    
    playHUD = document.getElementById("playHUD");
    scoreboard = document.getElementById("scoreboard");
    
    setState("START");
    
    //image of snake and food
    imageSnake = new Image();
    imageSnake.src = "images/segment.png" 
    
    imageFood = new Image();
    imageFood.src = "http://img2.wikia.nocookie.net/__cb20140530025912/asphalt/images/c/cc/Apple_logo_black.svg.png"   
    }

function gameLoop() {
    gameDraw();
    drawScoreboard();
    if (gameState == "PLAY"){
        snakeUpdate();
        snakeDraw();
        foodDraw();
    }
}

function gameDraw() {
    context.fillStyle = "blue";
    context.fillRect(0, 0, screenWidth, screenHeight);
    
}

function gameRestart() {
    snakeInitialize();
    foodInitialize();
    hideMenu(gameOverMenu);
    setState("PLAY");
    
}

//difficulty function
function gameStart() {
    snakeInitialize();
    foodInitialize();
    hideMenu(startScreen);
    setState("PLAY");

}

function gameStart2() {
    snakeInitialize();
    foodInitialize();
    hideMenu(startScreen);
    setState("PLAY");
    setInterval(gameLoop, 1000/30);
}


/* --------------------------------------------------------------------------
 * Snake Functions
 * --------------------------------------------------------------------------
 */

function snakeInitialize() {
    snake = [];
    snakeLength = 1;
    snakeSize = 30;
    snakeDirection = "down";
    
    for(var index = snakeLength - 1; index >= 0; index--) {
        snake.push( {
            x: index,
            y: 0
        });
    }
}

function snakeDraw() {
    for(var index = 0; index < snake.length; index++) {
        context.drawImage(imageSnake, snake[index].x * snakeSize, snake[index].y * snakeSize, snakeSize, snakeSize);
    }
    
}

function snakeUpdate() {
    var snakeHeadX = snake[0].x;
    var snakeHeadY = snake[0].y;
    
    if(snakeDirection == "down") {
        snakeHeadY++;
    }
    else if(snakeDirection == "right"){
        snakeHeadX++;
    }
    else if(snakeDirection == "up"){
        snakeHeadY--;
    }
    else if(snakeDirection == "left"){
        snakeHeadX--;
    }
    
    checkFoodCollisions(snakeHeadX, snakeHeadY);
    checkWallCollisions(snakeHeadX, snakeHeadY);
    checkSnakeCollisions(snakeHeadX, snakeHeadY);
    
    var snakeTail = snake.pop();
    snakeTail.x = snakeHeadX;
    snakeTail.y = snakeHeadY;
    snake.unshift(snakeTail);
    
}

/* --------------------------------------------------------------------------
 * Food Functions
 * --------------------------------------------------------------------------
 */

function foodInitialize() {
    food = {
        x: 0, 
        y: 0
    };
    setFoodPosition();
}

function foodDraw() {
      context.drawImage(imageFood, food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);

}

function setFoodPosition() {
    var randomX = Math.floor(Math.random() * screenWidth);
    var randomY = Math.floor(Math.random() * screenHeight);
    
    food.x = Math.floor(randomX / snakeSize);
    food.y = Math.floor(randomY / snakeSize);
}

/* ----------------------------------------------------------------------------
 * Input Functions
 * ----------------------------------------------------------------------------
 */
function keyboardHandler (event) {
    if(event.keyCode == "39" && snakeDirection != "left") {
        snakeDirection = "right"
    }
    else if(event.keyCode == "40" && snakeDirection != "up") {
        snakeDirection = "down"
    }
    else if(event.keyCode == "38" && snakeDirection != "down") {
        snakeDirection = "up"   
    }
    else if(event.keyCode == "37" && snakeDirection != "right") {
        snakeDirection = "left"   
    }
}

/* ----------------------------------------------------------------------------
 * Collision Handling
 * ----------------------------------------------------------------------------
 */

function checkFoodCollisions(snakeHeadX, snakeHeadY) {
    if(snakeHeadX == food.x && snakeHeadY == food.y) {
        snake.push({
            x: 0,
            y: 0
        });
        snakeLength++;
        setFoodPosition();
        foodMusic.pause();
        foodMusic.currentTime = 0;
        foodMusic.play();
			
    }
}

function checkWallCollisions(snakeHeadX, snakeHeadY) {
    if(snakeHeadX * snakeSize >= screenWidth || snakeHeadX * snakeSize < 0 ||
       snakeHeadY * snakeSize >= screenHeight || snakeHeadY * snakeSize < 0) {
        setState("GAME OVER");     
    }
    }

function checkSnakeCollisions(snakeHeadX, snakeHeadY) {
    for(var index = 1; index < snake.length; index++) {
        if(snakeHeadX == snake[index].x && snakeHeadY == snake[index].y) {
            setState("GAME OVER");
            return;
        }
    }
}

/* ----------------------------------------------------------------------------
 * Game State Handling
 * ----------------------------------------------------------------------------
 */

function setState(state) {
    gameState = state;
    showMenu(state);
}

/* ----------------------------------------------------------------------------
 * Menu Functions
 * ----------------------------------------------------------------------------
 */

function displayMenu(menu) {
    menu.style.visibility = "visible";
}

function hideMenu(menu) {
    menu.style.visibility = "hidden";
}

function showMenu(state) {
    if(state == "GAME OVER") {
        displayMenu(gameOverMenu);
        goMusic.pause();
        goMusic.currentime = 0;
        goMusic.play();
        
    }
    else if(state == "PLAY") {
        displayMenu(playHUD);
    }
}

function centerMenuPosition(menu) {
    menu.style.top = (screenHeight / 2) - (menu.offsetHeight / 2) + "px";
    menu.style.left = (screenWidth / 2) - (menu.offsetWidth / 2)+ "px";
}

function drawScoreboard(){
    scoreboard.innerHTML = "Length: " + snakeLength;
}
