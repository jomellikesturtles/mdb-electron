import { Component, OnInit } from '@angular/core';
import { MovieService } from '@services/movie/movie.service';
import { DataService } from '@services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TmdbParameters, } from '@models/interfaces';
import { GENRES } from '@shared/constants';
import GeneralUtil from '@utils/general.util';
import { LoggerService } from '@core/logger.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private movieService: MovieService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loggerService: LoggerService
  ) { }

  browserConnection = navigator.onLine;
  dashboardLists = [];
  cardWidth = '130px';

  ngOnInit() {
    this.loggerService.log("HEY HEY HEY");
    this.getNowShowingMovies();
    this.getTopMoviesFromYear();
    this.getTopGenreMovie();
  }

  /**
   * Gets movies showing in theaters in current date
   */
  getNowShowingMovies() {
    const sDate = new Date();
    const today = sDate.getFullYear() + '-' + ('0' + (sDate.getMonth() + 1)).slice(-2) + '-' + ('0' + sDate.getDate()).slice(-2);
    sDate.setDate(sDate.getDate() - 21);
    const threeWeeksAgo = sDate.getFullYear() + '-' + ('0' + (sDate.getMonth() + 1)).slice(-2) +
      '-' + ('0' + sDate.getDate()).slice(-2);
    const paramMap = new Map<TmdbParameters, any>();
    paramMap.set(TmdbParameters.PrimaryReleaseDateGreater, threeWeeksAgo);
    paramMap.set(TmdbParameters.PrimaryReleaseDateLess, today);
    this.sendToMovieService(paramMap, `New Releases`);
  }

  /**
   * Gets top-rated movies from year
   */
  getTopMoviesFromYear() {
    const sDate = new Date();
    const minimumYear = 1940;
    const randYear = Math.round(
      Math.random() * ((sDate.getFullYear() - 1) - minimumYear) + minimumYear
    );
    const paramMap = new Map<TmdbParameters, any>();
    paramMap.set(TmdbParameters.PrimaryReleaseYear, randYear);
    this.sendToMovieService(paramMap, `Top movies of ${randYear}`);
  }

  /**
   * Gets top-rated movies by genre.
   */
  getTopGenreMovie() {
    const TMDB_GENRE_LENGTH = 19; // up to index 19 is valid tmdb genre
    const GENRE_INDEX = Math.floor(Math.random() * (TMDB_GENRE_LENGTH));
    const CHOSEN_GENRE = GENRES[GENRE_INDEX];
    const paramMap = new Map<TmdbParameters, any>();
    paramMap.set(TmdbParameters.WithGenres, CHOSEN_GENRE.id);
    this.sendToMovieService(paramMap, `Top ${CHOSEN_GENRE.name}`);
  }

  /**
   * Sends parameter to the API.
   * @param paramMap parameters map to pass to the API
   * @param listName the name of the list
   */
  async sendToMovieService(paramMap: Map<TmdbParameters, any>, listName: string) {
    const data = await this.movieService.getMoviesDiscover(paramMap, listName).toPromise();
    let mappedResults = data.results;
    const innerList = {
      name: listName,
      data: mappedResults,
      queryParams: paramMap
    };
    this.dashboardLists.push(innerList);
    this.dataService.addDashboardData(innerList.data);
    console.log('data:', data);
  }

  /**
   * Gets movies from library
   */
  getMoviesFromLibrary() {
    GeneralUtil.DEBUG.log('getMoviesFromLibrary dashboard.component');
  }

  /**
   * Goes to detail of the selected movie.
   * @param movie the movie selected
   */
  goToMovie(id: any) {
    const highlightedId = id;
    this.dataService.updateHighlightedMovie(highlightedId);
    this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });
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
  private sideScroll(element, direction, speed, distance, step) {
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

  /**
   * Gets the year.
   * @param releaseDate release date with format YYYY-MM-DD
   */
  getYear(releaseDate: string) {
    return GeneralUtil.getYear(releaseDate);
  }
}
