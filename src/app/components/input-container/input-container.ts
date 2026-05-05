import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-container',
  imports: [],
  templateUrl: './input-container.html',
  styleUrl: './input-container.scss',
})
export class InputContainerComponent {
  @Input() inputName!: string;
  @Input() inputType!: string;
  @Input() value!: number | null;
  @Input() placeHolderValue: number = 0;
  @Input() higlightTitle: boolean = false;

  @Output() valueChange = new EventEmitter<number | null>();

  onInputChanges(event: Event) {
    const inputField = event.target as HTMLInputElement;
    const rawTextValue = inputField.value;

    if (rawTextValue === '') {
      this.valueChange.emit(null);
      return;
    }

    let newNumberValue = Number(rawTextValue);

    if (newNumberValue < 0) {
      newNumberValue = 0;
      inputField.value = '0';
    }

    this.valueChange.emit(newNumberValue);
  }
}
