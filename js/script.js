const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const blocksize = 10;
const widthInBlocks = width / blocksize;
const heightInBlocks = height / blocksize;
let animationTime = 100;
let gameOff = false;


let score = 0;

const drawBorder = function () {
    ctx.fillStyle = 'Black';
    ctx.fillRect(0, 0, width, blocksize);
    ctx.fillRect(0, height - blocksize, height, blocksize);
    ctx.fillRect(0, 0, blocksize, height);
    ctx.fillRect(width - blocksize, 0, blocksize, height);
};

let drawScore = () => {
    ctx.font = '20px Courier';
    ctx.fillStyle = 'Black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Score: ' + score, blocksize, blocksize)
}
const gameOver = () => {
    gameOff = true;
    ctx.font = '60px Courier';
    ctx.fillStyle = 'Black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', width / 2, height / 2);
    
}
let circle = (x, y, r) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
}

class Block {
    constructor(col, row) {
        this.col = col;
        this.row = row;
    }
    
    drawSquare(color) {
        let x = this.col * blocksize;
        let y = this.row * blocksize;
        ctx.fillStyle = color;
        ctx.fillRect(x,y,blocksize,blocksize)
    }
    drawCirlce(color) {
        let centerX = this.col * blocksize + blocksize / 2;
        let centerY = this.row * blocksize + blocksize / 2;
        ctx.fillStyle = color;
        circle(centerX,centerY,blocksize/2)
    }
    equal(otherBlock) {
        return this.col === otherBlock.col && this.row === otherBlock.row
    }
}

class Snake {
    constructor() {
        this.segments = [
            new Block(7, 5),
            new Block(6, 5),
            new Block(5, 5),
        ];
        this.direction = 'right';
        this.nextDirection = 'right'
    }
    
    draw() {
        this.segments.forEach((part, index) => {
            index === 0
            ? part.drawSquare('Green')
            : (index % 2 !== 0
                ? part.drawSquare('Blue')
                : part.drawSquare('Yellow'))
            }) 
        }
    move() {
            let head = this.segments[0];
            let newHead;
            
            this.direction = this.nextDirection;
            
            if (this.direction === 'right') {
                newHead = new Block(head.col + 1, head.row);
            }
            if (this.direction === 'down') {
                newHead = new Block(head.col, head.row + 1);
            }
            if (this.direction === 'left') {
                newHead = new Block(head.col - 1, head.row);
            }
            if (this.direction === 'up') {
                newHead = new Block(head.col, head.row - 1);
            }
            
            if (this.checkCollision(newHead)) {
                gameOver();
                return;
            }
            
            this.segments.unshift(newHead);
            
            if (newHead.equal(apple.position)) {
                score++
                animationTime -= 5;
                apple.move();
            } else {
                this.segments.pop();
            }
        }
    checkCollision(head) {
            const leftCollision = (head.col === 0);
            const topCollision = (head.row === 0);
            const rightCollision = (head.col === widthInBlocks - 1);
            const upCollision = (head.row === widthInBlocks - 1);
            
            let wallCollision = leftCollision || topCollision || rightCollision || upCollision;
            
            let selfCollision = false;
            
            this.segments.forEach(part => {
                if (part.equal(head)) {
                    return selfCollision = true
                } 
            }) 
            
            return wallCollision || selfCollision;
        }
    setDirection(newDirection) {
        if (this.direction === 'up' && newDirection === 'down') { return }
        if (this.direction === 'right' && newDirection === 'left') {return}
        if (this.direction === 'down' && newDirection === 'up') {return}
        if (this.direction === 'left' && newDirection === 'right') {return}
        
        this.nextDirection = newDirection;
    }
}

class Apple {
    constructor() {
        this.position = new Block(10,10)
    }
    
    draw() {
        this.position.drawCirlce('Red')
    }
    move() {
        let randomCol = Math.floor(Math.random() * (widthInBlocks - 2) + 1);
        let randomRow = Math.floor(Math.random() * (widthInBlocks - 2) + 1);
        if (snake.segments.filter(part => part === this.position).length !==0) {
            this.move();
        }
        this.position = new Block(randomCol, randomRow);
    }
}

let snake = new Snake();
let apple = new Apple();

const directions = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowRight: 'right',
    ArrowLeft: 'left',
    KeyW: 'up',
    KeyS: 'down',
    KeyD: 'right',
    KeyA: 'left',
}

const body = document.querySelector('body')
body.addEventListener('keydown', function (event) {
    let newDirection = directions[event.code];
    if (newDirection) {
        snake.setDirection(newDirection);
    }
});

let gameLoop = () => {
    if (gameOff) return;
    console.log(gameOff)

    ctx.clearRect(0, 0, width, height);
    drawScore();
    drawBorder();
    snake.draw();
    apple.draw();
    snake.move();
    setTimeout(gameLoop, animationTime);

}
gameLoop();
