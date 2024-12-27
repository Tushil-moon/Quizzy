import { createAction, props } from '@ngrx/store';
import { Quiz } from '../models/quiz';

export const loadQuiz = createAction('[Quiz] Load Quiz', props<{ id: string }>());
export const loadQuizSuccess = createAction('[Quiz] Load Quiz Success', props<{ quizData: Quiz }>());
export const loadQuizFailure = createAction('[Quiz] Load Quiz Failure', props<{ error: string }>());
export const remainingQuestion = createAction('[Quiz] Remaining Question',props<{ remainingQuestion:number }>());
export const answerQuestion = createAction('[Quiz] Answer Question', props<{ selectedAnswer:any, correctAnswer:any }>());
export const scoreUpdate = createAction('[Quiz] Update Score',props<{currentScore:number}>())
export const updateTime = createAction('[Quiz] Update Time', props<{ remainingTime: number }>());
export const pauseQuiz = createAction('[Quiz] Pause Quiz');
export const resumeQuiz = createAction('[Quiz] Resume Quiz');
export const navigateQuestion = createAction('[Quiz] Navigate Question', props<{ direction: 'next' | 'prev' }>());
export const quizDone = createAction('[Quiz] Quiz is done');
export const resetQuiz = createAction('[Quiz] Reset Quiz');
