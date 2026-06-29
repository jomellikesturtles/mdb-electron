import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { SessionService } from './session.service';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private sessionService: SessionService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Proactive session check for MDB API requests
    if (req.url.includes('mdb')) {
      if (this.authService.isAuthenticated()) {
        if (this.authService.isTokenExpired()) {
          this.sessionService.sessionExpired$.next();
          return throwError(() => new HttpErrorResponse({
            error: 'Session Expired',
            status: 401,
            statusText: 'Unauthorized'
          }));
        }
        // Sliding Expiration: Update timestamp on successful activity check
        this.authService.updateExpiry();
      }
    }

    let request = req;
    if (req.url.includes('mdb') && !req.url.includes('/v1/auth')) {
      request = this.modifyRequest(req) ?? req;
    }

    // Fix for Electron file:// protocol resolution
    if (environment.runConfig.electron && request.url.startsWith('/mdb')) {
      const baseUrl = environment.bffBaseUrl.endsWith('/')
        ? environment.bffBaseUrl.slice(0, -1)
        : environment.bffBaseUrl;
      const newUrl = baseUrl + request.url;
      request = request.clone({ url: newUrl });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.authService.clearSession();
          if ((!request.url.includes('auth/login') && !request.url.includes('auth/register'))) {
            this.sessionService.sessionExpired$.next();
          }
        }
        return throwError(() => error);
      })
    );
  }

  modifyRequest(request: HttpRequest<any>): HttpRequest<any> {
    let headers = request.headers.set('Authorization', 'Bearer ' + (sessionStorage.getItem('token')));
    // request.headers.set('Access-Control-Allow-Origin', '*');
    return request.clone({
      headers,
      withCredentials: false
    });
  }
}

export let backendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpInterceptorService,
  multi: true,
};
