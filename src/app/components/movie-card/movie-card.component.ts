import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { AddMovie, RemoveMovie } from '../../movie.actions';
import { ITmdbResult } from '../../interfaces';
import { DataService } from '../../services/data.service';
import { UtilsService } from '../../services/utils.service';
import { MovieService } from '../../services/movie.service';
import { IpcCommand, IpcService } from '../../services/ipc.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  @Input() movie
  @Input() cardWidth
  @Output() previewMovieId = new EventEmitter<any>();

  selectedMovies = []
  constructor(
    private dataService: DataService,
    private ipcService: IpcService,
    private movieService: MovieService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) { }

  ngOnInit() {
    console.log(`ngOnInit ${this.movie.title}`)
  }

  /**
   * Adds movie object to the selected movies list
   * @param movie current selected movie
   */
  onHighlight(movie): void {
    console.log(this.selectedMovies);
    movie.isHighlighted = !movie.isHighlighted
    if (movie.isHighlighted) {
      this.selectedMovies.push(movie)
      this.store.dispatch(new AddMovie(movie))
    } else {
      this.selectedMovies = this.selectedMovies.filter((value, index, arr) => {
        return value !== movie;
      })
      this.store.dispatch(new RemoveMovie(movie))
    }
  }

  /**
   * Opens the movie's details page.
   * @param movie the movie to open
   */
  onSelect(movie: ITmdbResult): void {
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

  onPreview(movie) {
    this.previewMovieId.emit(movie)
  }

  /**
   * Adds bookmark for single movie.
   * @param val tmdb id
   */
  onAddBookmarkSingle(val): void {
    this.ipcService.call(IpcCommand.Bookmark, [IpcCommand.Add, val])
  }

  /**
   * Removes bookmark for single movie.
   * @param val tmdb id
   */
  onRemoveBookmarkSingle(val): void {
    this.ipcService.call(IpcCommand.Bookmark, [IpcCommand.Remove, val])
  }

  /**
   * Gets the year.
   * @param releaseDate release date with format YYYY-MM-DD
   */
  getYear(releaseDate: string): string {
    return this.utilsService.getYear(releaseDate)
  }

  /**
   * Gets poster. CURRENTLY UNUSED
   * @param poster poster url
   * todo: Fetch from offline or generate canvass.
   */
  getPoster(poster: string) {
    console.log(this.movieService.getMoviePoster(poster))
    // return poster;
    return false
  }

  goToYear(year: string) {
    console.log('year', year)
    this.dataService.updateDiscoverQuery(['year', year])
    this.router.navigate([`/discover`], { relativeTo: this.activatedRoute });
  }
}
