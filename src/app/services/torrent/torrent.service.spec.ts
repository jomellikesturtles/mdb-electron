import { TestBed } from '@angular/core/testing';

import { TorrentService } from './torrent.service';

describe('TorrentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TorrentService = TestBed.inject(TorrentService);
    expect(service).toBeTruthy();
  });
});
