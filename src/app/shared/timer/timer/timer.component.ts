import { Component, EventEmitter, Input, Output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map, takeWhile, tap } from 'rxjs';

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css',
})
export class TimerComponent {
  @Input() timer: number = 0;
  @Output() remainingTime = new EventEmitter();

  timeLeft: string = this.timer.toString();
  private countdown$ = interval(1000).pipe(
    map((elapsedSeconds) => this.timer * 60 - elapsedSeconds),
    takeWhile((secondsLeft) => secondsLeft >= 0),
    map((secondsLeft) => this.formatTime(secondsLeft))
  );

  timer$ = toSignal(
    this.countdown$.pipe(
      tap((formatTime) => {
        this.timeLeft = formatTime;
      })
    )
  );

  private formatTime(seconds: number): string {
    // console.log(seconds)
    this.remainingTime.emit(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
