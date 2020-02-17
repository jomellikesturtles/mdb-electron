import { Component, OnInit, ChangeDetectorRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { TEST_LIBRARY_MOVIES, TMDB_SEARCH_RESULTS } from '../../mock-data'
import { Router, ActivatedRoute } from '@angular/router'
import { STRING_REGEX_IMAGE_SIZE } from '../../constants';
import { DataService } from '../../services/data.service';
import { IpcService, IpcCommand } from '../../services/ipc.service';
import { MovieService } from '../../services/movie.service';
import { Observable } from 'rxjs'
import { UtilsService } from '../../services/utils.service';
import { Select, Store } from '@ngxs/store'

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryComponent implements OnInit {

  @Input() data: Observable<any>
  @Select(state => state.moviesList) moviesList$

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
  isFetchingData = false

  ngOnInit() {
    console.log('ngOnInit');
    // this.libraryMovies = this.testLibraryMovies

    this.getMoviesFromLibrary()
    // this.getMoviesFromLibrary2()
  }

  /**
   * Minimizes size of poster to download
   * @param poster old poster
   * @returns newPoster new Poster
   */
  minimizeMoviePoster(poster) {
    const REGEX_IMAGE_SIZE = new RegExp(STRING_REGEX_IMAGE_SIZE, `gi`)
    const newPoster = poster.replace(REGEX_IMAGE_SIZE, 'SX150.jpg')
    return newPoster
  }

  /**
   * Gets movies from library db
   */
  getMoviesFromLibrary() {
    this.libraryMovies = TMDB_SEARCH_RESULTS.results
    // commented for TEST
    // this.ipcService.getMoviesFromLibrary()
    // this.isFetchingData = true
    // this.ipcService.libraryMovies.subscribe((value) => {
    //   if (value.length !== 0) {
    //     this.libraryMovies = value
    //     this.libraryMovies.forEach(libraryMovie => {
    //       console.log('ibraryMovies.forEach', libraryMovie);
    //       this.movies.push(libraryMovie)
    //     });
    //   }
    //   this.isFetchingData = false
    //   this.cdr.detectChanges()
    // })
    // end of commented for TEST
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

  getMoreResults() {
    this.currentPage++
    this.ipcService.getMoviesFromLibraryByPage(this.currentPage)
    this.isFetchingData = true
  }

  // async getMoreResults() {
  //   this.currentPage++
  //   const result = await this.ipcService.getMoviesFromLibraryByPage(this.currentPage)
  //   console.log('getMoreResults ', result);
  //   this.movies.push(...result)
  //   this.cdr.detectChanges()
  // }

  onScanLibrary() {
    this.ipcService.call(IpcCommand.ScanLibrary)
  }
}
