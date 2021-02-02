import { TestBed } from '@angular/core/testing';
import { FirebaseService } from './firebase.service';

import { WatchedService } from './watched.service';

describe('WatchedService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [FirebaseService]
  }));

  it('should be created', () => {
    const service: WatchedService = TestBed.get(WatchedService);
    expect(service).toBeTruthy();
  });
});
