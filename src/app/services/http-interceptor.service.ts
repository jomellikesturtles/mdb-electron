import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let request = req;
    if (req.url.includes('mdb')) {
      request = this.modifyRequest(req) ?? req;
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.authService.clearSession();
          this.router.navigate(['/user/signin']);
        }
        return throwError(() => error);
      })
    );
  }

  modifyRequest(request: HttpRequest<any>): HttpRequest<any> {
    let headers = request.headers.set('Authorization', 'Bearer ' + (sessionStorage.getItem('token')));

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