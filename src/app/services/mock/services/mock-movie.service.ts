import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { } from 'rxjs';
import { first, map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class MockMovieService {
  constructor(
    private http: HttpClient
  ) {

  }

  getMovieDetails() {
    return this.http.get<any>('').pipe(
      first(),
      map((data) => {

      })
    );
  }
}
