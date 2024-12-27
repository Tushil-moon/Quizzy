import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz } from '../modules/quiz/models/quiz';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private http = inject(HttpClient);

  /**
   * Actuall api to perform every request
   */
  private readonly apiUrl = 'http://192.168.1.177:3000/quiz';

  /**
   * Handle quiz fetch
   *
   * @returns quiz list
   */
  getQuiz(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}`);
  }

  /**
   * handle quiz fetch by id
   *
   * @param id quiz id
   * @returns quiz data
   */
  getQuizById(id: string): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}?id=${id}`);
  }

  /**
   *Handle quiz submitiion
   *
   * @param data quiz raw data
   */
  addQuiz(data: Quiz): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, data);
  }
}
