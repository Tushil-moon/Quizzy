import { Component, inject, signal } from '@angular/core';
import { QuizService } from '../../../../services/quiz.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { Quiz } from '../../models/quiz';

@Component({
  selector: 'app-quiz-home',
  imports: [],
  templateUrl: './quiz-home.component.html',
  styleUrl: './quiz-home.component.css',
})
export class QuizHomeComponent {
  private quizService = inject(QuizService);
  private router = inject(Router);

  loading = signal<boolean>(true)

  /**
   * Store quiz list
   */
  quizes = signal<Quiz[]>([]);

  /**
   * Fetch wuiz data from quiz service
   */
  getQuizes = toSignal(
    this.quizService.getQuiz().pipe(
      tap((res: Quiz[]) => {
        this.quizes.set(res);
        this.loading.set(false)
        console.log(this.quizes());
      })
    )
  );

  /**
   * Handlle quiz play button
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
