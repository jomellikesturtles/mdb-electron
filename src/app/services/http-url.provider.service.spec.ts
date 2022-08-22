import { TestBed } from '@angular/core/testing';

import { HttpUrl.ProviderService } from './http-url.provider.service';

describe('HttpUrl.ProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpUrl.ProviderService = TestBed.get(HttpUrl.ProviderService);
    expect(service).toBeTruthy();
  });
});
