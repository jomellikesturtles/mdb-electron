import { HttpRequest, HttpHandler, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
export function mockDataFactory(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> | any {
  const url = request.url;
  const method = request.method;
  let toReturn = { status: 200, body: null };
  const TMDB_URL = environment.tmdb.url;

  return new Observable((res) => {
    res.next(new HttpResponse({
      status: 200,
      body: toReturn.body
    }));
    res.complete();
  });
}
