import { Injectable, signal } from '@angular/core';
import { LoggerService } from '@core/logger.service';
import { ENDPOINT } from '@shared/endpoint.const';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpBaseService } from './http-base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  protected _isAuthenticated = signal<boolean>(!!sessionStorage.getItem('token'));
  public isAuthenticated = this._isAuthenticated.asReadonly();

  constructor(
    protected httpBaseService: HttpBaseService,
    protected logger: LoggerService
  ) { }

  /**
   * Login user
   * @param payload login payload
   */
  login(payload: LoginPayload): Observable<LoginResponse> {
    this._isAuthenticated.set(true);
    return of({
      username: 'test',
      authToken: 'test',
      expiry: 'test',
    });
    // Unreachable code updated for consistency
    /* return this.httpBaseService.post(ENDPOINT.LOGIN, payload, 'login').pipe(map((e: LoginResponse) => {
      sessionStorage.setItem('token', e.authToken);
      this._isAuthenticated.set(true);
      return e;
    })); */
  }
  /**
   * Login user
   * @param payload login payload
   */
  logout(): Observable<any> {
    return this.httpBaseService.post(ENDPOINT.LOGOUT, {}, 'logout').pipe(map(e => {
      sessionStorage.removeItem('token');
      this._isAuthenticated.set(false);
    }));
  }

}

export class LoginPayload {
  username: string;
  email: string;
  password: string;
}

export class LoginResponse {
  username: string;
  authToken: string;
  expiry: string;
}
