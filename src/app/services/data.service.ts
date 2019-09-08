import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private selectedMovieSource = new BehaviorSubject<any>('');
  currentMovie = this.selectedMovieSource.asObservable();

  private searchQuerySource = new BehaviorSubject<any>('');
  currentSearchQuery = this.searchQuerySource.asObservable();

  private searchResultsSource = new BehaviorSubject<any>('');
  currentSearchResults = this.searchResultsSource.asObservable();

  private selectedMoviesSource = new BehaviorSubject<any>('');
  selectedMovies = this.selectedMoviesSource.asObservable();

  constructor() { }

  updateHighlightedMovie(val: any) {
    console.log('updatedHighlightedMovie ', val);
    this.selectedMovieSource.next(val);
  }

  updateSearchQuery(val: any) {
    console.log('updatesearchquery ', val);
    this.searchQuerySource.next(val);
  }

  updateSearchResults(val: any) {
    console.log('updateSearchResults ', val);
    this.searchResultsSource.next(val);
  }
  updateSelectedMovies(val: any) {
    console.log('selectedMovies ', val);
    this.selectedMoviesSource.next(val);
  }
}