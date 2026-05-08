import { NgIf, NgFor } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogCreateTodoComponent } from '../dialog-create-todo/dialog-create-todo';
import { TodoServices } from '../../services/todo';
import { ImmoTodo } from '../../models/todo';

@Component({
  selector: 'app-dialog-edit',
  imports: [FormsModule, NgIf, MatDialogClose, MatDialogTitle, MatDialogContent, NgFor],
  templateUrl: './dialog-edit.html',
  styleUrl: './dialog-edit.scss',
})
export class DialogEditComponent {
  public immoTodoService = inject(TodoServices);
  selectedOption = this.immoTodoService
    .headings()
    .find((item) => item === this.oldHeadingNameOfTodo);
  @Input() isHeading: boolean = false;
  @Input() oldNameHeading: string = '';
  newHeadingName = this.oldNameHeading ? this.oldNameHeading : '';
  @Input() oldTodo!: ImmoTodo;
  oldHeadingNameOfTodo: string = !this.isHeading ? this.oldTodo.header : '';
  newNameTodo: string = !this.isHeading ? this.oldTodo.name : '';
  newHeadingNameOfTodo: string = !this.isHeading ? this.oldTodo.header : '';

  todoEditCorrect: boolean = true;
  headingEditCorrect: boolean = true;

  constructor(public dialogRef: MatDialogRef<DialogCreateTodoComponent>) {}

  onClickEditTodo() {
    if (this.newNameTodo !== '') {
      this.immoTodoService.updatetodo(this.oldTodo.id, {
        name: this.newNameTodo,
        header: this.newHeadingNameOfTodo,
      });
      this.todoEditCorrect = true;
      this.closeDialog();
    } else {
      this.todoEditCorrect = false;
    }
  }

  onClickEditHeading() {
    if (this.newHeadingName !== '') {
      this.immoTodoService.updateHeading(this.oldNameHeading, this.newHeadingName);
      this.headingEditCorrect = true;
    } else {
      this.headingEditCorrect = false;
    }
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }
}
