/* =========== CONSTANTS =========== */
const GAME = {
    WIDTH: 290,           // game board width
    HEIGHT: 554,          // game board height
    GRAVITY: 0.30,        // px/frame 
    PIPE_SPEED: -3,       // px/frame
    PIPE_WIDTH: 49,
    PIPE_HEIGHT: 325,
    PIPE_GAP: 100,
    PIPE_SPAWN_MS: 1000,   
    FLOOR_H: 69,
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
    menuBoard: "./assets/img/fbs-12.png",
    newLabel: "./assets/img/fbs-21.png",
    shareButton: "./assets/img/fbs-16.png",
    menuButton: "./assets/img/fbs-17.png",
    okButton: "./assets/img/fbs-18.png",
    pauseButton: "./assets/img/fbs-19.png",
    silverMedal: "./assets/img/fbs-23.png",
    goldMedal: "./assets/img/fbs-24.png",
    gameTitle: "./assets/img/fbs-34.png",
    startButton: "./assets/img/fbs-13.png",
    getReadyLabel: "./assets/img/fbs-31.png",
    leaderboard: "./assets/img/fbs-14.png",
    tapRight: "./assets/img/fbs-29.png",
    tapLeft: "./assets/img/fbs-30.png",
    arrowUp: "./assets/img/fbs-27.png",
    hand: "./assets/img/fbs-28.png",
    playButton: "./assets/img/fbs-13.png",
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

/* ========== ASSETS: IMAGES ========== */
// Pipes
const UPPER_PIPE_IMG   = new Image();
const LOWER_PIPE_IMG   = new Image();

// Floor 
const FLOOR_IMG = new Image();


// Buttons
const SHARE_BUTTON_IMG = new Image();
const MENU_BUTTON_IMG = new Image();
const OK_BUTTON_IMG = new Image();
const PAUSE_BUTTON_IMG = new Image();

// Medals 
const SILVER_MEDAL_IMG = new Image();
const GOLD_MEDAL_IMG = new Image();

// Start screen / labels / icons 
const GAME_OVER_IMG = new Image();
const GAME_TITLE_IMG = new Image();
const GET_READY_LABEL_IMG = new Image();
const PLAY_BUTTON_IMG = new Image();
const LEADERBOARD_IMG = new Image();
const TAP_LEFT_IMG = new Image();
const TAP_RIGHT_IMG = new Image();
const ARROW_UP_IMG = new Image();
const HAND_IMG = new Image();
const NEW_LABEL_IMG = new Image();
const MENU_BOARD_IMG = new Image();

// Paths
UPPER_PIPE_IMG.src = SPRITES.upperPipe;
LOWER_PIPE_IMG.src = SPRITES.lowerPipe;

FLOOR_IMG.src = SPRITES.floor;
GAME_OVER_IMG.src = SPRITES.gameOver;
MENU_BOARD_IMG.src = SPRITES.menuBoard;

SHARE_BUTTON_IMG.src = SPRITES.shareButton;
MENU_BUTTON_IMG.src = SPRITES.menuButton;
OK_BUTTON_IMG.src = SPRITES.okButton;
PAUSE_BUTTON_IMG.src = SPRITES.pauseButton;

SILVER_MEDAL_IMG.src = SPRITES.silverMedal;
GOLD_MEDAL_IMG.src = SPRITES.goldMedal;

GAME_TITLE_IMG.src = SPRITES.gameTitle;
GET_READY_LABEL_IMG.src = SPRITES.getReadyLabel;
PLAY_BUTTON_IMG.src = SPRITES.playButton;   
LEADERBOARD_IMG.src = SPRITES.leaderboard;
TAP_LEFT_IMG.src = SPRITES.tapLeft;
TAP_RIGHT_IMG.src = SPRITES.tapRight;
ARROW_UP_IMG.src = SPRITES.arrowUp;
HAND_IMG.src = SPRITES.hand;
NEW_LABEL_IMG.src = SPRITES.newLabel;

/* ========== ASSETS: AUDIO ========== */
const hitAudio  = new Audio("./assets/audio/hit.ogg");
const wingAudio = new Audio("./assets/audio/wing.ogg");
wingAudio.preload = "auto";

/* ========== STATE ========== */
let gameBoard, context;

// Floor state
let floor = {
  x: 0,
  y: GAME.HEIGHT - GAME.FLOOR_H,
  width: 339,
  height: 69
};

// Player
let bean = {
  x: 35,
  y: GAME.HEIGHT / 2,
  width: 35,
  height: 35,
  img_state: 1
};
let beanImg = new Image();
beanImg.src = SPRITES.bean1;

// Gameplay 
let pipeArr = [];
let beanSpeed = 0;
let gameOver = true;
let score = 0;
let bestScore = 0;

// UI numbers 
let scoreNumberImg      = new Image();
let scoreNumberMenuImg  = new Image();
let bestScoreNumberImg  = new Image();


/* =========== POST-LOAD ACTIONS =========== */
window.onload = function() {
    gameBoard = document.getElementById("gameBoard");
    gameBoard.width = GAME.WIDTH;
    gameBoard.height = GAME.HEIGHT;
    context = gameBoard.getContext("2d");

    document.addEventListener("keydown", handleInput);
    drawStartScreen();
    // Start screen render loop: exits only when the player starts the game
    requestAnimationFrame(start);
}


/* =========== MAIN GAME LOOP =========== */
function update() {
    if (!gameOver) {
        requestAnimationFrame(update);
        context.clearRect(0, 0, GAME.WIDTH, GAME.HEIGHT); // clear canvas
        drawPipe();
        drawFloor();
        drawBean();
        drawNumbers(number=score, img=scoreNumberImg, x=10, y=10); // current score
    } else {
        drawGameOver();
    }
}


/* =========== UTILS =========== */
function aabb(a, b) {
    return (a.y < b.y + b.height &&
        a.y + a.height > b.y &&
        a.x < b.x + b.width &&
        a.x + a.width > b.x
    );
}


function start() {
    if (!gameOver){
        setInterval(spawnPipe, GAME.PIPE_SPAWN_MS); // +2 pipes every second
        setInterval(despawnPipe, GAME.PIPE_SPAWN_MS); // removes pipes that got past the canvas
        setInterval(animateBean, GAME.BEAN_UPDATE_MS); // animates bean image
    } else {
        requestAnimationFrame(start)
    }
}


function restartGame() {
    gameOver = false;
    score = 0;
    pipeArr = [];
    bean.y = GAME.HEIGHT/2;
    beanSpeed = 0;
    requestAnimationFrame(update);
}


function handleInput(e) {
    if (e.code == "Space" || e.code == "ArrowUp") {
        if (gameOver) {
            restartGame();
        } else {
            beanSpeed = -5; // resets speed to go 5px higher
            wingAudio.play();
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


function despawnPipe() {
    // Remove pipes that have moved completely off-screen
    for (let i=0; i<pipeArr.length;i++) {
        if (pipeArr[i].x == -PIPE_WIDTH) {
            pipeArr.slice(i, 1);
        }
    }
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


function drawStartScreen() {
    drawFloor();
    context.drawImage(beanImg, GAME.WIDTH/2-(bean.width/2),GAME.HEIGHT/2-50,35,35);
    context.drawImage(GAME_TITLE_IMG, (GAME.WIDTH-250)/2,50,250,40);
    context.drawImage(GET_READY_LABEL_IMG, (GAME.WIDTH-150)/2,430,150,30);
    context.drawImage(PLAY_BUTTON_IMG,0,GAME.HEIGHT-80,160,80);
    context.drawImage(LEADERBOARD_IMG,GAME.WIDTH-160,GAME.HEIGHT-80,170,80);
    context.drawImage(HAND_IMG,GAME.WIDTH-157,375,23,38);
    context.drawImage(ARROW_UP_IMG,GAME.WIDTH-154,350,15,15);
    context.drawImage(TAP_LEFT_IMG,GAME.WIDTH-210,390,42,19);
    context.drawImage(TAP_RIGHT_IMG,GAME.WIDTH-120,390,42,19);
}


function drawNumbers(number, img, x, y) {
    let numberStr = number.toString();
    for (let i=0; i < numberStr.length; i++) {
        switch (numberStr[i]) {
            case "0":
                img.src = SPRITES.zero;
                break;
            case "1":
                img.src = SPRITES.one;
                break;
            case "2":
                img.src = SPRITES.two;
                break;
            case "3":
                img.src = SPRITES.three;
                break;
            case "4":
                img.src = SPRITES.four;
                break;
            case "5":
                img.src = SPRITES.five;
                break;
            case "6":
                img.src = SPRITES.six;
                break;
            case "7":
                img.src = SPRITES.seven;
                break;
            case "8":
                img.src = SPRITES.eight;
                break;
            case "9":
                img.src = SPRITES.nine;
                break;
        }
        context.drawImage(img,x,y,
                          GAME.SCORE_W,
                          GAME.SCORE_H
                          );
        x += GAME.SCORE_W;
    }
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
            hitAudio.play()
            if (bestScore < score) {
                bestScore = score;
            }
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
                      bean.x,bean.y,
                      bean.width,bean.height
    );
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


function drawGameOver() {
    // "Game Over"
    context.drawImage(GAME_OVER_IMG,
                     (GAME.WIDTH - 220)/2,(GAME.HEIGHT/2 + GAME.FLOOR_H/2)/3,
                     220,44)
    
    // Menu board
    context.drawImage(MENU_BOARD_IMG,
                     (GAME.WIDTH - 252)/2,(GAME.HEIGHT/2 + GAME.FLOOR_H)/2,
                     252,142)

    // Medal (silver or gold)
    if (score > 10 && score < 30) {
        context.drawImage(SILVER_MEDAL_IMG,
                          GAME.WIDTH/4 - 5,GAME.HEIGHT/3 + 37,
                          45,45) 
    } else if (score >= 30) {
        context.drawImage(GOLD_MEDAL_IMG,
                          GAME.WIDTH/4 - 5,GAME.HEIGHT/3 + 37,
                          45,45)
    }   

    // "Share" button
    context.drawImage(SHARE_BUTTON_IMG,
                      GAME.WIDTH/9,GAME.HEIGHT/2 + 20,
                      70,30)
    
    // "Menu" button
    context.drawImage(MENU_BUTTON_IMG,
                      GAME.WIDTH/9 + 80,GAME.HEIGHT/2 + 20,
                      70,30)
    
    // "Ok" button
    context.drawImage(OK_BUTTON_IMG,
                      GAME.WIDTH/9 + 160,GAME.HEIGHT/2 + 20,
                      70,30)

    // New label
    context.drawImage(NEW_LABEL_IMG,
                      GAME.WIDTH/9 + 10,GAME.HEIGHT/4 + 30,
                      33,15)
    
    // Last score
    drawNumbers(number=score, img=scoreNumberMenuImg, 
                x=GAME.WIDTH/5 + 155, y=215);

    // Best score
    drawNumbers(number=bestScore, img=bestScoreNumberImg, 
                x=GAME.WIDTH/5 + 155, y=255);
}
