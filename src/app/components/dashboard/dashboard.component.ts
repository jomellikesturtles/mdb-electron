import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  ChangeDetectionStrategy
} from '@angular/core'
import { Observable } from 'rxjs'
import { TorrentService } from '../../services/torrent.service'
import { MovieService } from '../../services/movie.service'
import { DataService } from '../../services/data.service'
import { IpcService } from '../../services/ipc.service'
import { UtilsService } from '../../services/utils.service'
import { Router, ActivatedRoute } from '@angular/router'
import { ITmdbResult, ILibraryInfo, TmdbParameters } from '../../interfaces'
import { TMDB_SEARCH_RESULTS } from '../../mock-data'
import { utils } from 'protractor'
declare var $: any

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  @Input() data: Observable<any>

  browserConnection = navigator.onLine
  constructor(
    private dataService: DataService,
    private movieService: MovieService,
    private ipcService: IpcService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  nameString = 'name'
  selectedMovies = []
  nowShowingMovies: ITmdbResult[] = []
  topMoviesFromYear = []
  dashboardLists = []
  selectedMovie = null
  isHighlighted = false
  cardWidth = '130px'
  ngOnInit() {

    this.nowShowingMovies = TMDB_SEARCH_RESULTS.results
    this.nowShowingMovies[this.nameString] = `Best of 1994`
    this.dashboardLists.push(this.nowShowingMovies)
    // this.getNowShowingMovies()
    // this.getTopMoviesFromYear()
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
    $('[data-toggle="popover"]').popover()
    $('[data-toggle="tooltip"]').tooltip({ placement: 'top' })
  }

  async getAvailability() {
    for (const element of this.nowShowingMovies) {
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
   * Clears highlighted/selected movies
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
    this.sendToMovieService(params, `Movies in Theatres`)
  }

  /**
   * Gets top-rated movies from year
   */
  getTopMoviesFromYear() {
    const sDate = new Date()
    const minimumYear = 1960
    const randYear = Math.round(
      Math.random() * (sDate.getFullYear() - minimumYear) + minimumYear
    )
    const params = [
      [TmdbParameters.PrimaryReleaseYear, randYear.toString()]
    ]
    this.sendToMovieService(params, `Top movies of ${randYear}`)
  }

  sendToMovieService(params: any, title: string) {
    this.movieService.getMoviesDiscover(params).subscribe(data => {
      const innerList = data.results
      innerList[this.nameString] = title
      this.dashboardLists.push(innerList)
      this.dataService.addDashboardData(innerList)
      this.cdr.detectChanges()
    })
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
    } else {
      this.selectedMovies = this.selectedMovies.filter((value, index, arr) => {
        return value != movie
      })
    }
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
