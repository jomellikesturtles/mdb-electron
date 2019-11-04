import { Component, OnInit } from '@angular/core';
import { TMDB_SEARCH_RESULTS } from '../../mock-data';
import { Movie, TmdbResult } from '../../subject';
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
export class ResultsComponent implements OnInit {

  searchResults = TMDB_SEARCH_RESULTS.results
  hasSearchResults = true
  currentSearchQuery = 'guardians of the galaxy'
  selectedMovie = null
  selectedMovies = []
  cardWidth = '130px'
  displayMessage = ''
  displaySnackbar = false

  constructor(
    private dataService: DataService,
    private ipcService: IpcService,
    private movieService: MovieService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip({ placement: 'top' });
  }

  onClearSelected() {
    this.selectedMovies.forEach(element => {
      element.isHighlighted = false
    });
    this.selectedMovies = []
  }

  onDownloadSelected() {
    this.dataService.updateSelectedMovies(this.selectedMovies)
    this.router.navigate([`/bulk-download`], { relativeTo: this.activatedRoute });
  }

  onAddToWatchlist() {
    const root = this
    this.ipcService.addToWatchlist(this.selectedMovies)
    this.displayMessage = 'Added to watchlist'
    this.displaySnackbar = true
    this.utilsService.hideSnackbar(root)
  }

  onMarkAsWatched() {
    const root = this
    this.ipcService.addMarkAsWatched(this.selectedMovies)
    this.displayMessage = 'Marked as watched'
    this.displaySnackbar = true
    this.utilsService.hideSnackbar(root)
  }

  onHighlight(movie) {
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

  onSelect(movie: TmdbResult) {
    this.selectedMovie = movie;
    const highlightedId = movie.id;
    this.dataService.updateHighlightedMovie(highlightedId);
    this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });

    // will settle for tmdb id for now
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
  getYear(releaseDate: string) {
    return this.utilsService.getYear(releaseDate)
  }

  getPoster(poster: string) {
    console.log(this.movieService.getMoviePoster(poster))
    // return poster;
    return false
  }
  // download, add to watchlsit, mark as watched
}
