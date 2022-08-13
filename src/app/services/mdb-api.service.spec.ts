import { TestBed } from '@angular/core/testing';

import { BffService } from './mdb-api.service';

describe('MdbApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BffService = TestBed.get(BffService);
    expect(service).toBeTruthy();
  });
});
