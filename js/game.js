/* CONSTANTS */
const GAME_BOARD = {
    HEIGHT: 515,
    WIDTH: 290
}
const PIPE_SPEED = -3; // 2px per frame update
const GRAVITY = 0.3; // 0.5px per frame update

const UPPER_PIPE_IMG = new Image();
UPPER_PIPE_IMG.src = "./assets/img/fbs-07.png";

const LOWER_PIPE_IMG = new Image();
LOWER_PIPE_IMG.src = "./assets/img/fbs-08.png";

const PIPE_HEIGHT = 325;
const PIPE_WIDTH = 49;

/* STATE */
let gameBoard;
let context;
let beanImg;
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
    if (!gameOver) {
        requestAnimationFrame(update);
        context.clearRect(0, 0, 
                          GAME_BOARD.WIDTH, GAME_BOARD.HEIGHT);
    
        for (let i=0; i < pipeArr.length; i++) {
            let auxPipe = pipeArr[i];
            context.drawImage(auxPipe.img, 
                              auxPipe.x, 
                              auxPipe.y, 
                              auxPipe.width, 
                              auxPipe.height);
            auxPipe.x += PIPE_SPEED;
            
            // End game if there's a collision with a pipe or the bean falls below the board
            if (aabb(bean, auxPipe) || bean.y > GAME_BOARD.HEIGHT) {
                gameOver = true;
            }
        }
        
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
    if (e.code == "Space") {
        beanSpeed = -5; // resets speed to go 5px higher
    }
}


function spawnPipe() {
    let randomPipeY = -PIPE_HEIGHT + PIPE_HEIGHT/3 + Math.random()*PIPE_HEIGHT/2;
    let defaultPipeDistance = 100;

    let upperPipe = {
        img: UPPER_PIPE_IMG,
        x: GAME_BOARD.WIDTH, // @ the far-right of the canvas
        y: randomPipeY,
        height: PIPE_HEIGHT,
        width: PIPE_WIDTH
    }

    let lowerPipe = {
        img: LOWER_PIPE_IMG,
        x: GAME_BOARD.WIDTH,
        y: PIPE_HEIGHT + randomPipeY + defaultPipeDistance,
        height: PIPE_HEIGHT,
        width: PIPE_WIDTH
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
