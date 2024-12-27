import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Roles } from '../modules/user/models/roles.enum';
import { User } from '../modules/user/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Hold user presence
   */
  $user = new BehaviorSubject<boolean>(false);

  /**
   * Hold user data
   */
  private user: User | null = null;

  /**
   * Get data from localstorage
   *
   * @returns return user data
   */
  getUserFromLocal(): User | null {
    return this.user || JSON.parse(localStorage.getItem('user') || 'null');
  }

  /**
   * Provide user role
   *
   * @returns user role
   */
  getRole(): Roles | null {
    return this.getUserFromLocal()?.role || null;
  }
}
