// tslint:disable-next-line: semicolon
import { Component, OnInit } from '@angular/core';
import { TorrentService } from '../../services/torrent.service'
import { MovieService } from '../../services/movie.service'
import { DataService } from '../../services/data.service'
import { IpcService } from '../../services/ipc.service'
import { Router, ActivatedRoute } from '@angular/router'
import { catchError, map, tap, retry } from 'rxjs/operators'
declare var jquery: any
declare var $: any
import { Movie } from '../../subject'
import * as subjects from '../../mock-data'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  browserConnection = navigator.onLine;
  constructor(
    private torrentService: TorrentService,
    private dataService: DataService,
    private movieService: MovieService,
    private ipcService: IpcService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  nameString = 'name'
  selectedMovies = []
  nowShowingMovies = []
  topMoviesFromYear = []
  dashboardLists = []
  selectedMovie;
  isHighlighted = false

  ngOnInit() {
    this.getNowShowingMovies()
    this.getTopMoviesFromYear()
    this.getMoviesFromLibrary()
    $('[data-toggle="tooltip"]').tooltip();
  }

  /**
   * Downloads highlighted/selected movies
   */
  onDownloadSelected() {
    this.dataService.updateSelectedMovies(this.selectedMovies)
    this.router.navigate([`/bulk-download`], { relativeTo: this.activatedRoute });
  }

  /**
   * Clears highlighted/selected movies
   */
  onClearSelected() {
    this.selectedMovies.forEach(element => {
      element.isHighlighted = false
    });
    this.selectedMovies = []
  }

  /**
   * Gets movies showing in theaters in current date
   */
  getNowShowingMovies() {
    const sDate = new Date()
    const today = sDate.getFullYear() + '-' + ('0' + (sDate.getMonth() + 1)).slice(-2) + '-'
      + ('0' + sDate.getDate()).slice(-2);
    sDate.setDate(sDate.getDate() - 21)
    const threeWeeksAgo = sDate.getFullYear() + '-' + ('0' + (sDate.getMonth() + 1)).slice(-2) + '-'
      + ('0' + sDate.getDate()).slice(-2);
    this.movieService.getMoviesByDates(threeWeeksAgo, today).subscribe(data => {
      this.nowShowingMovies = data.results;
      this.nowShowingMovies[this.nameString] = `Movies in Theatres`
      this.dashboardLists.push(this.nowShowingMovies)
    })
  }

  /**
   * Gets top-rated movies from year
   */
  getTopMoviesFromYear() {
    const sDate = new Date()
    const minimumYear = 1960
    const randYear = Math.round(Math.random() * (sDate.getFullYear() - minimumYear) + minimumYear)
    this.movieService.getTopMoviesByYear(randYear).subscribe(data => {
      this.topMoviesFromYear = data.results;
      this.topMoviesFromYear[this.nameString] = `Top movies of ${randYear}`
      this.dashboardLists.push(this.topMoviesFromYear)
    })
  }

  /**
   * Gets movies from library
   */
  getMoviesFromLibrary() {
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
        return value != movie;
      })
    }
  }
  /**
   * Goes to detail of the selected movie.
   * @param movie the movie selected
   */
  onSelect(movie: Movie) {
    this.selectedMovie = movie;
    this.movieService.getExternalId(movie.id).subscribe(data => {
      const highlightedId = data.imdb_id;
      localStorage.setItem('imdb_id', highlightedId);
      this.dataService.updateHighlightedMovie(highlightedId);
      this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });
    })
  }

  scrollPrev() {
    const container = document.getElementById('topMoviesFromYearPanel');
    this.sideScroll(container, 'left', 25, 100, 10);
  }
  scrollNext() {
    const container = document.getElementById('topMoviesFromYearPanel');
    this.sideScroll(container, 'right', 25, 100, 10);
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
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
      if (direction === 'left') {
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      scrollAmount += step;
      if (scrollAmount >= distance) {
        window.clearInterval(Number(slideTimer));
      }
    }, speed);
  }
}
