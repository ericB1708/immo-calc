import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImmoTodo } from '../../models/todo';

@Component({
  selector: 'app-todo-list',
  imports: [NgFor],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoListComponent {
  @Input() heading: string = '';
  @Input() todos: ImmoTodo[] = [];
  @Output() isCheckedChange = new EventEmitter<boolean>();

  onCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isCheckedChange.emit(target.checked);
  }
}
