import { environment } from './../../../../environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core'
import { TMDB_SEARCH_RESULTS } from '../../../mock-data';
import { TmdbParameters, TmdbSearchMovieParameters } from '../../../interfaces'
import { DataService } from '../../../services/data.service'
import { MovieService } from '../../../services/movie.service'
import { ISearchQuery } from '../../top-navigation/top-navigation.component'
import { Select, Store } from '@ngxs/store'

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  @Select(state => state.moviesList) moviesList$
  searchResults = []
  searchQuery: ISearchQuery
  hasSearchResults = false
  hasMoreResults = false
  currentSearchQuery
  selectedMovie = null
  selectedMovies = []
  cardWidth = '130px'
  displayMessage = ''
  displaySnackbar = false
  currentPage = 1
  isProcSearching = true
  procLoadMoreResults = false

  constructor(
    private dataService: DataService,
    private movieService: MovieService) { }

  ngOnInit(): void {
    console.log('inResutlts')
    if (environment.runConfig.useTestData === true) {
      this.searchResults = TMDB_SEARCH_RESULTS.results
    } else {
      this.getData()
    }
  }

  ngOnDestroy(): void {
  }

  /**
   * Subscribes to list of highlighted movies.
   */
  getData() {
    this.dataService.searchQuery.subscribe(data => {
      console.log('fromdataservice searchQuery: ', data);
      this.isProcSearching = true;
      this.searchResults = [] // clear for new search
      this.currentPage = 1
      this.searchQuery = data
      this.getSearchResults()
      this.currentSearchQuery = this.searchQuery.query
    });
  }

  getSearchResults() {
    const paramMap = new Map<TmdbParameters | TmdbSearchMovieParameters, any>();
    paramMap.set(TmdbSearchMovieParameters.Query, this.searchQuery.query);
    this.movieService.searchTmdbMovie(paramMap).subscribe(data => {
      this.searchResults.push(...data.results)
      if (data.total_pages > this.currentPage) {
        this.hasMoreResults = true
      }
      this.isProcSearching = false;
    })
  }

  /**
   * Increments the currentPage by 1 to get more results.
   */
  getMoreResults() {
    const paramMap = new Map<TmdbParameters | TmdbSearchMovieParameters, any>();
    paramMap.set(TmdbSearchMovieParameters.Query, this.searchQuery.query);
    paramMap.set(TmdbParameters.Page, ++this.currentPage);
    this.movieService.searchTmdbMovie(paramMap).subscribe(data => {
      this.searchResults.push(...data.results)
      if (data.total_pages <= this.currentPage) {
        this.hasMoreResults = false
      }
    })
  }

}
