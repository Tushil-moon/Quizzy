import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements OnInit {
  @Input() timer: number = 0;
  @Output() remainingTime = new EventEmitter<number>();

  /**
   * Hold left time
   */
  timeLeft = signal<string>('00:00');

  ngOnInit(): void {
    let totalSeconds = this.timer * 60;
    this.timeLeft.set(this.formatTime(totalSeconds));
    const intervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--;
        this.timeLeft.set(this.formatTime(totalSeconds));
        this.remainingTime.emit(totalSeconds);
      } else {
        clearInterval(intervalId);
      }
    }, 1000);
  }

  /**
   * Handle foramte timer
   *
   * @param seconds timer second
   * @returns Formatted timer in string
   */
  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }

  /**
   * handle padding in timer
   * @param value timer data
   * @returns paddedzero
   */
  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
