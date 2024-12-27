import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { quizReducer } from './modules/quiz/store/quiz.reducer';
import { provideEffects } from '@ngrx/effects';
import { QuizEffects } from './modules/quiz/store/quiz.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ quiz: quizReducer }),
    provideEffects([QuizEffects]),
  ],
};
