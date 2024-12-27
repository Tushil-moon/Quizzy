import { createReducer, on } from '@ngrx/store';
import { initialQuizState } from './quiz.state';
import * as QuizActions from './quiz.actions';
import { checkAnswer } from '../utils/quizAnswer.controller';

export const quizReducer = createReducer(
  initialQuizState,
  on(QuizActions.loadQuiz, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(QuizActions.loadQuizSuccess, (state, { quizData }) => ({
    ...state,
    quizData,
    questions: quizData.questions,
    currentQue: quizData.questions[state.currentQuestionIndex],
    remainingQuestion: quizData.questions.length,
    quizTime: quizData.quizTimer.minute || 0,
    loading: false,
  })),
  on(QuizActions.loadQuizFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(QuizActions.remainingQuestion, (state, { remainingQuestion }) => ({
    ...state,
    remainingQuestion: remainingQuestion,
    loading: false,
  })),
  on(QuizActions.answerQuestion, (state, { selectedAnswer, correctAnswer }) => {
    const updatedAnswers = [...state.selectedAnswers];
    
    updatedAnswers[state.currentQuestionIndex] = checkAnswer(
      state.currentQue!,
      selectedAnswer,
      correctAnswer
    );
    return {
      ...state,
      selectedAnswers: updatedAnswers,
      remainingQuestion: state.remainingQuestion - 1,
      currentScore:
        updatedAnswers[state.currentQuestionIndex].isCorrect === true
          ? state.currentScore + 1
          : state.currentScore,
    };
  }),
  on(QuizActions.scoreUpdate, (state, { currentScore }) => ({
    ...state,
    currentScore,
  })),
  on(QuizActions.updateTime, (state, { remainingTime }) => ({
    ...state,
    remainingTime,
  })),
  on(QuizActions.pauseQuiz, (state) => ({
    ...state,
    isPaused: true,
  })),
  on(QuizActions.resumeQuiz, (state) => ({
    ...state,
    isPaused: false,
    quizTime: state.remainingTime! / 60,
  })),
  on(QuizActions.navigateQuestion, (state, { direction }) => {
    const updatedIndex =
      direction === 'next'
        ? Math.min(state.currentQuestionIndex + 1, state.questions.length - 1)
        : Math.max(state.currentQuestionIndex - 1, 0);

    return {
      ...state,
      currentQuestionIndex: updatedIndex,
      currentQue: { ...state.questions[updatedIndex] },
    };
  }),
  on(QuizActions.quizDone, (state) => ({
    ...state,
    quizDone: true,
    quizDoneTime: state.quizTime * 60 - state.remainingTime!,
  })),
  on(QuizActions.resetQuiz, () => initialQuizState)
);
