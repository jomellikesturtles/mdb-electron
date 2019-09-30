import { Component, OnInit, ChangeDetectorRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { IpcService } from '../../services/ipc.service';
import { MovieService } from '../../services/movie.service';
import { Observable } from 'rxjs'
import { TEST_LIBRARY_MOVIES } from '../../mock-data'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryComponent implements OnInit {
  // @Input() data: Observable<any>

  constructor(
    private ipcService: IpcService,
    private movieService: MovieService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    // private cdr: ChangeDetectorRef
  ) { }

  libraryMovies = []
  movies = []
  testLibraryMovies = TEST_LIBRARY_MOVIES
  isLibraryMoviesEmpty = false
  numberOfPages = 1
  numberOfResults = 0
  currentPage = 1
  hasSearchResults = false

  ngOnInit() {
    console.log('ngOnInit');
    this.libraryMovies = this.testLibraryMovies
    // this.getMoviesFromLibrary()

    // this.ipcService.libraryMovies.subscribe((value) => {
    //   this.libraryMovies = value
    //   this.cdr.detectChanges()
    // })
    this.libraryMovies.forEach(libraryMovie => {
      console.log('ibraryMovies.forEach', libraryMovie);
      this.getMovieDetails(libraryMovie.imdbId)
    });
  }
  /**
   * Gets details of movie
   */
  getMovieDetails(imdbId) {
    console.log('getMovieDetails', imdbId);
    this.movieService.getMovieInfo(imdbId).subscribe(data => {
      console.log(data);
      // data.Poster = this.minimizeMoviePoster(data.Poster)
      this.movies.push(data)
    })
  }

  /**
   * Minimizes size of poster to download
   * @param poster old poster
   * @returns newPoster new Poster
   */
  minimizeMoviePoster(poster) {
    const imageSizeRegex = new RegExp(`(SX)+([\\d])+(.jpg|.jpeg)`, `gi`)
    const newPoster = poster.replace(imageSizeRegex, 'SX150.jpg')
    return newPoster
  }

  /**
   * Gets movies from library db
   */
  getMoviesFromLibrary() {
    this.ipcService.getMoviesFromLibrary()
  }

  /**
   * Selects movie and show a preview
   * @param movie movie to select
   */
  onSelect(movie) {
    console.log('selected movie: ', movie)
  }

  /**
   * Go to movie's details
   * @param movie movie to view
   */
  goToMovie(movie) {
    this.router.navigate([`/details/${movie.imdbId}`], { relativeTo: this.activatedRoute });
  }
}
