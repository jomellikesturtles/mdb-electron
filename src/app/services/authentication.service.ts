import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { LoggerService } from '@core/logger.service';
import { ENDPOINT } from '@shared/endpoint.const';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _isAuthenticated = signal<boolean>(!!sessionStorage.getItem('token'));
  public isAuthenticated = this._isAuthenticated.asReadonly();

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) { }

  /**
   * Login user
   * @param payload login payload
   */
  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(ENDPOINT.LOGIN, payload).pipe(map((e: LoginResponse) => {
      sessionStorage.setItem('token', e.authToken);
      this._isAuthenticated.set(true);
      return e;
    }
    ),
      catchError(this.handleError<any>('login')));
  }
  /**
   * Login user
   * @param payload login payload
   */
  logout(): Observable<any> {
    return this.http.post<any>(ENDPOINT.LOGOUT, {}).pipe(map(e => {
      sessionStorage.removeItem('token');
      this._isAuthenticated.set(false);
    }
    ),
      catchError(this.handleError<any>('login')));
  }

  /**
   * Error handler.
   * @param operation the operation
   * @param result result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logger.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
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
