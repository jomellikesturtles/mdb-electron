
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs'
import { IOmdbMovieDetail, MovieGenre, IGenre } from '../../interfaces';
import { MOVIES, MOVIEGENRES } from '../../mock-data';
import { DECADES, GENRES, STRING_REGEX_IMDB_ID } from '../../constants';
import { DataService } from '../../services/data.service'
import { MovieService } from '../../services/movie.service'
import { IpcService } from '../../services/ipc.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { Store, Select } from '@ngxs/store'
import { Add, CountState, UserState } from '../../app.state'
import { FirebaseService } from '../../services/firebase.service';
import { SetUser } from '../../app.actions';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

enum STATUS {
  login = 'LOGIN',
  logout = 'LOGOUT'
}

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent implements OnInit {
  @Input() data: Observable<any>
  @Select(CountState) count$: Observable<number>
  @Select(state => state.UserState) user$: Observable<any>
  constructor(
    private dataService: DataService,
    // private firebaseService: FirebaseService,
    private ipcService: IpcService,
    private movieService: MovieService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private store: Store) { }

  isElectron = environment.runConfig.electron != null ? true : false
  status = 'LOGIN'
  browserConnection = navigator.onLine;
  selectedMovie: IOmdbMovieDetail
  numbers;
  currentYear = new Date().getFullYear()
  genres = ['Action', 'Adventure', 'Documentary', 'Drama', 'Horror', 'Sci-Fi', 'Thriller'];
  movieGenres = MOVIEGENRES;
  types = ['TV Series', 'Movie', 'Short'];
  searchQuery: ISearchQuery = {
    query: '',
    startYear: 1969,
    endYear: 2018,
    genres: this.movieGenres,
    type: 'TV Series',
    isAvailable: 'true'
  };
  movies = MOVIES;
  selectedMovies = []
  isHighlighted = false
  numberOfPages = 1
  numberOfResults = 0
  currentPage = 1
  currentSearchQuery = ''
  hasSearchResults = false
  isSearchDirty = false
  searchHistoryList = []
  searchHistoryMaxLength = 8
  decadesList = []
  genresList = GENRES
  voteCountList = VOTE_COUNT
  voteAverageList = []
  isSignedIn = false
  lastQuery = ''

  ngOnInit() {
    const e = localStorage.getItem('user')
    // this.user$.pipe(delay(1000)).subscribe(e => {
    if (e === null) {
      this.status = 'LOGIN'
      this.isSignedIn = false
    } else {
      this.isSignedIn = true
      this.status = ''
    }
    // })
    this.ipcService.call(this.ipcService.IPCCommand.GetSearchList)
    this.ipcService.searchList.subscribe(data => {
      this.searchHistoryList = data
      console.log('DATA:', data)
    })
  }

  initializeAdvancedSearchCriteria() {
    for (let index = 1; index <= 10; index++) {
      this.voteAverageList.push({
        label: `+${index}`,
        value: index
      });
    }
    for (let index = 1910; index <= (new Date).getFullYear(); index += 10) {
      this.decadesList.push({
        display: `${index}s`,
        value: index
      });
    }
  }

  /**
   * Go to previous location
   */
  navigateBack() {
    this.location.back()
  }

  /**
   * Opens advanced search options.
   */
  onAdvancedSearch() {

  }
  goAdvancedSearch() { }

  clearAdvancedSearch() {

  }
  /**
   * Initialize search
   */
  onSearch(val: string) {
    val = val.trim()
    if (this.lastQuery === val && this.router.url === '/results') {
      return
    }
    this.lastQuery = val
    this.searchHistoryList.unshift(val)
    this.searchHistoryList.splice(this.searchHistoryList.indexOf(val), 1)
    console.log(this.searchHistoryList);
    if (this.searchHistoryList.length >= this.searchHistoryMaxLength) {
      // this.searchHistoryList = this.searchHistoryList.splice(1)
      this.searchHistoryList = this.searchHistoryList.slice(0, this.searchHistoryMaxLength)
    }
    const enteredQuery = val
    // this.isSearchDirty = true
    // this.currentPage = 1
    // this.numberOfPages = 1
    // this.numberOfResults = 0
    // this.currentSearchQuery = enteredQuery
    // // tt0092099 example

    const REGEX_IMDB_ID = new RegExp(STRING_REGEX_IMDB_ID, `gi`)
    if (enteredQuery.match(REGEX_IMDB_ID)) {
      this.searchByImdbId(enteredQuery)
    } else {
      this.searchByTitle(enteredQuery)
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
        this.hasSearchResults = false
        // insert code for not found
      }
    })
  }

  /**
   * Searches by title
   * @param enteredQuery query to search
   */
  searchByTitle(enteredQuery: string) {
    // this.dataService.currentSearchQuery = enteredQuery
    if (this.searchQuery && this.searchQuery.query.length > 0) {
      this.dataService.updateSearchQuery(this.searchQuery)
      this.router.navigate([`/results`], { relativeTo: this.activatedRoute });
    }
  }

  openProfile() {

  }

  signOut() {
    // this.firebaseService.signOut()
  }

  changeCredentialState(actionName: string) {
    this.user$.subscribe(e => {
      // console.log('user$', user$);
      // this.store.dispatch(new SetUser())
    })
    // if (actionName === STATUS.login) {
    //   this.status = STATUS.logout
    // }
  }

  onMinimize() {
    this.ipcService.call(this.ipcService.IPCCommand.MinimizeApp)
  }
  onRestore() {
    this.ipcService.call(this.ipcService.IPCCommand.RestoreApp)
  }
  onExit() {
    this.ipcService.call(this.ipcService.IPCCommand.ExitApp)
  }
}

export interface ISearchQuery {
  query: string,
  startYear: number,
  endYear: number,
  genres: MovieGenre[],
  type: string,
  isAvailable: string
}

export interface ITmdbSearchQuery {
  keywords: string,
  decade: number
  endYear: number,
  genres: IGenre[],
}

const VOTE_COUNT = [
  {
    label: '100',
    value: 100
  },
  {
    label: '+1,000',
    value: 1000
  },
  {
    label: '+10,000',
    value: 10000
  },
  {
    label: '+100,000',
    value: 100000
  },
  {
    label: '+1,000,000',
    value: 1000000
  },
  {
    label: '+10,000,000',
    value: 10000000
  },
]
