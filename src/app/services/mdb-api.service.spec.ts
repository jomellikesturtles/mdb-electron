import { TestBed } from '@angular/core/testing';

import { MdbApiService } from './mdb-api.service';

describe('MdbApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MdbApiService = TestBed.get(MdbApiService);
    expect(service).toBeTruthy();
  });
});
