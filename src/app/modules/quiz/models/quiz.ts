export interface Options {
  isCorrect: boolean;
  text: string;
}
export interface Questions {
  questionType: string;
  questionText: string;
  options: Options[];
  answer: string;
}
export interface Timer {
  hour: number;
  minute: number;
}
export interface Quiz {
  id: string;
  quizTitle:string,
  questions: Questions[];
  quizDescription: string;
  quizTimer: Timer;
}
