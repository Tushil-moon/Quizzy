import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { tap } from 'rxjs';
import { Roles } from '../../modules/user/models/roles.enum';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private router = inject(Router);
  private auth = inject(AuthService);
  user = signal<any>(null);
  role = signal<string | null>(null);
  
  getUser = toSignal(
    this.auth.$user.pipe(
      tap(() => {
        const user = this.auth.getUserFromLocal()
        this.user.set(user);
      })
    )
  );

  gotologin(): void {
    this.router.navigate(['/login']);
  }

  createQuiz(): void {
    this.router.navigate(['/quiz-create']);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/home']);
    this.auth.$user.next(true);
  }
}
