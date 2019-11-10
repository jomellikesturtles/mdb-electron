import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TMDB_SEARCH_RESULTS } from '../../mock-data';
import { IOmdbMovieDetail, ITmdbResult, TmdbParameters } from '../../interfaces';
import { Router, ActivatedRoute } from '@angular/router'
import { DataService } from '../../services/data.service'
import { IpcService } from '../../services/ipc.service'
import { MovieService } from '../../services/movie.service'
import { UtilsService } from '../../services/utils.service'
declare var $: any

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {

  // searchResults = TMDB_SEARCH_RESULTS.results
  searchResults = []
  searchQuery = {
    keyword: ''
  }
  hasSearchResults = true
  currentSearchQuery = 'guardians of the galaxy'
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
    private utilsService: UtilsService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip({ placement: 'top' });
    this.getSearchResults()
  }

  ngOnDestroy(): void {
    this.selectedMovies = []
    this.searchResults.forEach(element => {
      element.isHighlighted = false
    });
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

  onAddToWatchlist(): void {
    const root = this
    this.ipcService.addToWatchlist(this.selectedMovies)
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
    const params = [
      [TmdbParameters.PrimaryReleaseYear, 2010]
    ]
    this.movieService.getMoviesDiscover(params).subscribe(data => {
      this.searchResults.push(...data.results)
      this.cdr.detectChanges()
    });
  }

  /**
   * Increments the currentPage by 1 to get more results.
   */
  getMoreResults() {
    const params = [
      [TmdbParameters.PrimaryReleaseYear, 1994],
      [TmdbParameters.Page, ++this.currentPage]
    ]
    this.movieService.getMoviesDiscover(params).subscribe(data => { this.searchResults.push(...data.results) });
  }
  // download, add to watchlsit, mark as watched
}
