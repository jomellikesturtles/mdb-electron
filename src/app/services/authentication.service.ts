import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from '@core/logger.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) { }

  /**
   * Login user
   * @param payload login payload
   */
  login(payload: LoginPayload): Observable<string> {
    const url = `/login`;

    return this.http.post<string>(url, payload).pipe(map(e => {
      sessionStorage.setItem('token', e);
    }
    ),
      catchError(this.handleError<any>('login')));
  }
  /**
   * Login user
   * @param payload login payload
   */
  logout(): Observable<any> {
    const url = `/logout`;

    return this.http.post<any>(url, {}).pipe(map(e => {
      sessionStorage.removeItem('token');
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