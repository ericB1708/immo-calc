import { NgFor } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ImmoTodo } from '../../models/todo';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { TodoServices } from '../../services/todo';

@Component({
  selector: 'app-todo-list',
  imports: [NgFor, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoListComponent {
  @Input() heading: string = '';
  @Input() todos: ImmoTodo[] = [];
  @Output() changeCheckItem = new EventEmitter<ImmoTodo>();
  @Output() editTodoEvent = new EventEmitter<ImmoTodo>();
  @Output() deleteTodoEvent = new EventEmitter<ImmoTodo>();
  @Output() editHeadingEvent = new EventEmitter<string>();
  @Output() deleteHeadingEvent = new EventEmitter<string>();

  onCheckboxChange(event: Event, item: ImmoTodo) {
    const target = event.target as HTMLInputElement;
    item.checked = target.checked;
    this.changeCheckItem.emit(item);
  }

  onEditHeading() {
    this.editHeadingEvent.emit(this.heading);
  }
  onDeleteHeading() {
    this.deleteHeadingEvent.emit(this.heading);
  }
  onEditTodo(todo: ImmoTodo) {
    this.editTodoEvent.emit(todo);
  }
  onDeleteTodo(todo: ImmoTodo) {
    this.deleteTodoEvent.emit(todo);
  }
}
