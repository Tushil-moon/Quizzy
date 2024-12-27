import { Questions, Quiz, selectedAnswers } from '../models/quiz';

export interface QuizState {
  quizData: Quiz | null;
  questions: Questions[];
  currentQue: Questions | null;
  currentQuestionIndex: number;
  remainingQuestion: number;
  selectedAnswers: selectedAnswers[];
  currentScore: number;
  quizTime: number;
  remainingTime: number | null;
  isPaused: boolean;
  quizDone:boolean;
  quizDoneTime:number
}

export const initialQuizState: QuizState = {
  quizData: null,
  questions: [],
  remainingQuestion: 0,
  currentQue: null,
  currentQuestionIndex: 0,
  selectedAnswers: [],
  currentScore: 0,
  quizTime: 0,
  remainingTime: null,
  isPaused: false,
  quizDone:false,
  quizDoneTime:0
};
