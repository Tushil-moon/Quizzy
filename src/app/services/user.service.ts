import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  /**
   * 
   */
  private readonly apiUrl = 'http://192.168.1.177:3000/user';

  /**
   *
   * @param email
   * @returns
   */
  getUser(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?email=${email}`);
  }

  /**
   *
   * @param data
   * @returns
   */
  addUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data);
  }
}
