import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  private fb = inject(FormBuilder);
  private router = inject(Router);

  /**
   * Hold flag for form submittion
   */
  submitted = signal<boolean>(false);

  /**
   * Login form initialization
   */
  loginform: FormGroup = this.fb.group({
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /**
   * Handle login
   */
  login(): void {
    if (this.loginform.valid) {
      this.userService.getUser(this.loginform.value.email).subscribe((res:User[]) => {
        const email = this.loginform.value.email;
        const password = this.loginform.value.password;
        const data = res[0];
        if (data.email === email && data.password === password) {
          localStorage.setItem('user', JSON.stringify(res[0]));
          this.router.navigate(['/home']);
          this.authService.$user.next(true);
        } else {
          console.log('wrong credential');
          this.loginform.markAllAsTouched();
          this.submitted.set(true);
        }
      });
    }
  }
}
