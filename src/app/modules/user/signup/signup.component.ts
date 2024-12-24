import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  submitted = signal<boolean>(false);

  signupform: FormGroup = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['User'],
  });

  signup(): void {
    if (this.signupform.valid) {
      this.userService.addUser(this.signupform.value).subscribe(() => {
        console.log('Signup successfully!');
        this.router.navigate(['/login']);
      });
    } else {
      this.signupform.markAllAsTouched();
      this.submitted.set(true);
    }
  }
}
