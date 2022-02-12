import { environment } from '@environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core'
import { TMDB_SEARCH_RESULTS } from '../../../mock-data';
import { TmdbParameters, TmdbSearchMovieParameters } from '@models/interfaces'
import { DataService } from '@services/data.service'
import { MovieService } from '@services/movie/movie.service'
import { ISearchQuery } from '@components/top-navigation/top-navigation.component'

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
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
    this.movieService.searchMovie(paramMap).subscribe(data => {
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
    this.procLoadMoreResults = true
    this.movieService.searchMovie(paramMap).subscribe(data => {
      this.searchResults = data.results
      // this.searchResults.push(...data.results) // for some reason this doesn't work anymore
      if (data.total_pages <= this.currentPage) {
        this.hasMoreResults = false
      }
      this.procLoadMoreResults = false
    })
  }

}
