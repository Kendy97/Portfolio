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
  snake: any[] = [{ x: 10, y: 10 }];
  food: any[] = [];
  gridSize = 15;
  tileSize = 40;
  velocity = { x: 0, y: 0 };
  gameOver = false;
  score = 0;
  difficulty = 1;
  numberOfFoods = 2;
  countdown: number = 3;
  isCountingDown: boolean = false;
  username: string = '';
  chiliImage = new Image(); 
  snakeHeadImage = new Image();
  offsetX = 0;
  offsetY = 0;

  @ViewChild('highscore') highscore!: HighScoreComponent;
  constructor(private alertService: AlertService, private snakeScoreService: SnakeScoreService) {
    this.chiliImage.src = 'assets/chili.png';
    this.snakeHeadImage.src = 'assets/snake.png';
}

  submitScore() {
    const score: SnakeScore = {
      username: this.username,  
      score: this.score,           
      timePlay: 300,      
      difficulty: this.difficulty        
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
      this.isCountingDown = true;
      this.countdown = 3;
      const countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(countdownInterval);
          this.isCountingDown = false;
          this.initGame();
        }
      }, 1000);
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
    this.resetGame();
    this.drawBackground();  
    this.updateGame();
  }


  resetGame(): void {
    this.snake = [{ x: 10, y: 10 }];
    this.velocity = { x: 1, y: 0 };
    this.spawnFood();
    this.score = 0;
    this.gameOver = false;
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
  drawBackground(): void {
    if (this.ctx && !this.gameOver) {
      const backgroundImage = document.createElement('canvas');
      backgroundImage.width = this.canvas!.width;
      backgroundImage.height = this.canvas!.height;
      const backgroundCtx = backgroundImage.getContext('2d');

      for (let x = 0; x < this.gridSize; x++) {
        for (let y = 0; y < this.gridSize; y++) {
          backgroundCtx!.fillStyle = (x + y) % 2 === 0 ? '#333333' : '#444444';
          backgroundCtx!.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
        }
      }
      this.ctx.drawImage(backgroundImage, 0, 0);
    }
  }



  updateGame(): void {
    if (this.gameOver) return;

    this.moveSnake();
    this.drawSnake();
    if (this.isCollision()) {
      this.gameOver = true;
      if (this.score >= 100) {
        this.alertService.showSuccess('Gratulacje', ' Twój wynik to: ' + this.score);
      }
      else {
        this.alertService.showSuccess('Spróbuj ponownie!', 'Twój wynik to: ' + this.score);
      }

      this.submitScore();
      this.highscore.update();
      return;
    }

    if (this.ctx) {
      this.clearCanvas();
      this.drawSnake();
      this.drawBackground();
      this.drawSnake();
      this.drawFood();
    }

    this.food.forEach((f, index) => {
      if (this.snake[0].x === f.x && this.snake[0].y === f.y) {
        this.eatFood(index);
      }
    });

    if (this.food.length === 0) {
      this.spawnFood();
    }

    setTimeout(() => requestAnimationFrame(() => this.updateGame()), 300 / (this.difficulty));
 
  }


  moveSnake(): void {
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
  clearCanvas(): void {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    }
  }
  drawSnake(): void {
    if (!this.ctx) return;
    const head = this.snake[0];
    this.ctx!.save();
    this.ctx!.translate(
      (head.x * this.tileSize) + this.offsetX + this.tileSize / 2,
      (head.y * this.tileSize) + this.offsetY + this.tileSize / 2
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

    this.ctx!.drawImage(this.snakeHeadImage, -this.tileSize / 2, -this.tileSize / 2, this.tileSize, this.tileSize);
    this.ctx!.restore();

    this.ctx.fillStyle = '#32CD32'; 
    this.snake.slice(1).forEach((part, index) => {
      this.ctx!.beginPath();
      this.ctx!.arc(
        part.x * this.tileSize + this.tileSize / 2,
        part.y * this.tileSize + this.tileSize / 2,
        this.tileSize / 2 - 2,
        0,
        Math.PI * 2
      );
      this.ctx!.fill();
      this.ctx!.closePath();
    });
  }

  drawFood(): void {
    if (this.ctx) {
      this.food.forEach(f => {
        this.ctx!.drawImage(this.chiliImage, f.x * this.tileSize, f.y * this.tileSize, this.tileSize, this.tileSize);
      });
    }

  }

  @HostListener('window:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent): void {
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
  changeDifficulty(newDifficulty: number): void {
    this.difficulty = newDifficulty;
    this.resetGame();
    this.initGame();
  }
}

