import { NgIf, NgFor } from '@angular/common';
import { Component, Inject, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
  MAT_DIALOG_DATA,
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
  selectedOption: string | undefined;

  isHeading: boolean = false;
  oldNameHeading: string;
  newHeadingName: string;
  oldTodo!: ImmoTodo;
  newNameTodo: string;

  todoEditCorrect: boolean = true;
  headingEditCorrect: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DialogCreateTodoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { isHeading: boolean; oldTodo: ImmoTodo; oldNameHeading?: string },
  ) {
    this.isHeading = data.isHeading;
    this.newHeadingName = data.oldNameHeading ? data.oldNameHeading : '';
    this.oldNameHeading = data.oldNameHeading ? data.oldNameHeading : '';
    this.oldTodo = data.oldTodo ? data.oldTodo : { name: '', checked: false, header: '', id: -1 };
    this.newNameTodo = !data.isHeading ? data.oldTodo.name : '';
    if (!this.isHeading) {
      this.selectedOption =
        this.immoTodoService.headings().find((item) => item === data.oldTodo.header) !== undefined
          ? this.immoTodoService.headings().find((item) => item === data.oldTodo.header)
          : '';
    }
  }

  onClickEditTodo() {
    if (this.newNameTodo !== '') {
      this.immoTodoService.updatetodo(this.oldTodo.id, {
        name: this.newNameTodo,
        header: this.selectedOption,
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
      this.closeDialog();
    } else {
      this.headingEditCorrect = false;
    }
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }
}
