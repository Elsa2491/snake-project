window.onload = () => {

  class Game {

    constructor() {
      this.canvasWidth = 900;
      this.canvasHeight = 600;
      this.blockSize = 30;
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext("2d");
      this.widthInBlocks = this.canvasWidth / this.blockSize;
      this.heightInBlocks = this.canvasHeight / this.blockSize;
      this.delay = 100;
      this.snakee;
      this.applee;
      this.score;
      this.timeOut;
    };


    init() {
      this.canvas.width = this.canvasWidth;
      this.canvas.height = this.canvasHeight;
      this.canvas.style.border = "3px solid grey";
      this.canvas.style.margin = "100px auto";
      this.canvas.style.display = "block";
      this.canvas.style.backgroundColor = "#FCFCFC";
      document.body.appendChild(this.canvas);
      this.launch();
    };


    launch() {
      this.snakee = new Snake("right", [6,4], [5,4], [4,4]);
      this.applee = new Apple();
      this.score = 0;
      clearTimeout(this.timeOut);
      // this.delay = 100;
      this.refreshCanvas();
    };


    refreshCanvas() {
      this.snakee.advance();
      if(this.snakee.checkCollision(this.widthInBlocks, this.heightInBlocks)) {
       Drawing.gameOver(this.context);
      }
      else {
        if(this.snakee.isEatingApple(this.applee)) {
            this.score++;
            this.snakee.ateApple = true;
          do {
            this.applee.setNewPosition(this.widthInBlocks, this.heightInBlocks);
          }
          while(this.applee.isOnSnake(this.snakee));
        }
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        Drawing.drawScore(this.context, this.score, this.canvasHeight);
        Drawing.drawSnake(this.context, this.blockSize, this.snakee);
        Drawing.drawApple(this.context, this.blockSize, this.applee);
        this.timeOut = setTimeout(this.refreshCanvas.bind(this), this.delay);
      };
    };
  };


  class Snake {

    constructor(direction,...body) {
      this.body = body;
      this.direction = direction;
      this.ateApple = false;
    };

    advance() {
      const nextPosition = this.body[0].slice();
      switch(this.direction) {
        case "left":
          nextPosition[0] -= 1;
          break;
        case "right":
          nextPosition[0] += 1;
          break;
        case "up":
          nextPosition[1] -= 1;
          break;
        case "down":
          nextPosition[1] += 1;
          break;
        default:
          throw("Invalid direction");
      }
      this.body.unshift(nextPosition);
      if(!this.ateApple) {
        this.body.pop();
      }
      else
        this.ateApple = false;
    };

    setDirection(newDirection) {
      let allowedDirections;
      switch(this.direction) {
        case "left":
        case "right":
          allowedDirections = ["up", "down"];
          break;
        case "up":
        case "down":
          allowedDirections = ["left", "right"];
          break;
        default:
          throw("Invalid direction");
      }
      if(allowedDirections.includes(newDirection)) {
        this.direction = newDirection;
      }
    };

    checkCollision(widthInBlocks, heightInBlocks) {
      let wallCollision = false;
      let snakeCollision = false;
      const [head, ...rest] = this.body;
      const [snakeX, snakeY] = head;
      // OU BIEN
      // const [head, rest] = [this.body[0], this.body.slice(1)];
      // const [snakeX, snakeY] = [head[0], head[1]];
      const minX = 0;
      const minY = 0;
      const maxX = widthInBlocks - 1;
      const maxY = heightInBlocks - 1;
      const isNotBetweenHorizontalsWalls = snakeX < minX || snakeX > maxX;
      const isNotBetweenVerticalsWalls = snakeY < minY || snakeY > maxY;

      if(isNotBetweenHorizontalsWalls || isNotBetweenVerticalsWalls) {
        wallCollision = true;
      }
      for(let block of rest) {
        if(snakeX === block[0] && snakeY === block[1]) {
          snakeCollision = true;
        }
      }
      return wallCollision || snakeCollision;
    };

    isEatingApple(appleToEat) {
      const head = this.body[0];
      if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
        return true;
      }
      else
        return false;
    };
  };


  class Apple {

    constructor(position = [10, 10]) {
      this.position = position;
    };

    setNewPosition(widthInBlocks, heightInBlocks) {
      const newX = Math.round(Math.random() * (widthInBlocks - 1));
      const newY = Math.round(Math.random() * (heightInBlocks - 1));
      this.position = [newX, newY];
    };

    isOnSnake(snakeToCheck) {
      let isOnSnake = false;
      for(let block of snakeToCheck.body) {
        if(this.position[0] === block[0] && this.position[1] === block[1]) {
          isOnSnake = true;
        }
      }
      return isOnSnake;
    };
  };


  class Drawing {
    static gameOver(context) {
      context.save();
      context.font = "lighter 20px sans-serif";
      context.fillStyle = "#13190C";
      context.fillText("Game over", 10, 30);
      context.fillText("Press Space to return to the game", 10, 55);
      context.restore();
    };

    static drawScore(context, score, canvasHeight) {
      context.save();
      context.font = "bold 25px sans-serif";
      context.fillStyle = "grey";
      context.fillText(score.toString(), 10, canvasHeight - 10);
      context.restore();
    };

    static drawSnake(context, blockSize, snake) {
      context.save();
      context.fillStyle = "#84A98C";
      for(let block of snake.body) {
      //for(let i = 0; i < this.body.length; i++) {
        this.drawBlock(context, block, blockSize);
      };
    };

    static drawBlock(context, position, blockSize) {
      let x, y;
      [x, y] = [position[0], position[1]];
      context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
      // OU BIEN
      // let x, y;
      // [x, y] = [position[0] * blockSize, position[1] * blockSize];
      // context.fillRect(x, y, blockSize, blockSize);
    };

    static drawApple(context, blockSize, apple) {
      const radius = blockSize/2;
      const x = apple.position[0] * blockSize + radius;
      const y = apple.position[1] * blockSize + radius;
      context.save();
      context.fillStyle = "#AD1D21";
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2, true);
      context.fill();
      context.restore();
    };
  };


  let myGame = new Game();
  myGame.init();


  document.onkeydown = event => {
    const key = event.keyCode;
    let newDirection;
    switch(key) {
      case 37:
        newDirection = "left";
        break;
      case 39:
        newDirection = "right";
        break;
      case 38:
        newDirection = "up";
        break;
      case 40:
        newDirection = "down";
        break;
        case 32:
          myGame.launch();
          return;
      default:
        return;
    }
    myGame.snakee.setDirection(newDirection);
  };
};
