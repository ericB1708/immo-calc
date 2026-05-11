import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-container',
  imports: [],
  templateUrl: './input-container.html',
  styleUrl: './input-container.scss',
})
export class InputContainerComponent {
  @Input() inputName!: string;
  //@Input() inputType!: string;
  @Input() value!: number | null;
  @Input() placeHolderValue: number = 0;
  @Input() higlightTitle: boolean = false;

  @Output() valueChange = new EventEmitter<number | null>();

  get displayValue(): string {
    if (this.value === null || this.value === undefined) return '';

    const isCurrencyOrPercent = this.inputName.includes('€') || this.inputName.includes('%');

    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: isCurrencyOrPercent ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(this.value);
  }

  onInputChanges(event: any) {
    let inputValue = event.target.value;

    inputValue = inputValue.replace(/\./g, '').replace(',', '.');

    const numericValue = parseFloat(inputValue);

    if (!isNaN(numericValue)) {
      this.valueChange.emit(numericValue);
    } else {
      this.valueChange.emit(0);
    }
  }
}
