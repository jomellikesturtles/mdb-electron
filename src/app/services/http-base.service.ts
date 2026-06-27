import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { LoggerService } from '@core/logger.service';
import GeneralUtil from '@utils/general.util';

const JSON_CONTENT_TYPE_HEADER = new HttpHeaders({ 'Content-Type': 'application/json' });
@Injectable({
  providedIn: 'root'
})
export class HttpBaseService {


  constructor(
    protected http: HttpClient,
    protected logger: LoggerService
  ) { }

  get<T>(url: string, optionsOrOperation?: any, operation: string = 'GET'): Observable<T> {
    let options = {};
    let op = operation;
    if (typeof optionsOrOperation === 'string') {
      op = optionsOrOperation;
    } else if (optionsOrOperation) {
      options = optionsOrOperation;
    }

    return this.http.get<T>(url, options).pipe(
      tap(_ => this.logger.info(`GET url=${url}`)),
      // catchError(this.handleError<T>(op))
    );
  }

  post<T>(url: string, payload: any, operation = 'POST'): Observable<T> {
    const headers = (payload instanceof FormData) ? undefined : JSON_CONTENT_TYPE_HEADER;
    return this.http.post<T>(url, payload, headers ? { headers } : {}).pipe(
      tap(_ => this.logger.info(`POST url=${url}`)),
      // catchError(this.handleError<T>(operation))
    );
  }

  patch<T>(url: string, payload: any, operation = 'PATCH'): Observable<T> {
    return this.http.patch<T>(url, payload).pipe(
      tap(_ => this.logger.info(`PATCH url=${url}`)),
      // catchError(this.handleError<T>(operation))
    );
  }

  put<T>(url: string, payload: any, operation = 'PUT'): Observable<T> {
    return this.http.put<T>(url, payload).pipe(
      tap(_ => this.logger.info(`PUT url=${url}`)),
      // catchError(this.handleError<T>(operation))
    );
  }

  delete<T>(url: string, options: any = {}, operation = 'DELETE'): Observable<T> {
    return this.http.delete<T>(url, options).pipe(
      map(res => res as T),
      tap(_ => this.logger.info(`DELETE url=${url}`)),
      // catchError(this.handleError<T>(operation))
    );
  }

  /**
   * Error handler.
   * @param operation the operation
   * @param result the result
   */
  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      GeneralUtil.DEBUG.error(error); // log to console instead
      this.logger.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
