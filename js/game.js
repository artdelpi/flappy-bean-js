/* CONSTANTS */
const GAME = {
    WIDTH: 290,           // game board width
    HEIGHT: 616,          // game board height
    GRAVITY: 0.30,        // px/frame 
    PIPE_SPEED: -3,       // px/frame
    PIPE_WIDTH: 49,
    PIPE_HEIGHT: 325,
    PIPE_GAP: 100,
    PIPE_SPAWN_MS: 1000,   
    FLOOR_H: 111,
    FLOOR_W: 339,          
    BEAN: { W: 35, H: 35, X: 35 },
    BEAN_UPDATE_MS: 300,
    SCORE_H: 19,
    SCORE_W: 15
}

const SPRITES = {
    bean1: "./assets/img/fbs-01.png",
    bean2: "./assets/img/fbs-02.png",
    bean3: "./assets/img/fbs-03.png",
    upperPipe: "./assets/img/fbs-07.png",
    lowerPipe: "./assets/img/fbs-06.png",
    floor: "./assets/img/fbs-04.png",
    gameOver: "./assets/img/fbs-32.png",
    zero: "./assets/img/fbs-35.png",
    one: "./assets/img/fbs-36.png",
    two: "./assets/img/fbs-37.png",
    three: "./assets/img/fbs-38.png",
    four: "./assets/img/fbs-39.png",
    five: "./assets/img/fbs-40.png",
    six: "./assets/img/fbs-41.png",
    seven: "./assets/img/fbs-42.png",
    eight: "./assets/img/fbs-43.png",
    nine: "./assets/img/fbs-44.png"
}

const UPPER_PIPE_IMG = new Image();
const LOWER_PIPE_IMG = new Image();
const FLOOR_IMG = new Image();
const GAME_OVER_IMG = new Image();

UPPER_PIPE_IMG.src = SPRITES.upperPipe;
LOWER_PIPE_IMG.src = SPRITES.lowerPipe;
FLOOR_IMG.src = SPRITES.floor;
GAME_OVER_IMG.src = SPRITES.gameOver;

/* STATE */
let gameBoard;
let context;
let beanImg;

let floor = {
    x: 0,
    y: GAME.HEIGHT - 111,
    height: 111,
    width: 339
}

let bean = {
    x: 35, // immutable
    y: GAME.HEIGHT / 2, // middle of the y-axis
    width: 35,
    height: 35,
    img_state: 1 // bean .png image (1, 2 or 3)
}
let pipeArr = [];
let beanSpeed = 0;
let gameOver = false;
let score = 0;

/* POST-LOAD ACTIONS */
window.onload = function() {
    gameBoard = document.getElementById("gameBoard");
    gameBoard.width = GAME.WIDTH;
    gameBoard.height = GAME.HEIGHT;
    context = gameBoard.getContext("2d");

    document.addEventListener("keydown", moveBean);

    requestAnimationFrame(update);
    setInterval(spawnPipe, GAME.PIPE_SPAWN_MS); // +2 pipes every second

    beanImg = new Image();
    setInterval(animateBean, GAME.BEAN_UPDATE_MS); // animates bean image
}


/* MAIN GAME LOOP */
function update() {
    requestAnimationFrame(update);
    if (!gameOver) {
        // Clear canvas
        context.clearRect(0, 0, 
                          GAME.WIDTH, GAME.HEIGHT);
        drawPipe();
        drawFloor();
        drawBean();
        drawScore();
    } else {
        context.drawImage(GAME_OVER_IMG,
                          (GAME.WIDTH - 220)/2,
                          (GAME.HEIGHT/2 + GAME.FLOOR_H)/2,
                          220,
                          44
        )
    }
}


/* UTILS */
function aabb(a, b) {
    return (a.y < b.y + b.height &&
        a.y + a.height > b.y &&
        a.x < b.x + b.width &&
        a.x + a.width > b.x
    );
}


function moveBean(e) {
    if (e.code == "Space" || e.code == "ArrowUp") {
        if (gameOver) {
            restartGame();
        } else {
            beanSpeed = -5; // resets speed to go 5px higher
        }
    }
}


function spawnPipe() {
    let randomPipeY = -GAME.PIPE_HEIGHT + GAME.PIPE_HEIGHT/3 + Math.random()*GAME.PIPE_HEIGHT/2;

    let upperPipe = {
        img: UPPER_PIPE_IMG,
        x: GAME.WIDTH, // @ the far-right of the canvas
        y: randomPipeY,
        height: GAME.PIPE_HEIGHT,
        width: GAME.PIPE_WIDTH,
        passed: false
    }

    let lowerPipe = {
        img: LOWER_PIPE_IMG,
        x: GAME.WIDTH,
        y: GAME.PIPE_HEIGHT + randomPipeY + GAME.PIPE_GAP,
        height: GAME.PIPE_HEIGHT,
        width: GAME.PIPE_WIDTH,
        passed: false
    }

    pipeArr.push(upperPipe);
    pipeArr.push(lowerPipe);
}


function animateBean() {
    if (!gameOver) {
        switch (bean.img_state) {
            case 1:
                beanImg.src = SPRITES.bean2; // state 1 to 2
                bean.img_state = 2;
                break;
            case 2:
                beanImg.src = SPRITES.bean3; // state 2 to 3
                bean.img_state = 3;
                break;
            case 3:
                beanImg.src = SPRITES.bean1; // state 3 to 1
                bean.img_state = 1;
                break;
        }
    
        beanImg.onload = function() {
            context.drawImage(beanImg, 
                              bean.x, 
                              bean.y, 
                              bean.width, 
                              bean.height);
        }
    }
}


function restartGame() {
    gameOver = false;
    score = 0;
    pipeArr = [];
    bean.y = GAME.HEIGHT/2;
    beanSpeed = 0;
}


function drawPipe() {
    for (let i=0; i < pipeArr.length; i++) {
        let auxPipe = pipeArr[i];
        context.drawImage(auxPipe.img, 
                          auxPipe.x, 
                          auxPipe.y, 
                          auxPipe.width, 
                          auxPipe.height);
        auxPipe.x += GAME.PIPE_SPEED;
        // End game if there's a collision or the bean falls below the board
        if (aabb(bean, auxPipe) || bean.y > GAME.HEIGHT - floor.height) {
            gameOver = true;
        }

        if (auxPipe.x + auxPipe.width < bean.x &&
            auxPipe.passed == false
        ) {
            score += 0.5; // +0.5 per pipe; 2 at once = 1 point
            auxPipe.passed = true;
        }
    } 
}


function drawBean() {
    beanSpeed += GAME.GRAVITY;
    bean.y += beanSpeed;
    if (bean.y < 0) {
        bean.y = 0;
    }
    context.drawImage(beanImg,
                      bean.x,
                      bean.y,
                      bean.width,
                      bean.height
    );
}


function drawScore() {
    let scoreStr = score.toString();
    let scoreX = 10;
    let scoreY = 10;
    for (let i=0; i < scoreStr.length; i++) {
        let scoreLetterImg = new Image();
        switch (scoreStr[i]) {
            case "0":
                scoreLetterImg.src = SPRITES.zero;
                break;
            case "1":
                scoreLetterImg.src = SPRITES.one;
                break;
            case "2":
                scoreLetterImg.src = SPRITES.two;
                break;
            case "3":
                scoreLetterImg.src = SPRITES.three;
                break;
            case "4":
                scoreLetterImg.src = SPRITES.four;
                break;
            case "5":
                scoreLetterImg.src = SPRITES.five;
                break;
            case "6":
                scoreLetterImg.src = SPRITES.six;
                break;
            case "7":
                scoreLetterImg.src = SPRITES.seven;
                break;
            case "8":
                scoreLetterImg.src = SPRITES.eight;
                break;
            case "9":
                scoreLetterImg.src = SPRITES.nine;
                break;
        }
        context.drawImage(scoreLetterImg,
                                  scoreX,
                                  scoreY,
                                  GAME.SCORE_W,
                                  GAME.SCORE_H
                                );
        scoreX += GAME.SCORE_W;
    }
}


function drawFloor() {
    if (floor.x < -floor.width) {
        floor.x = 0; // reset floor drawing
    }
    floor.x += GAME.PIPE_SPEED
    context.drawImage(FLOOR_IMG,
                      floor.x,
                      floor.y,
                      floor.width,
                      floor.height
    )

    context.drawImage(FLOOR_IMG,
                      floor.x + floor.width -2, // slight adjustment
                      floor.y,
                      floor.width,
                      floor.height
    )
}