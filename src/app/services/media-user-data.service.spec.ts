import { TestBed } from '@angular/core/testing';

import { MediaUserDataService } from './media-user-data.service';

describe('MediaUserDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MediaUserDataService = TestBed.get(MediaUserDataService);
    expect(service).toBeTruthy();
  });
});
