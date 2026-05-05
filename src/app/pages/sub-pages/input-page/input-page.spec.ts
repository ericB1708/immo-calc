import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPage } from './input-page';

describe('InputPage', () => {
  let component: InputPage;
  let fixture: ComponentFixture<InputPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
