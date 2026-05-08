import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TodoListComponent } from '../../../components/todo-list/todo-list';
import { TodoServices } from '../../../services/todo';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateTodoComponent } from '../../../dialogs/dialog-create-todo/dialog-create-todo';
import { DialogSortingHeadingsComponent } from '../../../dialogs/dialog-sorting-headings/dialog-sorting-headings';
import { ImmoTodo } from '../../../models/todo';
import { DialogEditComponent } from '../../../dialogs/dialog-edit/dialog-edit';

@Component({
  selector: 'app-todo-page',
  imports: [TodoListComponent, NgFor, MatIconModule, NgIf, NgClass],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.scss',
})
export class TodoPageComponent {
  public todoService = inject(TodoServices);

  appsVisible = signal(false);

  constructor(public dialog: MatDialog) {}

  onAppsClick() {
    this.appsVisible.set(!this.appsVisible());
  }

  onAddsClick() {
    this.dialog.open(DialogCreateTodoComponent);
  }

  onSortClick() {
    if (this.todoService.headings().length >= 2) {
      this.dialog.open(DialogSortingHeadingsComponent);
    }
  }

  // function for output changeCheckItem
  updateTodoCheck(item: ImmoTodo) {
    this.todoService.updatetodo(item.id, { checked: item.checked });
  }
  // function for output editHeadingEvent
  editHeading(headinName: string) {
    const dialogRef = this.dialog.open(DialogEditComponent);
    dialogRef.componentRef?.setInput('isHeading', true);
    dialogRef.componentRef?.setInput('oldNameHeading', headinName);
  }
  // function for output deleteHeadingEvent
  deleteHeading(heading: string) {
    this.todoService.deleteHeading(heading);
  }

  // function for output editTodoEvent
  editTodo(todo: ImmoTodo) {
    const dialogRef = this.dialog.open(DialogEditComponent);
    dialogRef.componentRef?.setInput('isHeading', false);
    dialogRef.componentRef?.setInput('oldTodo', todo);
  }

  // function for output deleteTodoEvent
  deleteTodo(todo: ImmoTodo) {
    this.todoService.deleteTodo(todo);
  }
}
