import { TestBed, async, inject } from '@angular/core/testing';

import { DetailsGuard } from './details.guard';

describe('DetailsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetailsGuard]
    });
  });

  it('should ...', inject([DetailsGuard], (guard: DetailsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
