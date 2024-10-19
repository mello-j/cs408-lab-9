//global variables for gameplay
let gamePlay;
let balls;
let evilCircle;

// set up canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// grab paragraph
const p = document.querySelector("p");
let scoreCount = 0;

//Need to finish....add a game over check and a button to start/stop.
function checkGameOver() {
  if (scoreCount === 0){
    gameRunning = false;
  }
}

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

//New Shape Class
class Shape {

  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

//Updated ball class extends Shape
class Ball extends Shape {

  constructor(x, y, velX, velY, color, size, exists) {
    super(x, y, velX, velY)
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  draw(){
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();    
  }
  

  update() {
    if (this.x + this.size >= width) {
      this.velX = -Math.abs(this.velX);
    }

    if (this.x - this.size <= 0) {
      this.velX = Math.abs(this.velX);
    }

    if (this.y + this.size >= height) {
      this.velY = -Math.abs(this.velY);
    }

    if (this.y - this.size <= 0) {
      this.velY = Math.abs(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  
  collisionDetect() {
    for (const ball of balls) {
      //updated to check that ball exists
      if (!(this === ball) && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

//Adding in EvilCircle class that inherits from Shaope
class EvilCircle extends Shape{

  constructor(x,y) {
    super(x, y, 50, 50)
    this.color = "white";
    this.size = 25;
    this.maxSize = 200;

    //stay puft man
    this.image = new Image();
    this.image.src = 'img/staypuft.jpg';

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }

  //Evil circle draw method
  draw() {
    //draw mr. puft
      if (this.image.complete) {
        ctx.drawImage(
          this.image,
          this.x - this.size,
          this.y - this.size,
          this.size * 2,
          this.size * 2
        );
      } else {
      //change Evil circle fill and outline
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  //Evil Circle checkbounds method adapted from ball.update
  //Todo - update the means to calculate evilCircle
  checkBounds() {
    if (this.x + this.size >= width) {
      this.x -= this.size;
    }

    if (this.x - this.size <= 0) {
      this.x += this.size;
    }

    if (this.y + this.size >= height) {
      this.y -= this.size;
    }

    if (this.y - this.size <= 0) {
      this.y += this.size;
    }
  }

  //EvilCircle Collision Detect method
  collisionDetect() {
    for (const ball of balls) {
      //updated to check that ball exists
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        //updated to set ball.exists to false
        if (distance < this.size + ball.size) {
          ball.exists = false;
       
          //ball eaten, evil circle growzzzz and evil circle slowzzzz
          if(this.size < this.maxSize){
            this.size+= this.size / 5
            this.size = Math.min(this.size, this.maxSize);
            this.velX -= this.velX / 20;
            this.velY -= this.velY / 20;
          }

          scoreCount--;
          p.textContent = "Ball count: " + scoreCount;

          if (scoreCount == 0){

          }
        }
      }
    }
  }
}

//start gamePlay
function playGame() {
  scoreCount = 0;
  balls = [];
  gamePlay = true;
  evilCircle = new EvilCircle(random(0,canvas.width), random(0,canvas.height));


  while (balls.length < 25) {
    const size = random(10, 20);
    const ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-7, 7),
      random(-7, 7),
      randomRGB(),
      size
    );
  
    balls.push(ball);
    scoreCount++;
    p.textContent = "Ball count: " + scoreCount;
  }

  loop();
}

function loop() {
  if (!gamePlay){
    return;
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    //Only draw if ball exists to account for eaten balls
    if (ball.exists){
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

   //Draw Evil Circle objecty evilCircle, bring into the program
  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  checkGameOver();
  requestAnimationFrame(loop);
}

playGame();
