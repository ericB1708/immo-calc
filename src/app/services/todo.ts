import { ImmoTodo } from './../models/todo';
import { computed, effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TodoServices {
  public todoList = signal<ImmoTodo[]>([]);
  public headings = signal<string[]>([]);

  constructor() {
    const saveTodos = localStorage.getItem('immo_todso');
    const saveHeadings = localStorage.getItem('immo_headings');

    if (saveTodos && saveHeadings) {
      this.todoList.set(JSON.parse(saveTodos));
      this.headings.set(JSON.parse(saveHeadings));
    } else {
      this.initializeArrays();
    }

    effect(() => {
      localStorage.setItem('immo_todso', JSON.stringify(this.todoList()));
      localStorage.setItem('immo_headings', JSON.stringify(this.headings()));
    });
  }

  public initializeArrays() {
    this.headings.set([
      'aussenbereich',
      'dachgeschoss',
      'innenbereich',
      'sanitäranlagen',
      'sonstiges',
    ]);

    this.todoList.set([
      {
        id: 1,
        name: 'Zustand Dach',
        checked: false,
        header: 'aussenbereich',
      },
      {
        id: 2,
        name: 'Fassade prüfen (rissfrei)',
        checked: false,
        header: 'aussenbereich',
      },
      {
        id: 3,
        name: 'Feuchtigkeit im Keller prüfen',
        checked: false,
        header: 'innenbereich',
      },
      {
        id: 4,
        name: 'Fenster',
        checked: false,
        header: 'aussenbereich',
      },
      {
        id: 5,
        name: 'Schimmel',
        checked: false,
        header: 'innenbereich',
      },
      {
        id: 6,
        name: 'Elektrik',
        checked: false,
        header: 'innenbereich',
      },
      {
        id: 7,
        name: 'Wasser/Rohre',
        checked: false,
        header: 'innenbereich',
      },
      {
        id: 8,
        name: 'Internet/Netz',
        checked: false,
        header: 'sonstiges',
      },
    ]);
  }

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

  public createHeading(headingName: string): boolean {
    if (headingName != '') {
      if (!this.headings().includes(headingName)) {
        this.addHeading(headingName);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
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

  public updatetodo(id: number, changes: Partial<ImmoTodo>) {
    this.todoList.update((currentItems) =>
      currentItems.map((item) => {
        if (item.id === id) {
          return { ...item, ...changes };
        }
        return item;
      }),
    );
  }

  public updateHeading(oldHeadingName: string, newHeadingName: string) {
    this.headings.update((currentHeadings) =>
      currentHeadings.map((item) => (item === oldHeadingName ? newHeadingName : item)),
    );
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


  public deleteTodo(todo: ImmoTodo) {
    if (todo.id != -1) {
      this.todoList.update((todoList) => todoList.filter((t) => t.id !== todo.id));
    }
  }

  public updateOrderOfHeadings(newHeadingList: string[]) {
    this.headings.set(newHeadingList);
  }
}
