import { TestBed } from '@angular/core/testing';

import { CalcData } from './calc-data';

describe('CalcData', () => {
  let service: CalcData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalcData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
