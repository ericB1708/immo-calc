import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { TodoServices } from '../../services/todo';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dialog-sorting-headings',
  imports: [MatDialogContent, CdkDropList, CdkDrag, NgFor],
  templateUrl: './dialog-sorting-headings.html',
  styleUrl: './dialog-sorting-headings.scss',
})
export class DialogSortingHeadingsComponent {
  public immoTodoService = inject(TodoServices);

  public headingsList = [...this.immoTodoService.headings()];

  constructor(public dialogRef: MatDialogRef<DialogSortingHeadingsComponent>) {}

  public onClickFinishTodo() {
    this.immoTodoService.updateOrderOfHeadings(this.headingsList);
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(this.headingsList);
    moveItemInArray(this.headingsList, event.previousIndex, event.currentIndex);
    console.log(this.headingsList);
  }
}
