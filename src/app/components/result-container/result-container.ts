import { NgIf, NgClass, UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-result-container',
  imports: [MatIconModule, NgIf, NgClass, UpperCasePipe],
  templateUrl: './result-container.html',
  styleUrl: './result-container.scss',
})
export class ResultContainerComponent {
  @Input() name!: string;
  @Input() subText: string = '';
  @Input() value!: number | null;
  @Input() unit: string = '€';

  @Input() showCircle: boolean = false;
  @Input() isPinnable: boolean = false;

  @Input() circleColor: 'green' | 'yellow' | 'red' | '' = '';

  @Input() isPinned: boolean = false;
  @Input() showPlus: boolean = false;

  @Output() pinned = new EventEmitter<boolean>();

  get formattedValue(): string {
    if (this.value === null) return '-';

    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(this.value);
  }

  onPinnedClick() {
    this.pinned.emit(!this.isPinned);
  }
}
