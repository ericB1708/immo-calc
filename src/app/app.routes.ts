import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page';
import { InputPageComponent } from './pages/sub-pages/input-page/input-page';
import { ResultPageComponent } from './pages/sub-pages/result-page/result-page';
import { TodoPageComponent } from './pages/sub-pages/todo-page/todo-page';

export const routes: Routes = [
  { path: '', redirectTo: 'main-page', pathMatch: 'full' },

  {
    path: 'main-page',
    component: MainPageComponent,

    children: [
      { path: '', redirectTo: 'calc', pathMatch: 'full' },
      { path: 'calc', component: InputPageComponent },
      { path: 'result', component: ResultPageComponent },
      { path: 'todo', component: TodoPageComponent },
    ],
  },
];
