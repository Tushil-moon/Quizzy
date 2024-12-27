import { inject, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { QuizService } from '../../../services/quiz.service';
import { loadQuiz, loadQuizSuccess, loadQuizFailure } from './quiz.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class QuizEffects {
  private actions$ = inject(Actions)
  private quizService = inject(QuizService);

  /**
   * 
   */
  loadQuiz$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadQuiz),
      mergeMap(({ id }) =>
        this.quizService.getQuizById(id).pipe(
          map((quizData) => {
            console.log(quizData)
            return loadQuizSuccess({ quizData: quizData[0] })}),
          catchError((error) => of(loadQuizFailure({ error: error.message })))
        )
      )
    )
  );
}
