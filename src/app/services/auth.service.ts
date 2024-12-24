import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Roles } from '../modules/user/models/roles.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  

  $user = new BehaviorSubject<boolean>(false);
  private user: any = null;

  getUserFromLocal(): any {
    return this.user || JSON.parse(localStorage.getItem('user') || 'null');
  }

  getRole(): Roles | null {
    return this.getUserFromLocal()?.role || null;
  }
}
