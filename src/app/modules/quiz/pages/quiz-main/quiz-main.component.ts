import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, tap } from 'rxjs';
import { Options, Result } from '../../models/quiz';
import { TimerComponent } from '../../components/timer/timer.component';
import { FormsModule } from '@angular/forms';
import { QuizState } from '../../store/quiz.state';
import { Store } from '@ngrx/store';
import * as QuizActions from '../../store/quiz.actions';

@Component({
  selector: 'app-quiz-main',
  imports: [CommonModule, TimerComponent, FormsModule],
  templateUrl: './quiz-main.component.html',
  styleUrl: './quiz-main.component.css',
})
export class QuizMainComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store<QuizState>);

  /**
   * Selector for quiz data
   */
  quizData$ = this.store.select((state) => state.quiz);

  /**
   * Inital quizstate
   */
  quizState: QuizState | null = null;

  /**
   * Handle the F5 key prevantion
   *
   * @param event
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'F5') {
      event.preventDefault();
      console.log('F5 key press prevented.');
    } else if (event.ctrlKey && event.key.toLowerCase() === 'r') {
      event.preventDefault();
      console.log('Ctrl+R key press prevented.');
    }
  }

  /**
   * Handling the page reload prevention
   * @param event
   */
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification(event: Event): void {
    event.preventDefault();
    event.returnValue = false;
  }

  /**
   * Get id from activated router and dispatch to store
   */
  getQuiz = toSignal(
    this.route.paramMap.pipe(
      filter((params) => !!params.get('id')),
      tap((params) => {
        const id = params.get('id')!;
        if (id) {
          this.store.dispatch(QuizActions.loadQuiz({ id }));
        }
      })
    )
  );

  /**
   * Get quiz data from store and display
   */
  quizzy = toSignal(
    this.quizData$.pipe(
      tap((res: QuizState) => {
        if (res.quizData !== null) {
          this.quizState = res;
          console.log(res)
        }
      })
    )
  );

  /**
   * Navigate to the previous question
   */
  prevQuestion(): void {
    this.store.dispatch(QuizActions.navigateQuestion({ direction: 'prev' }));
  }

  /**
   * Navigate to the next question
   */
  nextQuestion(): void {
    this.store.dispatch(QuizActions.navigateQuestion({ direction: 'next' }));
  }

  /**
   * Handle navigate to home
   */
  backtoHome(): void {
    this.store.dispatch(QuizActions.resetQuiz());
    this.router.navigate(['/home']);
    localStorage.removeItem('quizState');
  }

  /**
   *Handle remaining time dispatch to store
   *
   * @param time remaining time
   */
  remainingTimer(time: number): void {
    this.store.dispatch(QuizActions.updateTime({ remainingTime: time }));
    if (time === 0) {
      this.store.dispatch(QuizActions.quizDone());
    }
  }

  /**
   * handle quiz pause
   */
  onPause(): void {
    this.store.dispatch(QuizActions.pauseQuiz());
  }

  /**
   * handle quiz resume
   */
  onResume(): void {
    this.store.dispatch(QuizActions.resumeQuiz());
  }

  /**
   * Handle answer dispatch to store
   *
   * @param selectedAnswer selected answer data
   * @param correctAnswer correct answer data
   */
  checkAnswer(
    selectedAnswer: number | boolean | string,
    correctAnswer?: Options | string | boolean
  ): void {
    console.log(correctAnswer)
    this.store.dispatch(
      QuizActions.answerQuestion({ selectedAnswer, correctAnswer })
    );
  }

  /**
   * Handle submittion dispatch to store
   */
  onSubmit(): void {
    this.store.dispatch(QuizActions.quizDone());
  }

  /**
   * Handle formating timee
   *
   * @param time time
   * @returns return string of timer
   */
  formateTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }

  /**
   * Handle pad zero for better dispplay
   *
   * @param value timer data
   * @returns string of digit
   */
  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  /**
   * Handle Area of improvement in result screen
   */
  areaOfImprovement(): Result[] {
    const resultMap = this.quizState!.selectedAnswers.reduce(
      (acc, que) => {
        const type = que.questionType.questionType;
        acc.attempted[type] = (acc.attempted[type] || 0) + 1;
        if (que.isCorrect) {
          acc.correct[type] = (acc.correct[type] || 0) + 1;
        }
        return acc;
      },
      { attempted: {}, correct: {} } as {
        attempted: { [key: string]: number };
        correct: { [key: string]: number };
      }
    );

    return Object.keys(resultMap.attempted).map((type) => {
      const attemptedCount = resultMap.attempted[type];
      const correctCount = resultMap.correct[type] || 0;
      const percentage = (correctCount / attemptedCount) * 100;
      console.log({
        type,
        attempted: attemptedCount,
        correct: correctCount,
        percentage: parseFloat(percentage.toFixed(2)),
      });
      return {
        type,
        attempted: attemptedCount,
        correct: correctCount,
        percentage: parseFloat(percentage.toFixed(2)),
      };
    });
  }
}
