import { NgClass, NgIf, UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pinned-item',
  imports: [MatIconModule, NgIf, NgClass, UpperCasePipe],
  templateUrl: './pinned-item.html',
  styleUrl: './pinned-item.scss',
})
export class PinnedItem {
  @Input() pinnedName!: string;
  @Input() name!: string;
  @Input() subText: string = '';
  @Input() value!: number | null;
  @Input() unit: string = '€';

  @Input() showCircle: boolean = false;

  @Input() circleColor: 'green' | 'yellow' | 'red' | '' = '';
  @Input() showPlus: boolean = false;

  @Output() newItemEvent = new EventEmitter<string>();

  unpinItem() {
    this.newItemEvent.emit(this.pinnedName);
  }

  get formattedValue(): string {
    if (this.value === null) return '-';

    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(this.value);
  }
}
