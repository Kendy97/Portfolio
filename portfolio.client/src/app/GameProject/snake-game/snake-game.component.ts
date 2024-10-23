import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../service/sweet-alert.service';


@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './snake-game.component.html',
  styleUrl: './snake-game.component.css'
})
export class SnakeGameComponent implements OnInit {
  canvas: HTMLCanvasElement | null = null; 
  ctx: CanvasRenderingContext2D | null = null; 
  snake: any[] = [{ x: 10, y: 10 }];
  food: any[] = [];
  gridSize = 20;
  tileSize = 20;
  velocity = { x: 0, y: 0 };
  gameOver = false;
  score = 0;
  difficulty = 1;
  numberOfFoods = 2;
  countdown: number = 3;
  isCountingDown: boolean = false;
  username: string = '';


  constructor(private alertService: AlertService) { }

  ngOnInit(): void {

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

  updateGame(): void {
    if (this.gameOver) return;

    this.moveSnake();

    if (this.isCollision()) {
      this.gameOver = true;
      if (this.score >= 100) {

        this.alertService.showSuccess('Gratulacje',' Twój wynik to: ' + this.score);
      }
      else {

        this.alertService.showSuccess('Spróbuj ponownie!', 'Twój wynik to: ' + this.score);
      }
      
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


    if (this.food.length === 0) {
      this.spawnFood();
    }

    setTimeout(() => this.updateGame(), 200 / this.difficulty);
  }

  moveSnake(): void {
    const head = { x: this.snake[0].x + this.velocity.x, y: this.snake[0].y + this.velocity.y };
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

    this.score += 10 * (this.difficulty === 10 ? 20 : this.difficulty);
    this.snake.push({}); 
    this.food.splice(index, 1); 
  }
  clearCanvas(): void {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    }
  }
  drawSnake(): void {
    if (this.ctx) {
      this.ctx.fillStyle = 'green';
      for (let part of this.snake) {

        this.ctx.beginPath();
        this.ctx.arc(
          part.x * this.tileSize + this.tileSize / 2, 
          part.y * this.tileSize + this.tileSize / 2, 
          this.tileSize / 2, 
          0, 
          Math.PI * 2 
        );
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
  }
  drawFood(): void {
    if (this.ctx) {
      this.ctx.fillStyle = 'red';
      this.food.forEach(f => {
        this.ctx!.fillRect(f.x * this.tileSize, f.y * this.tileSize, this.tileSize, this.tileSize);
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
  }
}
