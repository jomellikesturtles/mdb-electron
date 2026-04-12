import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private readonly BASE_PATH = 'assets/mock-responses';

  constructor(private http: HttpClient) { }

  getMovieGenres(): Observable<any[]> {
    return of([
      { "id": 1, "code": "ACT", "description": "Action", "isChecked": true },
      { "id": 2, "code": "ADV", "description": "Adventure", "isChecked": false },
      { "id": 3, "code": "DOC", "description": "Documentary", "isChecked": false },
      { "id": 4, "code": "DRA", "description": "Drama", "isChecked": false },
      { "id": 5, "code": "HOR", "description": "Horror", "isChecked": false },
      { "id": 6, "code": "SCI", "description": "Sci-Fi", "isChecked": true },
      { "id": 7, "code": "THR", "description": "Thriller", "isChecked": false }
    ]);
  }

  getDisplayedMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_PATH}/displayed-movies.json`);
  }

  getPersonDetails(): Observable<any> {
    return this.http.get<any>(`${this.BASE_PATH}/tmdb-person-details.json`);
  }
}
