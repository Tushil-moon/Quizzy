import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter, tap } from 'rxjs';
import { QuizState } from '../../modules/quiz/store/quiz.state';
import { toSignal } from '@angular/core/rxjs-interop';
import * as QuizActions from '../../modules/quiz/store/quiz.actions';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private store = inject(Store<QuizState>);

  /**
   *
   */
  quizData$ = this.store.select((state) => state.quiz);
  timer = new BehaviorSubject<number>(0);
  startTimer$ = new BehaviorSubject<boolean>(false);
  timeLeft = new BehaviorSubject<string>('00:00');

  timer$ = toSignal(
    this.startTimer$.pipe(
      filter((start) => !!start),
      tap(() => {
        let totalSeconds = this.timer.value * 60;
        this.timeLeft.next(this.formatTime(totalSeconds));
        this.store.dispatch(QuizActions.quizDone());
        console.log('serv', totalSeconds);
        const intervalId = setInterval(() => {
          if (totalSeconds > 0) {
            totalSeconds--;
            this.timeLeft.next(this.formatTime(totalSeconds));
            this.store.dispatch(QuizActions.quizDone());
            console.log(totalSeconds);
          } else {
            clearInterval(intervalId);
          }
        }, 1000);
      })
    )
  );

  /**
   *
   * @param seconds
   * @returns
   */
  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }

  /**
   *
   * @param value
   * @returns
   */
  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
