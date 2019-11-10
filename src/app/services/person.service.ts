import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { Observable, of, Subscriber, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IpcService } from '../services/ipc.service';
import { ITorrent, IOmdbMovieDetail, IRating, TmdbParameters } from '../interfaces'

const jsonContentType = new HttpHeaders({ 'Content-Type': 'application/json' })

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  httpParam = new HttpParams()
  tmdbApiKey = 'a636ce7bd0c125045f4170644b4d3d25'
  omdbUrl = 'http://www.omdbapi.com'
  tmdbUrl = 'https://api.themoviedb.org/3'
  constructor(
    private http: HttpClient,
    private ipcService: IpcService) { }

  /**
   * Gets the person details.
   * @param id tmdb person_id
   * @param language language, if blank, it is defaulted to `en-US`
   */
  getPersonDetails(id: string | number, language?: string) {
    console.log('in getPersonDetails');
    const url = `${this.tmdbUrl}/person/${id}`
    let myHttpParam = new HttpParams().append(TmdbParameters.ApiKey, 'a636ce7bd0c125045f4170644b4d3d25')
    if (!language) {
      language = 'en-US'
    }
    // const appendToResponse = 'movie_credits,tv_credits,combined_credits,external_ids,images,tagged_images'
    const appendToResponse = 'movie_credits,external_ids,images'
    myHttpParam = myHttpParam.append('language', language)
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
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`MovieService: ${message} `);
  }
}
