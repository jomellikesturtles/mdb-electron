import { Component, Input, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs'
import { TMDB_SEARCH_RESULTS } from '../../mock-data';
import { ITmdbResult, TmdbParameters, TmdbSearchMovieParameters } from '../../interfaces';
import { Router, ActivatedRoute } from '@angular/router'
import { DataService } from '../../services/data.service'
import { IpcService } from '../../services/ipc.service'
import { MovieService } from '../../services/movie.service'
import { NavigationService } from '../../services/navigation.service'
import { UtilsService } from '../../services/utils.service'
import { ISearchQuery } from '../top-navigation/top-navigation.component';
declare var $: any

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  // @Input() data: Observable<any>

  // searchResults = TMDB_SEARCH_RESULTS.results
  // sortByList = ['popularity','rating',]
  searchResults = []
  searchQuery: ISearchQuery
  hasSearchResults = true
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
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip({ placement: 'top' });

    const imdbId = this.activatedRoute.snapshot.paramMap;
    // this.dataService.currentSearchQuery
    this.dataService.searchQuery.subscribe(data => {
      console.log('fromdataservice searchQuery: ', data);
      this.searchResults = [] // clear for new search
      this.currentPage = 1
      this.searchQuery = data
      this.getSearchResults()
      this.currentSearchQuery = this.searchQuery.query
      // this.currentSearchQuery = data.query
    });
    // console.log('fromdataservice: ', this.searchQuery);
    // this.dataService.getDashboardData()
    // this.dataService.currentSearchQuery.subscribe(data => {
    //   // ran twice
    //   console.log('fromdataservice: ', data);
    //   // if (data) {
    //   //   this.getMovie(data);
    //   //   this.getBackdrop(data);
    //   // } else {
    //   //   this.getMovie(imdbId);
    //   //   this.getBackdrop(imdbId);
    //   // }
    // });
  }

  ngOnDestroy(): void {
    this.selectedMovies = []
    this.searchResults.forEach(element => {
      element.isHighlighted = false
    });
    this.searchResults = []
  }

  onClearSelected(): void {
    this.selectedMovies.forEach(element => {
      element.isHighlighted = false
    });
    this.selectedMovies = []
  }

  onDownloadSelected(): void {
    this.dataService.updateSelectedMovies(this.selectedMovies)
    this.router.navigate([`/bulk-download`], { relativeTo: this.activatedRoute });
  }

  onAddBookmark(): void {
    const root = this
    this.ipcService.addBookmark(this.selectedMovies)
    this.displayMessage = 'Added to watchlist'
    this.displaySnackbar = true
    this.utilsService.hideSnackbar(root)
  }

  onMarkAsWatched(): void {
    const root = this
    this.ipcService.addMarkAsWatched(this.selectedMovies)
    this.displayMessage = 'Marked as watched'
    this.displaySnackbar = true
    this.utilsService.hideSnackbar(root)
  }

  onHighlight(movie): void {
    console.log(this.selectedMovies);
    movie.isHighlighted = !movie.isHighlighted
    if (movie.isHighlighted) {
      this.selectedMovies.push(movie)
    } else {
      this.selectedMovies = this.selectedMovies.filter((value, index, arr) => {
        return value != movie;
      })
    }
    console.log(this.selectedMovies);
  }

  onSelect(movie: ITmdbResult): void {
    this.selectedMovie = movie;
    const highlightedId = movie.id;
    this.dataService.updateHighlightedMovie(highlightedId);
    // this.navigationService.goToPage()
    this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });

    // below is for imdb id, but we will settle for tmdb id for now
    // this.movieService.getExternalId(movie.id).subscribe(data => {
    //   const highlightedId = data.imdb_id;
    //   localStorage.setItem('imdb_id', highlightedId)
    //   this.dataService.updateHighlightedMovie(highlightedId);
    //   this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });
    // })
  }

  /**
   * Gets the year.
   * @param releaseDate release date with format YYYY-MM-DD
   */
  getYear(releaseDate: string): string {
    return this.utilsService.getYear(releaseDate)
  }

  getPoster(poster: string) {
    console.log(this.movieService.getMoviePoster(poster))
    // return poster;
    return false
  }

  getSearchResults() {
    // commented for actual
    // this.searchResults = TMDB_SEARCH_RESULTS.results
    const params = [
      [TmdbSearchMovieParameters.Query, this.searchQuery.query]
    ]
    this.movieService.searchTmdbMovie(params).subscribe(data => {
      // this.searchResults.push(...data.results)
      data.results.forEach(element => {
        this.searchResults.push(element)
      });
      this.cdr.detectChanges()
    })
  }

  /**
   * Increments the currentPage by 1 to get more results.
   */
  getMoreResults() {
    const params = [
      [TmdbSearchMovieParameters.Query, this.searchQuery.query],
      [TmdbParameters.PrimaryReleaseYear, 1994],
      [TmdbParameters.Page, ++this.currentPage]
    ]
    this.movieService.getMoviesDiscover(params).subscribe(data => { this.searchResults.push(...data.results) });
  }
  // download, add to watchlsit, mark as watched
}
