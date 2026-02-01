import { HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoggerService } from "@core/logger.service";
import { OmdbParameters } from "@models/interfaces";
import { OMDB_API_KEY, OMDB_URL } from "@shared/constants";
import { Observable, tap } from "rxjs";
import { HttpBaseService } from "@services/http-base.service";

const JSON_CONTENT_TYPE_HEADER = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({ providedIn: 'root' })
export class OmdbService {
  constructor(
    private httpBaseService: HttpBaseService,
    private logger: LoggerService) { }

  /**
   * Gets movie details from omdb.
   * @param imdbId the imdb id.
   */
  getOmdbMovieDetails(imdbId: number): Observable<any> {
    const url = `${OMDB_URL}/`;
    const httpParam = new HttpParams().append(OmdbParameters.ApiKey, OMDB_API_KEY);

    const myOmdbHttpOptions = {
      headers: JSON_CONTENT_TYPE_HEADER,
      params: httpParam
    };
    return this.httpBaseService.get(url, myOmdbHttpOptions, 'getOmdbMovieDetails').pipe(
      tap(_ => this.logger.info(''))
    );
  };

}
