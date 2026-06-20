import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpInterceptorService } from './http-interceptor.service';
import { AuthenticationService } from './authentication.service';
import { SessionService } from './session.service';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

describe('HttpInterceptorService', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  const mockAuthService = {
    isAuthenticated: () => true,
    isTokenExpired: () => false,
    updateExpiry: () => {},
    clearSession: () => {}
  };

  const mockSessionService = {
    sessionExpired$: {
      next: () => {}
    }
  };

  const mockRouter = {
    navigate: () => {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpInterceptorService,
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpInterceptorService,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: HttpInterceptorService = TestBed.inject(HttpInterceptorService);
    expect(service).toBeTruthy();
  });

  it('should not modify URL in non-electron environment', () => {
    // Force non-electron
    environment.runConfig.electron = false;

    httpClient.get('/mdb/test').subscribe();

    const req = httpMock.expectOne('/mdb/test');
    expect(req.request.url).toBe('/mdb/test');
    req.flush({});
  });

  it('should prepend backend URL in electron environment', () => {
    // Force electron
    environment.runConfig.electron = true;
    environment.bffBaseUrl = 'http://localhost:8082';

    httpClient.get('/mdb/test').subscribe();

    // We expect the interceptor to have changed the URL
    const req = httpMock.expectOne('http://localhost:8082/mdb/test');
    expect(req.request.url).toBe('http://localhost:8082/mdb/test');
    req.flush({});
  });

  it('should handle trailing slash in bffBaseUrl correctly', () => {
    // Force electron
    environment.runConfig.electron = true;
    environment.bffBaseUrl = 'http://localhost:8082/'; // With trailing slash

    httpClient.get('/mdb/test').subscribe();

    // Should NOT have double slash: http://localhost:8082//mdb/test
    const req = httpMock.expectOne('http://localhost:8082/mdb/test');
    expect(req.request.url).toBe('http://localhost:8082/mdb/test');
    req.flush({});
  });
});
