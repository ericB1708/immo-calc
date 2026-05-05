import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinnedItems } from './pinned-items';

describe('PinnedItems', () => {
  let component: PinnedItems;
  let fixture: ComponentFixture<PinnedItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinnedItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinnedItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
