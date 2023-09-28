import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TmdbParameters } from '@models/interfaces';
import { environment } from '@environments/environment';
import { LoggerService } from '@core/logger.service';

const jsonContentType = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  TMDB_API_KEY = environment.tmdb.apiKey;
  TMDB_URL = environment.tmdb.url;
  httpParam = new HttpParams();
  omdbUrl = 'http://www.omdbapi.com';
  tmdbUrl = 'https://api.themoviedb.org/3';
  constructor(
    private http: HttpClient,
    private logger: LoggerService) { }

  /**
   * Gets the person details.
   * @param id tmdb person_id
   * @param language language, if blank, it is defaulted to `en-US`
   */
  getPersonDetails(id: string | number, language?: string) {
    console.log('in getPersonDetails');
    const url = `${this.tmdbUrl}/person/${id}`;
    let myHttpParam = new HttpParams().append(TmdbParameters.ApiKey, this.TMDB_API_KEY);
    if (!language) {
      language = 'en-US';
    }
    // const appendToResponse = 'movie_credits,tv_credits,combined_credits,external_ids,images,tagged_images'
    const appendToResponse = 'movie_credits,external_ids,images';
    myHttpParam = myHttpParam.append(TmdbParameters.Language, language);
    myHttpParam = myHttpParam.append(TmdbParameters.AppendToResponse, appendToResponse);
    const tmdbHttpOptions = {
      headers: jsonContentType,
      params: myHttpParam
    };
    return this.http.get<any>(url, tmdbHttpOptions).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('getPersonDetails')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.logger.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
