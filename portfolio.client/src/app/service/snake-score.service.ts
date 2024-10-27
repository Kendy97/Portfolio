import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SnakeScore {
  username: string;
  score: number;
  timePlay: number;
  difficulty: number;
  extraFoodScore: number;
  bonusAmount: number;
  bonusScore: number;
}
export interface GetSnakeScore {
  user: string;
  score: number;
  difficult: number;
  date: Date;
}
@Injectable({
  providedIn: 'root'
})
export class SnakeScoreService {

  private apiUrl = 'api/snakescore/'; 

  constructor(private http: HttpClient) { }


  addScore(score: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}addScore`, score);
  }

  getScores(): Observable<GetSnakeScore[]> {
    return this.http.get<GetSnakeScore[]>(`${this.apiUrl}getScores`);
  }

}
