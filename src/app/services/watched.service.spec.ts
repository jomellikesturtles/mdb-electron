import { TestBed } from '@angular/core/testing';

import { WatchedService } from './watched.service';

describe('WatchedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WatchedService = TestBed.get(WatchedService);
    expect(service).toBeTruthy();
  });
});
