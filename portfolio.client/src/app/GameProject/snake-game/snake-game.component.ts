import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../service/sweet-alert.service';
import { SnakeScoreService, SnakeScore, GetSnakeScore } from '../../service/snake-score.service';
import { HttpClientModule } from '@angular/common/http';
import { HighScoreComponent } from '../high-score/high-score.component';


@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,HighScoreComponent],
  templateUrl: './snake-game.component.html',
  styleUrl: './snake-game.component.css',
  providers: [SnakeScoreService]
})
export class SnakeGameComponent  {
  canvas: HTMLCanvasElement | null = null; 
  ctx: CanvasRenderingContext2D | null = null; 
  snake: any[] = [{ x: 8, y: 8 }];
  food: any[] = [];
  gridSize = 15;
  tileSize = 40;
  velocity = { x: 0, y: 0 };
  gameOver = false;
  score = 0;
  difficulty: number = 1; 
  numberOfFoods = 2;
  username: string = '';
  offsetX = 0;
  offsetY = 0;
  lastFoodTime: number = Date.now();
  backgroundDrawn: boolean = false;
  backgroundImage: HTMLImageElement | null = null; 
  gameStarted: boolean = false;
  chiliImage = new Image();
  extraFoodImage = new Image();
  extraFood: { x: number, y: number } | null = null;
  extraFoodTimer: any = null;
  extraFoodSpawnInterval: any = null;
  extraFoodScore: number = 0;
  snakeHeadImage = new Image();
  bonusScore: number = 0;
  bonusAmount: number = 0;

  @ViewChild('highscore') highscore!: HighScoreComponent;
  constructor(private alertService: AlertService, private snakeScoreService: SnakeScoreService) {
    this.chiliImage.src = 'assets/pizza.png';
    this.snakeHeadImage.src = 'assets/snake.png';
    this.extraFoodImage.src = 'assets/chili.png';
  }

  submitScore() {
    const score: SnakeScore = {
      username: this.username,  
      score: this.score,           
      timePlay: 300,      
      difficulty: this.difficulty,
      extraFoodScore: this.extraFoodScore,
      bonusAmount: this.bonusAmount,
      bonusScore: this.bonusScore
    };

    this.snakeScoreService.addScore(score).subscribe(
      response => {
        console.log('Score submitted successfully. Record ID:', response.RecordId);
      },
      error => {
        console.error('Error submitting score:', error);
      }
    );
  }

  startGame() {
    const usernameInput = (document.getElementById('username') as HTMLInputElement).value;
    if (usernameInput) {
      this.username = usernameInput;
      this.drawBackground(); 
      this.initGame();
    }
    else {
      this.alertService.showAlert('Proszę wprowadzić swoją nazwę!', '');
      return;
    }
  }
  initGame(): void {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    }
    if (!this.backgroundDrawn) {
      this.drawBackground();
    }

    this.resetGame();

    if (this.snake.length > 1) {
      console.log("Snake initialized correctly:", this.snake);
    } else {
      console.error("Snake initialization failed or snake is too short.");
      return;
    }

    if (this.ctx) {
      this.clearCanvas();
      this.drawSnake();
      this.drawFood();
    }

    this.extraFoodSpawnInterval = setInterval(() => {
      if (!this.extraFood) {
        this.spawnExtraFood();
      }
    }, 10000);
  }
  resetGame(): void {
    this.snake = [
      { x: 8, y: 8 }, 
      { x: 8, y: 7 }, 
    ];
    this.velocity = { x: 0, y: 0 };
    this.spawnFood();
    this.score = 0;
    this.gameOver = false;
    this.lastFoodTime = Date.now();
    this.gameStarted = false;
    this.extraFoodScore = 0;
    this.bonusAmount = 0;
    this.bonusScore = 0;

    if (this.extraFoodTimer) {
      clearTimeout(this.extraFoodTimer);
      this.extraFoodTimer = null;
    }
    if (this.extraFoodSpawnInterval) {
      clearInterval(this.extraFoodSpawnInterval);
      this.extraFoodSpawnInterval = null;
    }
    this.extraFood = null;
  }
  endGame(): void {
    this.gameOver = true;

    if (this.extraFoodTimer) {
      clearTimeout(this.extraFoodTimer);
      this.extraFoodTimer = null;
    }
    if (this.extraFoodSpawnInterval) {
      clearInterval(this.extraFoodSpawnInterval);
      this.extraFoodSpawnInterval = null;
    }
    this.alertService.showSuccess('Gratulacje', ' Twój wynik to: ' + this.score);

    this.submitScore();
    this.highscore.update();
  }
  spawnFood(): void {
    this.food = [];
    for (let i = 0; i < this.numberOfFoods; i++) {
      this.food.push({
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize)
      });
    }
  }
  spawnExtraFood(): void {

    this.extraFood = {
      x: Math.floor(Math.random() * this.gridSize),
      y: Math.floor(Math.random() * this.gridSize)
    };
    this.extraFoodTimer = setTimeout(() => {
      this.extraFood = null;
    }, 5000);
  }
  drawBackground(): void {
    if (this.ctx && !this.backgroundDrawn) {
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = this.canvas!.width;
      offscreenCanvas.height = this.canvas!.height;
      const offscreenCtx = offscreenCanvas.getContext('2d');

      for (let x = 0; x < this.gridSize; x++) {
        for (let y = 0; y < this.gridSize; y++) {
          offscreenCtx!.fillStyle = (x + y) % 2 === 0 ? '#333333' : '#444444';
          offscreenCtx!.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
        }
      }
      const dataURL = offscreenCanvas.toDataURL();
      this.backgroundImage = new Image();
      this.backgroundImage.src = dataURL;
      this.ctx.drawImage(this.backgroundImage, 0, 0);

      this.backgroundDrawn = true;
    }
  }
  updateGame(): void {
    if (this.gameOver) return;

    this.moveSnake();
    if (this.isCollision()) {
      this.endGame();
      return;
    }

    if (this.ctx) {
      this.clearCanvas();
      this.drawSnake();
      this.drawFood();
    }

    this.food.forEach((f, index) => {
      if (this.snake[0].x === f.x && this.snake[0].y === f.y) {
        this.eatFood(index);
      }
    });

    if (this.extraFood && this.snake[0].x === this.extraFood.x && this.snake[0].y === this.extraFood.y) {
      this.eatExtraFood();
      
    }

    if (this.food.length === 0) {
      this.spawnFood();
    }

    setTimeout(() => requestAnimationFrame(() => this.updateGame()), 300 / (this.difficulty));
  }
  eatExtraFood(): void {

    this.score += 200;
    this.extraFoodScore +=1
    const segmentsToRemove = Math.min(3, this.snake.length - 3);
    for (let i = 0; i < segmentsToRemove; i++) {
      this.snake.pop();
    }
    if (this.snake.length < 1) {
      this.endGame();
      return;
    }
    this.extraFood = null;

    if (this.extraFoodTimer) {
      clearTimeout(this.extraFoodTimer);
      this.extraFoodTimer = null;
    }
  }
  moveSnake(): void {
    if (this.velocity.x === 0 && this.velocity.y === 0) return; 

    const head = {
      x: this.snake[0].x + this.velocity.x,
      y: this.snake[0].y + this.velocity.y
    };
    this.snake.unshift(head);
    this.snake.pop();
  }
  isCollision(): boolean {
    const head = this.snake[0];
    if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
      return true;
    }

    for (let i = 1; i < this.snake.length; i++) {
      if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
        return true;
      }
    }

    return false;
  }
  eatFood(index: number): void {
    const currentTime = Date.now();
    const timeDifference = (currentTime - this.lastFoodTime) / 1000; 
    if (timeDifference < 1) {
      this.score += 25;
      this.bonusAmount += 1;
      this.bonusScore += 25
      this.showBonusEffect(); 
    }

    this.lastFoodTime = currentTime;

    if (this.difficulty === 2) {
      this.score += 10 * 4;
    } else if (this.difficulty === 3) {
      this.score += 10 * 6;
    } else if (this.difficulty === 5) {
      this.score += 10 * 10;
    } else if (this.difficulty === 7) {
      this.score += 10 * 15;
    } else if (this.difficulty === 10) {
      this.score += 10 * 25;
    } else {
      this.score += 10 * this.difficulty;
    }

    this.snake.push({});
    this.food.splice(index, 1);
  }
  showBonusEffect(): void {
    if (!this.ctx) return;

    const bonusText = "Extra bonus +25 pkt";
    const duration = 500; 
    const startTime = Date.now();


    const animateBonus = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      if (elapsed > duration) {
        this.clearCanvas();
        return;
      }
      const borderColor = `rgba(204, 255, 204, ${Math.abs(Math.sin(elapsed / 200))})`; 
      this.ctx!.strokeStyle = borderColor;
      this.ctx!.lineWidth = 10;
      this.ctx!.strokeRect(5, 5, this.canvas!.width - 10, this.canvas!.height - 10);

      this.ctx!.font = "30px Arial";
      this.ctx!.fillStyle = borderColor;
      this.ctx!.textAlign = "center";
      this.ctx!.fillText(bonusText, this.canvas!.width / 2, this.canvas!.height / 2);

      requestAnimationFrame(animateBonus); 
    };


    animateBonus();

    setTimeout(() => this.clearCanvas(), duration);
  }
  clearCanvas(): void {
    if (this.ctx && this.backgroundImage) {
   
      this.ctx.drawImage(this.backgroundImage, 0, 0);
    }
  }
  drawSnake(): void {
    if (!this.ctx) return;

    if (!this.snake || this.snake.length < 2) {
      return;
    }

    this.ctx!.strokeStyle = '#32CD32';
    this.ctx!.lineWidth = this.tileSize * 0.7;
    this.ctx!.lineCap = 'round';


    this.ctx!.beginPath();
    this.ctx!.moveTo(
      this.snake[0].x * this.tileSize + this.tileSize / 2,
      this.snake[0].y * this.tileSize + this.tileSize / 2
    );


    this.snake.slice(1).forEach((part, index) => {
      const offset = index % 2 === 0 ? 1.5 : -1.5; 
      this.ctx!.lineTo(
        part.x * this.tileSize + this.tileSize / 2 + offset,
        part.y * this.tileSize + this.tileSize / 2 + offset
      );
    });

    this.ctx!.stroke(); 
    const head = this.snake[0];
    this.ctx!.save();
    this.ctx!.translate(
      (head.x * this.tileSize) + this.tileSize / 2,
      (head.y * this.tileSize) + this.tileSize / 2
    );

    if (this.velocity.x === 1) {
      this.ctx!.rotate(-Math.PI / 2);
    } else if (this.velocity.x === -1) {
      this.ctx!.rotate(Math.PI / 2);
    } else if (this.velocity.y === -1) {
      this.ctx!.rotate(Math.PI);
    } else if (this.velocity.y === 1) {
      this.ctx!.rotate(0);
    }

    const headSize = this.tileSize * 1.5; 
    this.ctx!.drawImage(
      this.snakeHeadImage,
      -headSize / 2,
      -headSize / 2,
      headSize,
      headSize
    );
    this.ctx!.restore();
  }
  drawFood(): void {
    if (this.ctx) {
      this.food.forEach(f => {
        this.ctx!.drawImage(this.chiliImage, f.x * this.tileSize, f.y * this.tileSize, this.tileSize, this.tileSize);
      });

      if (this.extraFood) {

        if (this.extraFoodImage.complete) {
          this.ctx!.drawImage(this.extraFoodImage, this.extraFood.x * this.tileSize, this.extraFood.y * this.tileSize, this.tileSize, this.tileSize);
        } else {
          this.ctx!.fillStyle = 'gold';
          this.ctx!.fillRect(this.extraFood.x * this.tileSize, this.extraFood.y * this.tileSize, this.tileSize, this.tileSize);
        }
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent): void {
    if (!this.gameStarted) {
      switch (event.key) {
        case 'ArrowUp':
          this.velocity = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          this.velocity = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          this.velocity = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          this.velocity = { x: 1, y: 0 };
          break;
        default:
          return;
      }
      this.gameStarted = true;
      this.updateGame();
    } else {

      switch (event.key) {
        case 'ArrowUp':
          if (this.velocity.y === 0) this.velocity = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (this.velocity.y === 0) this.velocity = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (this.velocity.x === 0) this.velocity = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (this.velocity.x === 0) this.velocity = { x: 1, y: 0 };
          break;
      }
    }
  }
  changeDifficulty(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.difficulty = parseInt(value, 10);
    this.resetGame();
  }

}

