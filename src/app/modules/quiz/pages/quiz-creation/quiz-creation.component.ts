import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, tap } from 'rxjs';
import { QuizService } from '../../../../services/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-creation',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './quiz-creation.component.html',
  styleUrls: ['./quiz-creation.component.css'],
})
export class QuizCreationComponent {
  private fb = inject(FormBuilder);
  private quizService = inject(QuizService);
  private router = inject(Router);

  /**
   *  From submittion flag
   */
  submitted = signal<boolean>(false);

  /**
   * Observer hold the initial value
   */
  $initalize_ = new BehaviorSubject<boolean>(false);

  /**
   * Initialize form
   */
  quizForm: FormGroup = this.fb.group({
    quizTitle: ['', Validators.required],
    quizDescription: ['', Validators.required],
    quizTimer: this.fb.group({
      hour: ['', Validators.required],
      minute: ['', Validators.required],
    }),
    questions: this.fb.array([]),
  });

  /**
   * Initial queation add
   */
  initialQuestion = toSignal(
    this.$initalize_.pipe(tap(() => this.addQuestion()))
  );

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }
  get options(): FormArray {
    return this.questions.get('options') as FormArray;
  }

  /**
   * Use for getting controls of options
   *
   * @param index question index
   * @returns Controls array
   */
  getOptions(index: number): FormArray {
    return this.questions.at(index).get('options') as FormArray;
  }

  /**
   * Use for add more questions
   */
  addQuestion(): void {
    this.questions.push(
      this.fb.group({
        questionText: ['', Validators.required],
        questionType: ['multiple-choice', Validators.required],
        options: this.fb.array([]),
        answer: [''],
      })
    );
    console.log(this.questions.length);
    this.onTypeChange({ value: 'multiple-choice' }, this.questions.length - 1);
  }

  /**
   * Use for add options
   */
  addOption(): void {
    const question = this.questions.at(this.questions.length - 1);
    const options = question.get('options') as FormArray;
    for (let i = 0; i < 4; i++) {
      options.push(
        this.fb.group({
          text: ['', Validators.required],
          isCorrect: [false, Validators.required],
        })
      );
    }
  }

  /**
   * Use for Remove a question from the FormArray
   *
   * @param index question index
   */
  removeQuestion(index: number) {
    if (this.questions.length > 1) {
      this.questions.removeAt(index);
    } else {
      alert('At least one question is required.');
    }
  }

  /**
   * Check the question type for conditional rendering
   *
   * @param questionIndex question index
   * @returns controls
   */
  isMultipleChoice(questionIndex: number): boolean {
    const question = this.questions.at(questionIndex);
    return question.get('questionType')?.value === 'multiple-choice';
  }

  /**
   * Check the question type for conditional rendering
   *
   * @param questionIndex question index
   * @returns controls
   */
  isTrueFalse(questionIndex: number): boolean {
    const question = this.questions.at(questionIndex);
    return question.get('questionType')?.value === 'true-false';
  }

  /**
   * Check the question type for conditional rendering
   *
   * @param questionIndex question index
   * @returns controls
   */
  isShortAnswer(questionIndex: number): boolean {
    const question = this.questions.at(questionIndex);
    return question.get('questionType')?.value === 'short-answer';
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.quizForm.valid) {
      console.log('Form Data:', this.quizForm.value);
      const quiz = this.quizForm.value;
      this.quizService.addQuiz(quiz).subscribe(() => {
        console.log('quiz added successfully');
        this.quizForm.reset;
        this.router.navigate(['home']);
      });
    } else {
      console.log('Form Data:', this.quizForm.value);
      console.error('Form is invalid');
      this.submitted.set(true);
      this.quizForm.markAllAsTouched();
    }
  }

  /**
   * Handle question type change
   *
   * @param event option select event
   * @param questionIndex question index
   */
  onTypeChange(event?: any, questionIndex?: number): void {
    const selectedType = event.value;
    const question = this.questions.at(questionIndex!);
    const options = question.get('options') as FormArray;
    options.clear();
    if (selectedType === 'multiple-choice') {
      this.addOption();
      question.get('answer')?.setValidators(null);
      question.get('options')?.setValidators(this.optionValidator());
    } else {
      options.reset();
      question.get('options')?.setValidators(null);
      question.get('answer')?.setValidators(Validators.required);
    }

    question.get('answer')?.updateValueAndValidity();
    question.get('options')?.updateValueAndValidity();
  }

  /**
   * Handle option validation
   *
   * @returns validator function
   */
  optionValidator(): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      const controls = (formArray as FormArray).controls;

      const allTextsFilled = controls.every((control) =>
        control.get('text')?.value.trim()
      );

      const oneCorrect = controls.some(
        (control) => control.get('isCorrect')?.value === true
      );

      if (!allTextsFilled) {
        return { allTextsRequired: true };
      }

      if (!oneCorrect) {
        return { oneCorrectRequired: true };
      }

      return null;
    };
  }
}
