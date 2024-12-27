import { Routes } from '@angular/router';
import { LoginComponent } from './modules/user/pages/login/login.component';
import { QuizHomeComponent } from './modules/quiz/pages/quiz-home/quiz-home.component';
import { SignupComponent } from './modules/user/pages/signup/signup.component';
import { QuizCreationComponent } from './modules/quiz/pages/quiz-creation/quiz-creation.component';
import { QuizMainComponent } from './modules/quiz/pages/quiz-main/quiz-main.component';
import { authGuard } from './guards/auth/auth.guard';
import { roleGuard } from './guards/role/role.guard';
import { Roles } from './modules/user/models/roles.enum';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: QuizHomeComponent },
  {
    path: 'quiz-create',
    component: QuizCreationComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: Roles.Admin },
  },
  {
    path: 'playground/:id',
    component: QuizMainComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
