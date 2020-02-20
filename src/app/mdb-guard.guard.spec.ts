import { TestBed, async, inject } from '@angular/core/testing';

import { MdbGuardGuard } from './mdb-guard.guard';

describe('MdbGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MdbGuardGuard]
    });
  });

  it('should ...', inject([MdbGuardGuard], (guard: MdbGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
