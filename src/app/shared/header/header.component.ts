import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { tap } from 'rxjs';
import { User } from '../../modules/user/models/user';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  /**
   * hold user data
   */
  user = signal<User | null>(null);

  /**
   * hold user role
   * 
   */
  role = signal<string | null>(null);

  /**
   * Handle user data fetch
   */
  getUser = toSignal(
    this.auth.$user.pipe(
      tap(() => {
        const user = this.auth.getUserFromLocal();
        this.user.set(user!);
      })
    )
  );

  /**
   * Handle navigation on login
   */
  gotologin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * handle navigation for quiz creation page
   */
  createQuiz(): void {
    this.router.navigate(['/quiz-create']);
  }

  /**
   * Handle logout
   */
  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/home']);
    this.auth.$user.next(true);
  }
}
