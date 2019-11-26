import { Component, OnInit, ChangeDetectorRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { IpcService } from '../../services/ipc.service';
import { MovieService } from '../../services/movie.service';
import { Observable } from 'rxjs'
import { TEST_LIBRARY_MOVIES } from '../../mock-data'
import { Router, ActivatedRoute } from '@angular/router'
import { REGEX_IMAGE_SIZE } from '../../constants';
import { UtilsService } from '../../services/utils.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryComponent implements OnInit {
  @Input() data: Observable<any>

  constructor(
    private dataService: DataService,
    private ipcService: IpcService,
    private movieService: MovieService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  libraryMovies = []
  movies = []
  testLibraryMovies = TEST_LIBRARY_MOVIES
  isLibraryMoviesEmpty = false
  numberOfPages = 1
  numberOfResults = 0
  currentPage = 1
  hasSearchResults = false
  cardWidth = '130px'

  ngOnInit() {
    console.log('ngOnInit');
    // this.libraryMovies = this.testLibraryMovies

    this.getMoviesFromLibrary()
    // this.getMoviesFromLibrary2()
  }

  /**
   * Gets details of movie
   */
  getMovieDetails(imdbId) {
    console.log('getMovieDetails', imdbId);
    this.movieService.getMovieInfo(imdbId).subscribe(data => {
      console.log(data);
      this.movies.push(data)
    })
  }

  /**
   * Minimizes size of poster to download
   * @param poster old poster
   * @returns newPoster new Poster
   */
  minimizeMoviePoster(poster) {
    const newPoster = poster.replace(REGEX_IMAGE_SIZE, 'SX150.jpg')
    return newPoster
  }

  /**
   * Gets movies from library db
   */
  getMoviesFromLibrary() {
    this.ipcService.getMoviesFromLibrary()
    this.ipcService.libraryMovies.subscribe((value) => {
      if (value.length !== 0) {
        this.libraryMovies = value
        this.libraryMovies.forEach(libraryMovie => {
          console.log('ibraryMovies.forEach', libraryMovie);
          this.movies.push(libraryMovie)
        });
      }
      this.cdr.detectChanges()
    })
  }

  async getMoviesFromLibrary2() {
    // const result = await this.ipcService.getMoviesFromLibraryByPage(1)
    // console.log('getMoviesFromLibrary2 ', result);
    // // result.forEach(libraryMovie => {
    // //   console.log('ibraryMovies.forEach', libraryMovie);
    // //   this.movies.push(libraryMovie)
    // // });

    // this.movies.push(...result)
    // this.cdr.detectChanges()
  }

  /**
   * Selects movie and show a preview
   * @param movie movie to select
   */
  onSelect(movie) {
    console.log('selected movie: ', movie)
    // this.selectedMovie = movie;
    const highlightedId = movie.imdbId ? movie.imdbId : movie.tmdbId;
    this.dataService.updateHighlightedMovie(highlightedId);
    // this.navigationService.goToPage()
    this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });
  }

  /**
   * Gets the year.
   * @param releaseDate release date with format YYYY-MM-DD
   */
  getYear(releaseDate: string): string {
    return this.utilsService.getYear(releaseDate)
  }

  /**
   * Go to movie's details
   * @param movie movie to view
   */
  goToMovie(movie) {
    console.log(movie);
    this.router.navigate([`/details/${movie.imdbID}`], { relativeTo: this.activatedRoute });
  }
  getMoreResults() {
    this.currentPage++
    this.ipcService.getMoviesFromLibraryByPage(this.currentPage)
  }
  // async getMoreResults() {
  //   this.currentPage++
  //   const result = await this.ipcService.getMoviesFromLibraryByPage(this.currentPage)
  //   console.log('getMoreResults ', result);
  //   this.movies.push(...result)
  //   this.cdr.detectChanges()
  // }

  onHighlight() {

  }
}
