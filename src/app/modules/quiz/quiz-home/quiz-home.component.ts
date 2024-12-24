import { Component, inject, signal } from '@angular/core';
import { QuizService } from '../../../services/quiz.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { Quiz } from '../models/quiz';

@Component({
  selector: 'app-quiz-home',
  imports: [],
  templateUrl: './quiz-home.component.html',
  styleUrl: './quiz-home.component.css',
})
export class QuizHomeComponent {
  private quizService = inject(QuizService);
  private router = inject(Router);

  /**
   *
   */
  quizes = signal<Quiz[]>([]);

  /**
   *
   */
  getQuizes = toSignal(
    this.quizService.getQuiz().pipe(
      tap((res: Quiz[]) => {
        this.quizes.set(res);
        console.log(this.quizes());
      })
    )
  );

  /**
   * 
   * @param id Quiz id
   */
  play(id: string): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.router.navigate(['/playground', id]);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
