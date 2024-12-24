import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz } from '../modules/quiz/models/quiz';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://192.168.1.177:3000/quiz';

  getQuiz(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}`);
  }

  getQuizById(id: string): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}?id=${id}`);
  }

  addQuiz(data: Quiz): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data);
  }
}
