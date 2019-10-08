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
import { Router, ActivatedRoute } from '@angular/router'
import { Movie, Result, LibraryInfo, LibraryInfo2 } from '../../subject'
import { TMDB_SEARCH_RESULTS } from '../../mock-data'
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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  nameString = 'name'
  selectedMovies = []
  nowShowingMovies: Result[] = []
  topMoviesFromYear = []
  dashboardLists = []
  selectedMovie = null
  isHighlighted = false

  ngOnInit() {
    this.ipcService.libraryMovie.subscribe(value => {
      console.log('libraryMovie value', value)
      const data = value[0]
      // if (this.nowShowingMovies.length) {
      //   const findResult = this.nowShowingMovies.find(
      //     element =>
      //       element.title === data.title
      //     // (((element.title === data.title) ||
      //     //   (element.original_title === data.title)) &&
      //     //   parseInt(element.release_date) === data.year)
      //   )
      //   console.log('findResult', findResult)
      this.nowShowingMovies[0].isAvailable = true
      // }
      this.cdr.detectChanges()
    })

    if (this.dataService.hasDashboardData()) {
      this.dashboardLists = this.dataService.getDashboardData()
      console.log(this.dashboardLists)
    } else {
      // commented for test values only
      // this.getNowShowingMovies();
      // this.getTopMoviesFromYear();
      // commented for test values only

      this.nowShowingMovies = TMDB_SEARCH_RESULTS.results
      this.nowShowingMovies[this.nameString] = `Best of 1994`
      this.nowShowingMovies[2].isAvailable = true
      // this.nowShowingMovies.forEach(element => {
      //   const releaseYear = element.release_date.substring(0, element.release_date.indexOf('-'))
      //   const paramArray = [element.title, releaseYear]
      //   element.isAvailable = this.ipcService.getMovieFromLibrary(paramArray)
      // });
      this.dashboardLists.push(this.nowShowingMovies)
      const paramArray1 = ['The Shawshank Redemption', 1994]
      this.ipcService.getMovieFromLibrary(paramArray1)
      console.log('this.dashboardLists', this.dashboardLists)
      this.dataService.setDashboardData(this.dashboardLists)
    }

    this.ipcService.libraryFolders.subscribe(value => {
      // this.libraryFolders = value;
      console.log('dashboard libraryFolders', value)
      this.cdr.detectChanges()
    })
    $('[data-toggle="popover"]').popover()
    $('[data-toggle="tooltip"]').tooltip({ placement: 'top' })
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
    const today =
      sDate.getFullYear() +
      '-' +
      ('0' + (sDate.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + sDate.getDate()).slice(-2)
    sDate.setDate(sDate.getDate() - 21)
    const threeWeeksAgo =
      sDate.getFullYear() +
      '-' +
      ('0' + (sDate.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + sDate.getDate()).slice(-2)
    this.movieService.getMoviesByDates(threeWeeksAgo, today).subscribe(data => {
      this.nowShowingMovies = data.results
      this.nowShowingMovies[this.nameString] = `Movies in Theatres`
      this.dashboardLists.push(this.nowShowingMovies)
      this.dataService.addDashboardData(this.nowShowingMovies)
    })
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
    this.movieService.getTopMoviesByYear(randYear).subscribe(data => {
      this.topMoviesFromYear = data.results
      this.topMoviesFromYear[this.nameString] = `Top movies of ${randYear}`
      this.dashboardLists.push(this.topMoviesFromYear)
      this.dataService.addDashboardData(this.nowShowingMovies)
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
  onHighlight(movie: Movie) {
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
  onSelect(movie: Movie) {
    this.selectedMovie = movie
    this.movieService.getExternalId(movie.id).subscribe(data => {
      const highlightedId = data.imdb_id
      localStorage.setItem('imdb_id', highlightedId)
      this.dataService.updateHighlightedMovie(highlightedId)
      this.router.navigate([`/details/${highlightedId}`], {
        relativeTo: this.activatedRoute
      })
    })
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
}
