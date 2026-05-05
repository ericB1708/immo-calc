import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoPage } from './todo-page';

describe('TodoPage', () => {
  let component: TodoPage;
  let fixture: ComponentFixture<TodoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
