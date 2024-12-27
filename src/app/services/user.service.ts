import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Signup, User } from '../modules/user/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  /**
   * Actuall api to perform every request
   */
  private readonly apiUrl = 'http://192.168.1.177:3000/user';

  /**
   * Find user details
   *
   * @param email user email
   * @returns user object
   */
  getUser(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`);
  }

  /**
   * Handle user signup
   *
   * @param data user raw data
   */
  addUser(data: Signup): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, data);
  }
}
