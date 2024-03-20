let board;
const boardWidth = 320;
const boardHeight = 512;
let context;

const doodlerWidth = 46;
const doodlerHeight = 46;

let doodlerImgRight;
let doodlerImgLeft;

let doodlerX = boardWidth/2-doodlerWidth/2;
let doodlerY = boardHeight/1.2;

let doodler = {
    img:null,
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodlerHeight
}

let brickArray = [];
let brickWidth = 60;
let brickHeight = 18;
let brickX = boardWidth/2;
let brickY = boardHeight/2;

let brickImg;

let gravity = 0.4;
let velocityX = 0;
let velocityY = 0;
let initialVelocity = -8;

let score = 0;
let gameOver = false;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    doodlerImgRight = new Image();
    doodlerImgRight.src = "./images/doodler-right.png"
    doodler.img = doodlerImgRight;
    doodlerImgRight.onload = function (){
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }
    
    brickImg = new Image();
    brickImg.src = "./images/platform.png";

    doodlerImgLeft = new Image();
    doodlerImgLeft.src = "./images/doodler-left.png"
 
    velocityY = initialVelocity;

    placeBricks();
    requestAnimationFrame(Update);

    document.addEventListener("keydown", moveDoodler);
    document.addEventListener("keyup", stopDoodler);
}

function Update(){
    requestAnimationFrame(Update);
    if(gameOver){
        context.fillStyle = "red";
        context.font = "45px system-ui";
        context.fillText("Game Over", 50, 280);
        context.fillStyle = "gray";
        context.font = "20px system-ui";
        context.fillText("Press Space to Restart", 66, 310)
        return;
    }
    context.clearRect(0, 0, board.width, board.height);


    doodler.x+=velocityX;

    if(doodler.x>boardWidth){
        doodler.x = -doodlerWidth;
    }
    if(doodler.x<-doodlerWidth){
        doodler.x = boardWidth;
    }
    velocityY += gravity;
    doodler.y = doodler.y+velocityY;
    
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);


    

    for(let i = 0; i<brickArray.length; i++){
        
        let brick = brickArray[i];
        
        if(velocityY<0 && doodler.y<boardHeight*3/4){
            brick.y-= initialVelocity;
        }
        if(collisionDetection(doodler, brick) && velocityY>=0){
            velocityY = initialVelocity;
            score++;
        }
        context.drawImage(brick.img, brick.x, brick.y, brick.width, brick.height);
    }

    while(brickArray.length>0 && brickArray[0].y>=boardHeight){
        brickArray.shift();
        newBricks();
    }
    
    context.fillStyle = "gray";
    context.font = "30px system-ui";
    context.fillText(score, 15, 40);

    if(doodler.y>boardHeight){
        gameOver = true;
    }
}


function moveDoodler(e){
    if(e.code == "ArrowLeft" || e.code == 
    "KeyA"){
        doodler.img = doodlerImgLeft;
        velocityX = -4;
    }
    else if(e.code == "ArrowRight" || e.code == "KeyD"){
        doodler.img = doodlerImgRight;
        velocityX = 4;

    }
    if(e.code == "Space"){
        gameOver = false;
        doodler.x = doodlerX;
        doodler.y = doodlerY;
        brickArray = [];
        score = 0;
        placeBricks();

    }
}
function stopDoodler(e){
    if(e.code == "ArrowLeft" || e.code == 
    "KeyA" || e.code == "ArrowRight" || e.code == "KeyD" ){
        velocityX = 0;
    }

}

function placeBricks(){
        let brick = {
            img: brickImg,
            x: boardWidth/2,
            y: boardHeight-50,
            width: brickWidth,
            height: brickHeight,
        }
    
        brickArray.push(brick);
        
    for(let i = 0; i<6; i++){
        let randomBrickX = Math.floor(Math.random()*boardWidth*3/4);
        let brick = {
            img: brickImg,
            x: randomBrickX,
            y: boardHeight-75*i-150,
            width: brickWidth,
            height: brickHeight,
        }
    
        brickArray.push(brick);
    }
    
}
function newBricks(){
    let randomBrickX = Math.floor(Math.random()*boardWidth*3/4);
    let brick = {
        img: brickImg,
        x: randomBrickX,
        y: -brickHeight,
        width: brickWidth,
        height: brickHeight,
    }

    brickArray.push(brick);
}


function collisionDetection(a, b){
    let collision = false;
    if(a.x < b.x + b.width &&
       a.x + a.width > b.x &&
       a.y < b.y + b.height &&
       a.y + a.height > b.y ){
        collision = true;
       }
    return collision;
}
