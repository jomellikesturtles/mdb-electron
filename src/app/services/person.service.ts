import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { Observable, of, Subscriber, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TmdbParameters } from '@models/interfaces'
import { TMDB_API_KEY } from '@shared/constants';

const jsonContentType = new HttpHeaders({ 'Content-Type': 'application/json' })

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  httpParam = new HttpParams()
  omdbUrl = 'http://www.omdbapi.com'
  tmdbUrl = 'https://api.themoviedb.org/3'
  constructor(
    private http: HttpClient) { }

  /**
   * Gets the person details.
   * @param id tmdb person_id
   * @param language language, if blank, it is defaulted to `en-US`
   */
  getPersonDetails(id: string | number, language?: string) {
    console.log('in getPersonDetails');
    const url = `${this.tmdbUrl}/person/${id}`
    let myHttpParam = new HttpParams().append(TmdbParameters.ApiKey, TMDB_API_KEY)
    if (!language) {
      language = 'en-US'
    }
    // const appendToResponse = 'movie_credits,tv_credits,combined_credits,external_ids,images,tagged_images'
    const appendToResponse = 'movie_credits,external_ids,images'
    myHttpParam = myHttpParam.append(TmdbParameters.Language, language)
    myHttpParam = myHttpParam.append(TmdbParameters.AppendToResponse, appendToResponse)
    const tmdbHttpOptions = {
      headers: jsonContentType,
      params: myHttpParam
    };
    return this.http.get<any>(url, tmdbHttpOptions).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getPersonDetails')))
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`MovieService: ${message} `);
  }
}
