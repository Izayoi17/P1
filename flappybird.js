//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//burung
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
  x : birdX,
  y : birdY,
  width : birdWidth,
  height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 38/3072 = 1/8 64 bahagi 512 dpt 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed sebab ke kiri jadi negative
let velocityY = 0;//bird jump   0 means speed burung x lompat langsung  
let gravity = 0.2; //positive number pergi kebawah  

let gameOver = false;
let score = 0;



window.onload = function(){
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //untuk draw atas board 

  //lukis burung
  context.fillStyle = "green";
  //context.fillRect(bird.x, bird.y, bird.width, bird.height);

  //load image
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = function(){
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)
  }

  topPipeImg = new Image();
  topPipeImg.src ="./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src ="./bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 1500); //setiap 1500 milisecond atau 1.5 sec
  document.addEventListener("keydown" ,moveBird);
}

function update(){
  requestAnimationFrame(update);
  if(gameOver){
    return;
  }
  context.clearRect(0, 0, board.width, board.height); //untuk clear board

  //bird
  velocityY += gravity;
  //bird.y += velocityY;
  bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit bird.y pegi atas sgt
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height){
    gameOver = true;
  }


  //pipes
  for(let i = 0; i < pipeArray.length; i++){
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if(!pipe.passed && bird.x > pipe.x + pipe.width){
      score += 0.5; // sebab ada dua pipes bahagikan 2 untuk dpt 1 score
      pipe.passed = true;
    }

    if(detectCollision(bird, pipe)){
      gameOver = true;
    }
  }


  //clear pipes
  while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){ //guna pipe width sebab nak hilangkan lepas saiz paip habis bukannya hilang sekaligus
    pipeArray.shift(); //removes first element from the array atau sng kata pipe yang dah lepas tu kita buang supaya x makan memory
  }



  //score
  context.fillStyle ="white";
  context.font="45px sans-serif";
  context.fillText(score, 5 ,45);

  if(gameOver){
    context.fillText("GAME OVER", 5, 90);
  }
}

function placePipes(){
  if(gameOver){
    return;
  }
//math random tu return value (0-1) * pipeHeight/2
//kalau random turns 0 dia jadi -128 (pipeHeight/4)
//kalau random turns 1 dia jadi -128 -256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
  let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
  let openingSpace = board.height/4;

  let topPipe = {
    img : topPipeImg,
    x : pipeX,
    y : randomPipeY,
    width : pipeWidth,
    height : pipeHeight,
    passed : false
  }

  pipeArray.push(topPipe);

  let bottomPipe = {
    img : bottomPipeImg,
    x : pipeX,
    y : randomPipeY + pipeHeight + openingSpace,
    width : pipeWidth, 
    height : pipeHeight,
    passed : false
  }
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if(e.code == "Space" || e.code == "ArrowUp" || e.code =="KeyX"){ // "||" means or
    //jump
    velocityY = -6;

    //reset game
    if(gameOver){
      bird.y = birdY; //burung mula tempat sama
      pipeArray = []; //pipe xde lagi
      score = 0;
      gameOver = false;
    }
  }
}

function detectCollision(a,b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}