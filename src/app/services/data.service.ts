import { Observable, Subject } from 'rxjs';
/**
 * Data sharing service.
 */
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dashboardData = []

  // private isDesktop = new BehaviorSubject<any>('')
  // currentMovie = this.isDesktop.asObservable()

  private previewMovieSource = new Subject()
  // previewMovie = null
  previewMovie = this.previewMovieSource.asObservable()

  private selectedMovieSource = new BehaviorSubject<any>('')
  currentMovie = this.selectedMovieSource.asObservable()

  private searchQuerySource = new BehaviorSubject<any>('')
  searchQuery = this.searchQuerySource.asObservable()

  private searchResultsSource = new BehaviorSubject<any>('')
  currentSearchResults = this.searchResultsSource.asObservable()

  private selectedMoviesSource = new BehaviorSubject<any>('')
  selectedMovies = this.selectedMoviesSource.asObservable()

  private discoverMoviesSource = new BehaviorSubject<any>('')
  discoverQuery = this.discoverMoviesSource.asObservable()

  constructor() { }


  updatePreviewMovie(val: any) {
    console.log('updatedHighlightedMovie ', val)
    // this.previewMovieSource..next(val)
    // this.previewMovieSource.
    // this.selectedMovieSource.value
    this.previewMovieSource.next(val)
  }


  setDashboardData(data: any[]) {
    this.dashboardData = data
  }
  addDashboardData(data: any[]) {
    console.log('pushing ', data)
    this.dashboardData.push(data)
  }
  getDashboardData() {
    return this.dashboardData
  }

  hasDashboardData() {
    console.log(
      'dashboard data has value',
      this.dashboardData && this.dashboardData.length
    )
    return this.dashboardData && this.dashboardData.length
  }

  setSearchQuery(val) {
    this.searchQuery = val;
  }

  getSearchQuery() {
    return this.searchQuery;
  }

  updateHighlightedMovie(val: any) {
    this.selectedMovieSource.next(val)
  }

  updateSearchQuery(val: any) {
    this.searchQuerySource.next(val)
  }

  updateSearchResults(val: any) {
    this.searchResultsSource.next(val)
  }
  updateSelectedMovies(val: any) {
    this.selectedMoviesSource.next(val)
  }

  // updateDiscoverQuery(type: string, val: string | null | number) {
  updateDiscoverQuery(val: string[]) {
    // this.discoverQuery = val;
    this.discoverMoviesSource.next(val)
  }

  getDiscoverQuery() {
    return this.discoverQuery;
  }
}
