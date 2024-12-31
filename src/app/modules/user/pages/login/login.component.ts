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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);

  /**
   * Hold flag for form submittion
   */
  submitted = signal<boolean>(false);

  /**
   * Login form initialization
   */
  loginform: FormGroup = this.fb.group({
    email: ['', [Validators.required,Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /**
   * Handle navigate to home
   */
  gotoHome(): void {
    this.router.navigate(['home']);
  }

  /**
   * Handle login
   */
  login(): void {
    if (this.loginform.valid) {
      const email = this.loginform.value.email;
      const password = this.loginform.value.password;
  
      // Block specific domains
      const domain = email.split('@')[1];
      if (['mailinator.com','fake.com','test.com'].includes(domain)) {
        alert('This domain is not allowed');
        return;
      }
  
      this.userService.getUser(email).subscribe((res: User[]) => {
        if (res && res.length) {
          const user = res[0];
          if (user.email === email && user.password === password) {
            localStorage.setItem('user', JSON.stringify(user));
            this.router.navigate(['/home']);
            this.authService.$user.next(true);
          } else {
            alert('Invalid credentials');
            this.loginform.markAllAsTouched();
            this.submitted.set(true);
          }
        } else {
          alert('User not found!');
        }
      }, error => {
        console.error('Error fetching user data', error);
        alert('Something went wrong. Please try again later.');
      });
    } else {
      this.loginform.markAllAsTouched();
      this.submitted.set(true);
    }
  }
}