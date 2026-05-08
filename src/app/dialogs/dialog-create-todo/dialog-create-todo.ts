import { NgIf, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TodoServices } from '../../services/todo';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-dialog-create-todo',
  imports: [
    FormsModule,
    NgIf,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    NgFor,
    MatSlideToggleModule,
  ],
  templateUrl: './dialog-create-todo.html',
  styleUrl: './dialog-create-todo.scss',
})
export class DialogCreateTodoComponent {
  public immoTodoService = inject(TodoServices);
  selectedOption: string =
    this.immoTodoService.headings().length >= 1 ? this.immoTodoService.headings()[0] : '';
  nameTodo: string = '';
  nameHeader: string = '';
  isHeading:boolean = false;

  todoCreateCorrect: boolean = true;

  constructor(public dialogRef: MatDialogRef<DialogCreateTodoComponent>) {}

  onClickCreateTodo() {
    if (this.immoTodoService.createImmoTodo(this.nameTodo, this.selectedOption)) {
      this.todoCreateCorrect = true;
      this.closeDialog();
    } else {
      this.todoCreateCorrect = false;
    }
  }

  onClickCreateHeader() {
    if (this.immoTodoService.createHeading(this.nameHeader)) {
      this.todoCreateCorrect = true;
      this.closeDialog();
    } else {
      this.todoCreateCorrect = false;
    }
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }
}
