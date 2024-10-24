import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input,OnInit } from '@angular/core';
import { SnakeScore, SnakeScoreService } from '../../service/snake-score.service';
export interface GetSnakeScore {
  user: string;
  score: number;
  difficult: number;
  date: Date;
}

@Component({
  selector: 'app-high-score',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './high-score.component.html',
  styleUrl: './high-score.component.css',
  providers: [SnakeScoreService]
})
export class HighScoreComponent  {
   scores: GetSnakeScore[] =[];
  
  constructor(private snakeScoreService: SnakeScoreService) { }

  ngOnInit(): void {
    this.snakeScoreService.getScores().subscribe(
      (data) => this.scores = data,
      (error) => console.error('Error fetching scores', error)
    );
  }

  update() {
    this.snakeScoreService.getScores().subscribe(
      (data) => this.scores = data,
      (error) => console.error('Error fetching scores', error)
    );
  }


}
