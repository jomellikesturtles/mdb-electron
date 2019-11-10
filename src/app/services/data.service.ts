import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dashboardData = []

  // private isDesktop = new BehaviorSubject<any>('')
  // currentMovie = this.isDesktop.asObservable()

  private selectedMovieSource = new BehaviorSubject<any>('')
  currentMovie = this.selectedMovieSource.asObservable()

  private searchQuerySource = new BehaviorSubject<any>('')
  currentSearchQuery = this.searchQuerySource.asObservable()

  private searchResultsSource = new BehaviorSubject<any>('')
  currentSearchResults = this.searchResultsSource.asObservable()

  private selectedMoviesSource = new BehaviorSubject<any>('')
  selectedMovies = this.selectedMoviesSource.asObservable()

  constructor() { }

  /**
   * web(angular) or desktop(electron)
   */
  getMode() {
    return 'web'
    // return 'desktop'
  }

  /**
   * set true if working in strict/corporate network, false if not.
   */
  isMockDataOnly() {
    return true
    // return false
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

  updateHighlightedMovie(val: any) {
    console.log('updatedHighlightedMovie ', val)
    this.selectedMovieSource.next(val)
  }

  updateSearchQuery(val: any) {
    console.log('updatesearchquery ', val)
    this.searchQuerySource.next(val)
  }

  updateSearchResults(val: any) {
    console.log('updateSearchResults ', val)
    this.searchResultsSource.next(val)
  }
  updateSelectedMovies(val: any) {
    console.log('selectedMovies ', val)
    this.selectedMoviesSource.next(val)
  }
}
