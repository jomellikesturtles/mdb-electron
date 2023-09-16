
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieGenre, IGenre } from '@models/interfaces';
import { MOVIEGENRES } from '../../../mock-data';
import { STRING_REGEX_IMDB_ID } from '@shared/constants';
import { DataService } from '@services/data.service';
import { MovieService } from '@services/movie/movie.service';
import { IpcService } from '@services/ipc.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '@environments/environment';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import GeneralUtil from '@utils/general.util';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent implements OnInit {
  @Input() data: Observable<any>;
  constructor(
    private dataService: DataService,
    private ipcService: IpcService,
    private movieService: MovieService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location) { }

  isElectron = environment.runConfig.isElectron;
  status = 'LOGIN';
  browserConnection = navigator.onLine;
  currentYear = new Date().getFullYear();
  genres = ['Action', 'Adventure', 'Documentary', 'Drama', 'Horror', 'Sci-Fi', 'Thriller'];
  types = ['TV Series', 'Movie', 'Short'];
  searchQuery: ISearchQuery = {
    query: '',
    yearFrom: 1969,
    yearTo: 2018,
    genres: MOVIEGENRES,
    type: 'TV Series',
    isAvailable: 'true',
    availability: '',
    sortBy: ''
  };
  selectedMovies = [];
  isHighlighted = false;
  numberOfPages = 1;
  numberOfResults = 0;
  currentPage = 1;
  currentSearchQuery = '';
  hasSearchResults = false;
  searchHistoryList = [];
  filteredOptions: Observable<string[]>;
  SEARCH_HISTORY_MAX_LENGTH = 8;
  voteAverageList = [];
  isSignedIn = false;
  lastQuery = '';

  myControl = new FormControl();
  ngOnInit() {
    const e = localStorage.getItem('user');
    this.getSearchHistoryList();
    if (e === null) {
      this.status = 'LOGIN';
      this.isSignedIn = false;
    } else {
      this.isSignedIn = true;
      this.status = '';
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.searchHistoryList.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  getSearchHistoryList() {
    this.searchHistoryList = ['titanic', 'enteng kabisote'];
    // })
    // this.ipcService.call(this.ipcService.IPCCommand.GetSearchList)
    // this.ipcService.searchList.subscribe(data => {
    //   this.searchHistoryList = data
    //   GeneralUtil.DEBUG.log('DATA:', data)
    // })
  }

  /**
   * Go to previous location
   */
  navigateBack() {
    this.location.back();
  }

  /**
   * Opens advanced search options.
   */
  onAdvancedSearch() {
    this.router.navigate([`/advanced-find`], { relativeTo: this.activatedRoute });
  }

  /**
   * Initialize search
   */
  onSearch(val: string) {
    val = val.trim();
    if (this.lastQuery === val && this.router.url === '/results') {
      return;
    }
    this.lastQuery = val;
    this.searchHistoryList.unshift(val);
    this.removeDuplicate(val);
    this.searchHistoryList.splice(this.searchHistoryList.indexOf(val), 1);
    GeneralUtil.DEBUG.log(this.searchHistoryList);
    if (this.searchHistoryList.length >= this.SEARCH_HISTORY_MAX_LENGTH) {
      // this.searchHistoryList = this.searchHistoryList.splice(1)
      this.searchHistoryList = this.searchHistoryList.slice(0, this.SEARCH_HISTORY_MAX_LENGTH);
    }
    const enteredQuery = val;
    // this.currentPage = 1
    // this.numberOfPages = 1
    // this.numberOfResults = 0
    // this.currentSearchQuery = enteredQuery
    // // tt0092099 example

    this.searchHistoryList.unshift(val);
    const REGEX_IMDB_ID = new RegExp(STRING_REGEX_IMDB_ID, `gi`);
    if (enteredQuery.match(REGEX_IMDB_ID)) {
      this.searchByImdbId(enteredQuery);
    } else {
      this.searchByTitle(enteredQuery);
    }
  }

  /**
   * Searches movie by imdb id and redirects if there are results
   * @param imdbId imdb id to search
   */
  searchByImdbId(imdbId: string) {
    this.movieService.getMovieByImdbId(imdbId).subscribe(data => {
      if (data.Response !== 'False') {
        this.router.navigate([`/details/${imdbId}`], { relativeTo: this.activatedRoute });
      } else {
        this.hasSearchResults = false;
        // insert code for not found
      }
    });
  }

  /**
   * Searches by title
   * @param enteredQuery query to search
   */
  searchByTitle(enteredQuery: string) {
    // this.dataService.currentSearchQuery = enteredQuery
    if (this.searchQuery && this.searchQuery.query.length > 0) {
      this.dataService.updateSearchQuery(this.searchQuery);
      this.router.navigate([`/results`], { relativeTo: this.activatedRoute });
    }
  }

  openProfile() {

  }

  signOut() {
    // this.firebaseService.signOut()
  }

  onMinimize() {
    this.ipcService.minimizeWindow();
  }
  onRestore() {
    this.ipcService.minimizeRestoreWindow();
  }
  onExit() {
    this.ipcService.exitApp();
  }

  private removeDuplicate(val: string) {
    let result = this.searchHistoryList.filter((option, index) => {
      GeneralUtil.DEBUG.log('option: ', option);
      return this.searchHistoryList.indexOf(option) === index;
    });
    this.searchHistoryList = result;
  }
}

export interface ISearchQuery {
  query: string,
  yearFrom: number,
  yearTo: number,
  genres: MovieGenre[],
  type: string,
  isAvailable: string,
  availability: string, // all, offline, netflix
  ratingCount?: number,
  ratingAverage?: number,
  ratingAverageFrom?: number,
  ratingAverageTo?: number,
  sortBy: string,
}

export interface ITmdbSearchQuery {
  keywords: string,
  decade: number;
  yearTo: number,
  genres: IGenre[],
}
