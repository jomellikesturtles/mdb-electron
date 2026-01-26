import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.includes('mdb')) {
      return next.handle(this.modifyRequest(req) ?? req);
    }

    return next.handle(req);
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
