import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TodoListComponent } from '../../../components/todo-list/todo-list';
import { TodoServices } from '../../../services/todo';

@Component({
  selector: 'app-todo-page',
  imports: [TodoListComponent, NgFor],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.scss',
})
export class TodoPageComponent {
  public todoService = inject(TodoServices);
}
