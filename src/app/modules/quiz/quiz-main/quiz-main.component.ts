import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../../services/quiz.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap, tap } from 'rxjs';
import { Questions, Quiz } from '../models/quiz';
import { TimerComponent } from '../../../shared/timer/timer/timer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz-main',
  imports: [CommonModule, TimerComponent, FormsModule],
  templateUrl: './quiz-main.component.html',
  styleUrl: './quiz-main.component.css',
})
export class QuizMainComponent {
  private quizService = inject(QuizService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  correctQue = signal<any[]>([]);
  currentQuestionIndex = signal<number>(0);
  currentScore = signal<number>(0);
  questions = signal<Questions[]>([]);
  quizData = signal<Quiz | null>(null);
  quizTime = signal<number>(0);
  remainingQuestion = signal<number>(0);
  selectedAnswers: any[] = [];
  remainingTime = signal<number>(0);
  isPaused = signal<boolean>(false);

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'F5') {
      event.preventDefault();
      console.log('F5 key press prevented.');
    }
  }

  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification(event: Event): void {
  //   event.preventDefault();
  // }

  getQuiz = toSignal(
    this.route.paramMap.pipe(
      filter((params) => !!params.get('id')),
      switchMap((params) => this.quizService.getQuizById(params.get('id')!)),
      tap((res: Quiz[]) => {
        if (res.length > 0) {
          this.quizData.set(res[0]);
          this.questions.set(res[0].questions);
          this.remainingQuestion.set(res[0].questions.length);
          this.quizTime.set(res[0].quizTimer.minute!);
          console.log(this.quizData(), this.quizTime());
          const quizState = localStorage.getItem('quizState');
          if (quizState) {
            this.selectedAnswers = JSON.parse(quizState);
          }
        } else {
          this.router.navigate(['/home']);
        }
      })
    )
  );

  // Navigate to the previous question
  prevQuestion(): void {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.set(this.currentQuestionIndex() - 1);
    }
    console.log(this.selectedAnswers[this.currentQuestionIndex()]);
  }

  // Navigate to the next question
  nextQuestion(): void {
    if (this.currentQuestionIndex() < this.questions().length - 1) {
      this.currentQuestionIndex.set(this.currentQuestionIndex() + 1);
    }
    console.log(this.selectedAnswers[this.currentQuestionIndex()]);
  }

  backtoHome(): void {
    this.router.navigate(['/home']);
    this.quizData.set(null);
    localStorage.removeItem('quizState');
  }

  remainingTimer(time: number): void {
    this.remainingTime.set(time);
    localStorage.setItem('remainingTime', JSON.stringify(time));
  }

  onPause(): void {
    this.isPaused.set(true);
  }

  onResume(): void {
    this.isPaused.set(false);
    this.quizTime.set(this.remainingTime() / 60);
  }

  formateTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  checkAnswer(i?: number, e?: any): void {
    console.log(e);
    this.remainingQuestion.set(this.remainingQuestion() - 1);

    const currentQuestion = this.questions()[this.currentQuestionIndex()];
    const questionType = currentQuestion.questionType;

    if (questionType === 'multiple-choice') {
      const correctAnswerIndex = currentQuestion.options.findIndex(
        (option) => option.isCorrect === true
      );
      if (currentQuestion.options[i!].isCorrect) {
        this.selectedAnswers[this.currentQuestionIndex()] = {
          answer: true,
          optionIndex: i,
        };
        localStorage.setItem('quizState', JSON.stringify(this.selectedAnswers));
        this.currentScore.set(this.currentScore() + 1);
      } else {
        this.selectedAnswers[this.currentQuestionIndex()] = {
          correctAnswerIndex: correctAnswerIndex,
          answer: false,
          optionIndex: i,
        };
        localStorage.setItem('quizState', JSON.stringify(this.selectedAnswers));
      }
    } else if (questionType === 'true-false') {
      const selectedAnswer = e;
      const correctAnswer = currentQuestion.answer;
      console.log(selectedAnswer, correctAnswer);
      if (selectedAnswer === correctAnswer) {
        this.selectedAnswers[this.currentQuestionIndex()] = {
          answer: selectedAnswer,
          isCorrect: true,
        };
        localStorage.setItem('quizState', JSON.stringify(this.selectedAnswers));
        this.currentScore.set(this.currentScore() + 1);
      } else {
        this.selectedAnswers[this.currentQuestionIndex()] = {
          answer: selectedAnswer,
          isCorrect: false,
          correctAnswer: currentQuestion.answer,
        };
        localStorage.setItem('quizState', JSON.stringify(this.selectedAnswers));
      }
    } else if (questionType === 'short-answer') {
      const userAnswer = e.target.value.trim().toLowerCase();
      const correctAnswer = currentQuestion.answer.trim().toLowerCase();
      if (userAnswer === correctAnswer) {
        this.selectedAnswers[this.currentQuestionIndex()] = {
          answer: userAnswer,
          isCorrect: true,
        };
        localStorage.setItem('quizState', JSON.stringify(this.selectedAnswers));
        this.currentScore.set(this.currentScore() + 1);
      } else {
        this.selectedAnswers[this.currentQuestionIndex()] = {
          answer: userAnswer,
          isCorrect: false,
          correctAnswer: currentQuestion.answer,
        };
        localStorage.setItem('quizState', JSON.stringify(this.selectedAnswers));
      }
    }

    console.log(this.selectedAnswers);
  }
}
