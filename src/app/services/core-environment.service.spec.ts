import { TestBed } from '@angular/core/testing';

import { CoreEnvironmentService } from './core-environment.service';

describe('CoreEnvironmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoreEnvironmentService = TestBed.get(CoreEnvironmentService);
    expect(service).  toBeTruthy();
  });
});
