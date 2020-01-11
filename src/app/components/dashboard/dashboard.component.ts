import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core'
import { Observable } from 'rxjs'
import { TorrentService } from '../../services/torrent.service'
import { MovieService } from '../../services/movie.service'
import { DataService } from '../../services/data.service'
import { IpcService } from '../../services/ipc.service'
import { UtilsService } from '../../services/utils.service'
import { Router, ActivatedRoute } from '@angular/router'
import { ITmdbResult, ILibraryInfo, TmdbParameters, GenreCodes } from '../../interfaces'
import { TMDB_SEARCH_RESULTS } from '../../mock-data'
import { GENRES } from '../../constants'
import { Select, Store } from '@ngxs/store'
import { AddMovie, RemoveMovie } from '../../movie.actions'
import { SelectedMoviesState } from '../../movie.state'
import { SelectedMovie } from '../bulk-download/bulk-download.component'
import { DomSanitizer } from '@angular/platform-browser'
import { BookmarkService } from '../../services/bookmark.service'
declare var $: any

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DashboardComponent implements OnInit {
  @Input() data: Observable<any>
  @Select(state => state.moviesList) moviesList$

  browserConnection = navigator.onLine
  nameString = 'name'
  selectedMovies = []
  sampleListMovies: ITmdbResult[] = []
  topMoviesFromYear = []
  dashboardLists = []
  selectedMovie = null
  selectedMovieBookmarkStatus = false
  isHighlighted = false
  cardWidth = '130px'
  clipSrc = null

  constructor(
    private bookmarkService: BookmarkService,
    private dataService: DataService,
    private movieService: MovieService,
    private ipcService: IpcService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
    private store: Store
  ) { }

  ngOnInit() {
    this.sampleListMovies = TMDB_SEARCH_RESULTS.results
    this.sampleListMovies[this.nameString] = `Sample Data`
    this.dashboardLists.push(this.sampleListMovies)
    this.getNowShowingMovies()
    this.getTopMoviesFromYear()
    // this.getTopGenreMovie()
    this.getAvailability()

    // COMMENTED FOR TEST DATA ONLY
    // this.ipcService.libraryMovie.subscribe(value => {
    //   console.log('libraryMovie value', value)
    //   const data = value[0]
    //   // if (this.nowShowingMovies.length) {
    //   //   const findResult = this.nowShowingMovies.find(
    //   //     element =>
    //   //       element.title === data.title
    //   //     // (((element.title === data.title) ||
    //   //     //   (element.original_title === data.title)) &&
    //   //     //   parseInt(element.release_date) === data.year)
    //   //   )
    //   console.log('setting availability')
    //   this.nowShowingMovies[0].isAvailable = true
    //   console.log('setting availability')
    //   // }
    //   this.cdr.detectChanges()
    // })

    // if (this.dataService.hasDashboardData()) {
    //   this.dashboardLists = this.dataService.getDashboardData()
    //   console.log(this.dashboardLists)
    // } else {
    //   // commented for test values only
    //   // this.getNowShowingMovies();
    //   // this.getTopMoviesFromYear();
    //   // commented for test values only

    this.ipcService.libraryFolders.subscribe(value => {
      console.log('dashboard libraryFolders', value)
      this.cdr.detectChanges()
    })

    /**
     * TODO: move/add code to dashboard list update (when another list is added or lazy loading).
     */
    this.moviesList$.subscribe(e => {
      if (e.change === 'add') {
        this.dashboardLists.forEach(list => {
          list.forEach(element => {
            if (e.idChanged === element.id) {
              element.isHighlighted = true
            }
          })
        })
      } else if (e.change === 'remove') {
        this.dashboardLists.forEach(list => {
          list.forEach(element => {
            if (e.idChanged === element.id) {
              element.isHighlighted = false
            }
          })
        })
      } else if (e.change === 'clear') {
        this.dashboardLists.forEach(list => {
          list.forEach(element => {
            element.isHighlighted = false
          })
        })
      }
    })

    $('[data-toggle="popover"]').popover()
    $('[data-toggle="tooltip"]').tooltip({ placement: 'top' })
  }

  /**
   * Gets the availability of movies in the dashboard.
   */
  async getAvailability() {
    for (const element of this.sampleListMovies) {
      const result = await this.ipcService.getMovieFromLibrary(element.id)
      if (result) {
        element.isAvailable = true
      }
    }
    this.cdr.detectChanges()
  }

  /**
   * Downloads highlighted/selected movies
   */
  onDownloadSelected() {
    this.dataService.updateSelectedMovies(this.selectedMovies)
    this.router.navigate([`/bulk-download`], {
      relativeTo: this.activatedRoute
    })
  }

  /**
   * Clears highlighted/selected movies.
   * TODO: Remove. It is alredy in the selected-movies component.
   */
  onClearSelected() {
    this.selectedMovies.forEach(element => {
      element.isHighlighted = false
    })
    this.selectedMovies = []
  }

  /**
   * Gets movies showing in theaters in current date
   */
  getNowShowingMovies() {
    const sDate = new Date()
    const today = sDate.getFullYear() + '-' + ('0' + (sDate.getMonth() + 1)).slice(-2) + '-' + ('0' + sDate.getDate()).slice(-2)
    sDate.setDate(sDate.getDate() - 21)
    const threeWeeksAgo = sDate.getFullYear() + '-' + ('0' + (sDate.getMonth() + 1)).slice(-2) +
      '-' + ('0' + sDate.getDate()).slice(-2)
    const params = [
      [TmdbParameters.PrimaryReleaseDateGreater, threeWeeksAgo],
      [TmdbParameters.PrimaryReleaseDateLess, today]
    ]
    this.sendToMovieService(params, `New Releases`)
  }

  /**
   * Gets top-rated movies from year
   */
  getTopMoviesFromYear() {
    const sDate = new Date()
    const minimumYear = 1940
    const randYear = Math.round(
      Math.random() * ((sDate.getFullYear() - 1) - minimumYear) + minimumYear
    )
    const params = [[TmdbParameters.PrimaryReleaseYear, randYear]]
    this.sendToMovieService(params, `Top movies of ${randYear}`)
  }

  /**
   * Gets top-rated movies by genre.
   */
  getTopGenreMovie() {
    const TMDB_GENRE_LENGTH = 19 // up to index 19 is valid tmdb genre
    const GENRE_INDEX = Math.floor(Math.random() * (TMDB_GENRE_LENGTH))
    const CHOSEN_GENRE = GENRES[GENRE_INDEX]
    const params = [
      [TmdbParameters.WithGenres, CHOSEN_GENRE.id]
    ]
    this.sendToMovieService(params, `Top ${CHOSEN_GENRE.name}`)
  }

  /**
   * Sends parameter to the API.
   * @param params parameters to pass to the API
   * @param title the title of the list
   */
  async sendToMovieService(params: any, title: string) {
    const data = await this.movieService.getMoviesDiscover(params).toPromise()
    console.log('subss results', data)

    const innerList = data.results
    innerList[this.nameString] = title
    this.dashboardLists.push(innerList)
    this.dataService.addDashboardData(innerList)
    this.cdr.detectChanges()
  }

  /**
   * Gets movies from library
   */
  getMoviesFromLibrary() {
    console.log('getMoviesFromLibrary dashboard.component')
    this.ipcService.getMoviesFromLibrary()
  }

  /**
   * Adds movie object to the selected movies list
   * @param movie current selected movie
   */
  onHighlight(movie: any) {
    movie.isHighlighted = !movie.isHighlighted
    if (movie.isHighlighted) {
      this.selectedMovies.push(movie)
      this.store.dispatch(new AddMovie(movie))
    } else {
      this.selectedMovies = this.selectedMovies.filter((value, index, arr) => {
        return value !== movie
      })
      this.store.dispatch(new RemoveMovie(movie))
    }
  }

  /**
   * Performs actions for selected movie.
   * @param movie the selected movie
   */
  onSelect(movie: any) {
    const results = []
    this.selectedMovie = movie
    let title = movie.title.toLowerCase()
    const query = `${movie.title} ${this.getYear(movie.release_date)}`
    title = title.replace(/[.…]+/g, '')
    this.movieService.getRandomVideoClip(query).subscribe(data => {
      data.forEach(element => {
        const snipTitle = $.parseHTML(element.snippet.title.toLowerCase())[0].textContent
        if ((snipTitle.indexOf(title) >= 0) && ((snipTitle.indexOf('scene') >= 0) || (snipTitle.indexOf('trailer') >= 0) || (snipTitle.indexOf('movie clip') >= 0)) && (snipTitle.indexOf('behind the scene') === -1)) {
          results.push({ title: snipTitle, videoId: element.id.videoId })
        }
      })
      // LHAQjlufY0A
      // HiN6Ag5-DrU?VQ=HD720
      console.log('clips list length: ', results.length);
      const index = Math.round(Math.random() * (results.length - 1))
      console.log('clip index: ', index, results[index]);
      this.clipSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${results[index].videoId}?VQ=HD720&autoplay=1&rel=1&controls=0&disablekb=1&fs=0&modestbranding=1`)
      this.cdr.detectChanges();
    })
    this.getBookmarkStatus(movie.id)
  }

  /**
   * Gets the bookmark status of the selected movie.
   * @param id tmdb id to get the bookmark status
   */
  getBookmarkStatus(id: number) {
    this.bookmarkService.getBookmark(id).then(e => {
      if (e !== null) {
        this.selectedMovieBookmarkStatus = true
      } else {
        this.selectedMovieBookmarkStatus = false
      }
      this.cdr.detectChanges();
    })
  }

  /**
   * Converts genre code into its genre name equivalent.
   * @param genreCode genre code origin
   * @returns genre name
   */
  getGenre(genreCode: number) {
    return GenreCodes[genreCode]
  }

  /**
   * Goes to detail of the selected movie.
   * @param movie the movie selected
   */
  goToMovie(id: any) {
    const highlightedId = id;
    this.dataService.updateHighlightedMovie(highlightedId);
    this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });

    // below is for imdb id, but we will settle for tmdb id for now
    // this.selectedMovie = movie
    // this.movieService.getExternalId(movie.id).subscribe(data => {
    //   const highlightedId = data.imdb_id
    //   localStorage.setItem('imdb_id', highlightedId)
    //   this.dataService.updateHighlightedMovie(highlightedId)
    //   this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute })
    // })
  }

  toggleBookmark(id: number) {
    // if (this.selectedMovieBookmarkStatus === false) {
    this.bookmarkService.saveBookmark(id)
    // } else {
    //   this.bookmarkService.removeBookmark(id)
    // }
  }

  goToGenre(val) {
    this.dataService.updateDiscoverQuery(['genre', val])
    this.router.navigate([`/discover`], { relativeTo: this.activatedRoute });
  }

  scrollPrev() {
    const container = document.getElementById('topMoviesFromYearPanel')
    this.sideScroll(container, 'left', 25, 100, 10)
  }
  scrollNext() {
    const container = document.getElementById('topMoviesFromYearPanel')
    this.sideScroll(container, 'right', 25, 100, 10)
  }

  /**
   * The side scroll by button.
   * @param element the element
   * @param direction left or right
   * @param speed how fast
   * @param distance how far
   * @param step step
   */
  sideScroll(element, direction, speed, distance, step) {
    let scrollAmount = 0
    const slideTimer = setInterval(() => {
      if (direction === 'left') {
        element.scrollLeft -= step
      } else {
        element.scrollLeft += step
      }
      scrollAmount += step
      if (scrollAmount >= distance) {
        window.clearInterval(Number(slideTimer))
      }
    }, speed)
  }

  /**
   * Gets the year.
   * @param releaseDate release date with format YYYY-MM-DD
   */
  getYear(releaseDate: string) {
    return this.utilsService.getYear(releaseDate)
  }
}
