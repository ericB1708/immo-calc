import { ImmoTodo } from './../models/todo';
import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TodoServices {
  public todoList = signal<ImmoTodo[]>([
    {
      id: Date.now(),
      name: 'Zustand Dach',
      checked: false,
      header: 'aussenbereich',
    },
    {
      id: Date.now(),
      name: 'Fassade prüfen (rissfrei)',
      checked: false,
      header: 'aussenbereich',
    },
    {
      id: Date.now(),
      name: 'Feuchtigkeit im Keller prüfen',
      checked: false,
      header: 'innenbereich',
    },
    {
      id: Date.now(),
      name: 'Fenster',
      checked: false,
      header: 'aussenbereich',
    },
    {
      id: Date.now(),
      name: 'Schimmel',
      checked: false,
      header: 'innenbereich',
    },
    {
      id: Date.now(),
      name: 'Elektrik',
      checked: false,
      header: 'innenbereich',
    },
    {
      id: Date.now(),
      name: 'Wasser/Rohre',
      checked: false,
      header: 'innenbereich',
    },
    {
      id: Date.now(),
      name: 'Internet/Netz',
      checked: false,
      header: 'sonstiges',
    },
  ]);
  public headings = signal<string[]>([
    'aussenbereich',
    'dachgeschoss',
    'innenbereich',
    'sanitäranlagen',
    'sonstiges',
  ]);

  public groupedTodos = computed(() => {
    const todos = this.todoList();
    const headings = this.headings();
    const groups: Record<string, ImmoTodo[]> = {};

    headings.forEach((h) => (groups[h] = []));

    todos.forEach((todo) => {
      if (groups[todo.header]) {
        groups[todo.header].push(todo);
      }
    });

    return groups;
  });

  public createHeading(headingName: string) {
    if (headingName != '') {
      if (!this.headings().includes(headingName)) {
        this.addHeading(headingName);
      }
    }
  }

  private addHeading(headingName: string) {
    this.headings.update((headingsList) => [...headingsList, headingName]);
  }

  public deleteHeading(headingName: string) {
    if (this.headings().includes(headingName)) {
      this.todoList.update((todoList) => todoList.filter((todo) => todo.header !== headingName));
      this.headings.update((headingsList) => headingsList.filter((t) => t !== headingName));
    }
  }

  public createImmoTodo(name: string, heading: string): boolean {
    if (this.headings().includes(heading)) {
      this.addImmoTodo({
        id: Date.now(),
        name: name,
        checked: false,
        header: heading,
      });
      return true;
    } else {
      return false;
    }
  }

  private addImmoTodo(todo: ImmoTodo) {
    if (todo.id != -1) {
      this.todoList.update((todolist) => [...todolist, todo]);
    }
  }

  public changeHeadingFromTodo(todo: ImmoTodo, heading: string): boolean {
    if (todo.id != -1 && heading != '') {
      if (this.headings().includes(heading)) {
        this.todoList.update((currentItems) =>
          currentItems.map((item) => (item.id === todo.id ? { ...item, header: heading } : item)),
        );
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  public deleteTod(todo: ImmoTodo) {
    if (todo.id != -1) {
      this.todoList.update((todoList) => todoList.filter((t) => t.id !== todo.id));
    }
  }

  public updateOrderOfHeadings(newHeadingList: string[]) {
    this.headings.set(newHeadingList);
  }
}
