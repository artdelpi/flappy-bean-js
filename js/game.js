/* CONSTANTS */
const GAME_BOARD = {
    HEIGHT: 616,
    WIDTH: 290
}
const PIPE_SPEED = -3; // 2px per frame update
const GRAVITY = 0.3; // 0.5px per frame update

const UPPER_PIPE_IMG = new Image();
UPPER_PIPE_IMG.src = "./assets/img/fbs-07.png";

const LOWER_PIPE_IMG = new Image();
LOWER_PIPE_IMG.src = "./assets/img/fbs-06.png";

const FLOOR_IMG = new Image();
FLOOR_IMG.src = "./assets/img/fbs-04.png";

const PIPE_HEIGHT = 325;
const PIPE_WIDTH = 49;
const PIPE_DISTANCE = 100;

/* STATE */
let gameBoard;
let context;
let beanImg;

let floor = {
    x: 0,
    y: GAME_BOARD.HEIGHT - 111,
    height: 111,
    width: 339
}

let bean = {
    x: 35, // immutable
    y: GAME_BOARD.HEIGHT / 2, // middle of the y-axis
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
    gameBoard.width = GAME_BOARD.WIDTH;
    gameBoard.height = GAME_BOARD.HEIGHT;
    context = gameBoard.getContext("2d");

    document.addEventListener("keydown", moveBean);

    requestAnimationFrame(update);
    setInterval(spawnPipe, 1000); // +2 pipes every second

    beanImg = new Image();
    setInterval(animateBean, 300); // animates bean image
}


/* MAIN GAME LOOP */
function update() {
    requestAnimationFrame(update);
    if (!gameOver) {
        // Clear canvas
        context.clearRect(0, 0, 
                          GAME_BOARD.WIDTH, GAME_BOARD.HEIGHT);
        drawPipe();
        drawFloor();
        drawBean();
        drawScore();
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
    let randomPipeY = -PIPE_HEIGHT + PIPE_HEIGHT/3 + Math.random()*PIPE_HEIGHT/2;

    let upperPipe = {
        img: UPPER_PIPE_IMG,
        x: GAME_BOARD.WIDTH, // @ the far-right of the canvas
        y: randomPipeY,
        height: PIPE_HEIGHT,
        width: PIPE_WIDTH,
        passed: false
    }

    let lowerPipe = {
        img: LOWER_PIPE_IMG,
        x: GAME_BOARD.WIDTH,
        y: PIPE_HEIGHT + randomPipeY + PIPE_DISTANCE,
        height: PIPE_HEIGHT,
        width: PIPE_WIDTH,
        passed: false
    }

    pipeArr.push(upperPipe);
    pipeArr.push(lowerPipe);
}


function animateBean() {
    if (!gameOver) {
        switch (bean.img_state) {
            case 1:
                beanImg.src = "./assets/img/fbs-02.png" // state 1 to 2
                bean.img_state = 2;
                break;
            case 2:
                beanImg.src = "./assets/img/fbs-03.png" // state 2 to 3
                bean.img_state = 3;
                break;
            case 3:
                beanImg.src = "./assets/img/fbs-01.png" // state 3 to 1
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
    bean.y = GAME_BOARD.HEIGHT/2;
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
        auxPipe.x += PIPE_SPEED;
        // End game if there's a collision or the bean falls below the board
        if (aabb(bean, auxPipe) || bean.y > GAME_BOARD.HEIGHT - floor.height) {
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
    beanSpeed += GRAVITY;
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
    context.font = "30px Arial";
    context.fillStyle = "white";
    context.fillText(score, 10, 35);
}


function drawFloor() {
    if (floor.x < -floor.width) {
        floor.x = 0; // reset floor drawing
    }
    floor.x += PIPE_SPEED
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