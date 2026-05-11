import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
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

  @ViewChild('appsContainer') appsContainer!: ElementRef;

  constructor(public dialog: MatDialog) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.appsVisible()) {
      if (this.appsContainer && !this.appsContainer.nativeElement.contains(event.target)) {
        this.appsVisible.set(false); // Menü schließen!
      }
    }
  }

  exportData() {
    const exportDataImmoCalc = {
      todos: this.todoService.todoList(),
      headings: this.todoService.headings(),
    };

    const jsonString = JSON.stringify(exportDataImmoCalc, null, 2);

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `immo-todos-backup-${Date.now()}.json`;
    a.click();

    window.URL.revokeObjectURL(url);
    this.appsVisible.set(false);
  }

  importData(event: any) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.todos && importedData.headings) {
            this.todoService.todoList.set(importedData.todos);
            this.todoService.headings.set(importedData.headings);
          } else {
          }
        } catch (error) {}
      };

      reader.readAsText(file);
    }
    event.target.value = '';
    this.appsVisible.set(false);
  }

  onAppsClick() {
    this.appsVisible.set(!this.appsVisible());
  }

  onAddsClick() {
    this.dialog.open(DialogCreateTodoComponent);
  }

  onSortClick() {
    if (this.todoService.headings().length >= 2) {
      this.dialog.open(DialogSortingHeadingsComponent);
      this.appsVisible.set(false);
    }
  }

  // function for output changeCheckItem
  updateTodoCheck(item: ImmoTodo) {
    this.todoService.updatetodo(item.id, { checked: item.checked });
  }
  // function for output editHeadingEvent
  editHeading(headinName: string) {
    const dialogRef = this.dialog.open(DialogEditComponent, {
      data: {
        isHeading: true,
        oldNameHeading: headinName,
      },
    });
  }
  // function for output deleteHeadingEvent
  deleteHeading(heading: string) {
    this.todoService.deleteHeading(heading);
  }

  // function for output editTodoEvent
  editTodo(todo: ImmoTodo) {
    const dialogRef = this.dialog.open(DialogEditComponent, {
      data: {
        isHeading: false,
        oldTodo: todo,
      },
    });
  }

  // function for output deleteTodoEvent
  deleteTodo(todo: ImmoTodo) {
    this.todoService.deleteTodo(todo);
  }
}
