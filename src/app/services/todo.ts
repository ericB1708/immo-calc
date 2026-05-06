import { Injectable, signal } from '@angular/core';
import { ImmoTodo } from '../models/todo';

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
}
