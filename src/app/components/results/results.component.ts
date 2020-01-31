import { Component, Input, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TMDB_SEARCH_RESULTS } from '../../mock-data';
import { ITmdbResult, TmdbParameters, TmdbSearchMovieParameters } from '../../interfaces';
import { Router, ActivatedRoute } from '@angular/router'
import { DataService } from '../../services/data.service'
import { IpcService, IpcCommand } from '../../services/ipc.service'
import { MovieService } from '../../services/movie.service'
import { NavigationService } from '../../services/navigation.service'
import { UtilsService } from '../../services/utils.service'
import { ISearchQuery } from '../top-navigation/top-navigation.component';
import { Select, Store } from '@ngxs/store'
import { AddMovie, RemoveMovie } from '../../movie.actions'
declare var $: any

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  // @Input() data: Observable<any>
  @Select(state => state.moviesList) moviesList$
  // searchResults = TMDB_SEARCH_RESULTS.results
  // sortByList = ['popularity','rating',]
  searchResults = []
  searchQuery: ISearchQuery
  hasSearchResults = true
  hasMoreResults = false
  currentSearchQuery
  selectedMovie = null
  selectedMovies = []
  cardWidth = '130px'
  displayMessage = ''
  displaySnackbar = false
  currentPage = 1

  constructor(
    private dataService: DataService,
    private ipcService: IpcService,
    private movieService: MovieService,
    private navigationService: NavigationService,
    private utilsService: UtilsService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store) { }

  ngOnInit(): void {
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip({ placement: 'top' });
    this.getData()
  }

  ngOnDestroy(): void {
  }

  /**
   * Subscribes to list of highlighted movies.
   */
  getData() {
    this.moviesList$.subscribe(moviesResult => {
      console.log('moviesresult: ', moviesResult)

      if (moviesResult.change === 'add') {
        this.searchResults.forEach(element => {
          if (moviesResult.idChanged === element.id) {
            element.isHighlighted = true
          }
        })
      } else if (moviesResult.change === 'remove') {
        this.searchResults.forEach(element => {
          if (moviesResult.idChanged === element.id) {
            element.isHighlighted = false
          }
        })
      } else if (moviesResult.change === 'clear') {
        this.searchResults.forEach(element => {
          element.isHighlighted = false
        })
      }
    });

    this.dataService.searchQuery.subscribe(data => {
      console.log('fromdataservice searchQuery: ', data);
      this.searchResults = [] // clear for new search
      this.currentPage = 1
      this.searchQuery = data
      this.getSearchResults()
      this.currentSearchQuery = this.searchQuery.query
    });
  }

  getSearchResults() {
    // commented for actual
    this.searchResults = TMDB_SEARCH_RESULTS.results
    // end of commented for actual
    const params = [
      [TmdbSearchMovieParameters.Query, this.searchQuery.query]
    ]
    // this.movieService.searchTmdbMovie(params).subscribe(data => {
    //   this.searchResults.push(...data.results)
    //   if (data.total_pages > this.currentPage) {
    //     this.hasMoreResults = true
    //   }
    //   this.setHighlights()
    //   this.cdr.detectChanges()
    // })
  }

  /**
   * Increments the currentPage by 1 to get more results.
   */
  getMoreResults() {
    const params = [
      [TmdbSearchMovieParameters.Query, this.searchQuery.query],
      [TmdbParameters.Page, ++this.currentPage]
    ]
    this.movieService.searchTmdbMovie(params).subscribe(data => {
      this.searchResults.push(...data.results)
      if (data.total_pages <= this.currentPage) {
        this.hasMoreResults = false
      }
      this.setHighlights()
    })
  }

  /**
   * Sets the highlight to the movie image if is already in the selected list.
   */
  setHighlights() {
    this.moviesList$.subscribe(e => {
      e.movies.forEach(element => {
        this.searchResults.forEach(res => {
          if (element.id === res.id) {
            res.isHighlighted = true
          }
        })
      })
    })
  }
  // download, add to watchlsit, mark as watched
}
