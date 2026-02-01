import { Injectable } from '@angular/core';
import { ENDPOINT } from '@shared/endpoint.const';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService, LoginPayload, LoginResponse } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class MockAuthenticationService extends AuthenticationService {

  login(payload: LoginPayload): Observable<LoginResponse> {
    this._isAuthenticated.set(true);
    return of({
      username: 'test',
      authToken: 'test',
      expiry: 'test',
    });
  }

  logout(): Observable<any> {
    return this.httpBaseService.post(ENDPOINT.LOGOUT, {}).pipe(map(e => {
      sessionStorage.removeItem('token');
      this._isAuthenticated.set(false);
    }
    ));
  }

}