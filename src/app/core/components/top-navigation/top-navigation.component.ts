import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '@services/data.service';
import { MovieService } from '@services/movie/movie.service';
import { IpcService } from '@services/ipc.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationService } from '@core/services/navigation.service';
import { environment } from '@environments/environment';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ISearchQuery } from '@models/interfaces';
import { AuthenticationService } from "@services/authentication.service";
import { Actions, ofActionDispatched } from "@ngxs/store";
import { Login } from "app/store/auth/auth.state";
import { MockDataService } from '@services/mock-data.service';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent implements OnInit {
  @Input() data: Observable<any>;
  @Output() toggleSidebar = new EventEmitter<void>();
  @ViewChild('searchBar') searchBar: ElementRef;

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === '/') {
      event.preventDefault();
      if (this.searchBar) {
        this.searchBar.nativeElement.focus();
      }
    }
  }

  constructor(
    private dataService: DataService,
    private ipcService: IpcService,
    private movieService: MovieService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private $actions: Actions,
    private navigationService: NavigationService,
    private mockDataService: MockDataService
  ) { }

  isElectron = environment.runConfig.electron;
  status = 'LOGIN';
  browserConnection = navigator.onLine;
  currentYear = new Date().getFullYear();
  genres = ['Action', 'Adventure', 'Documentary', 'Drama', 'Horror', 'Sci-Fi', 'Thriller'];
  types = ['TV Series', 'Movie', 'Short'];
  searchQuery: ISearchQuery = {
    query: '',
    yearFrom: 1969,
    yearTo: 2018,
    genres: [],
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
    this.mockDataService.getMovieGenres().subscribe(genres => {
      this.searchQuery.genres = genres;
    });

    this.$actions.pipe(ofActionDispatched(Login)).subscribe((e) => {
      this.isSignedIn = true;
      this.status = "";
    });
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
      map(value => {
        this.searchQuery.query = value;
        return this._filter(value || '');
      })
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.searchHistoryList.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  getSearchHistoryList() {
    const history = localStorage.getItem('mdb_search_history');
    if (history) {
      this.searchHistoryList = JSON.parse(history);
    } else {
      this.searchHistoryList = ['gladiator', 'titanic', 'pulp fiction']; // Default suggestions
    }
  }

  /**
   * Go to previous location
   */
  navigateBack() {
    this.navigationService.back();
  }

  /**
   * Opens advanced search options.
   */
  onAdvancedSearch() {
    this.router.navigate(['/advanced-find']);
  }

  /**
   * Initialize search
   */
  onSearch(val: string) {
    if (!val || !val.trim()) {
      return;
    }
    val = val.trim();
    this.searchQuery.query = val;

    if (this.lastQuery === val && this.router.url === '/results') {
      return;
    }
    this.lastQuery = val;

    // Update search history: move to front and maintain max length
    this.searchHistoryList = this.searchHistoryList.filter(q => q.toLowerCase() !== val.toLowerCase());
    this.searchHistoryList.unshift(val);
    if (this.searchHistoryList.length > this.SEARCH_HISTORY_MAX_LENGTH) {
      this.searchHistoryList = this.searchHistoryList.slice(0, this.SEARCH_HISTORY_MAX_LENGTH);
    }
    localStorage.setItem('mdb_search_history', JSON.stringify(this.searchHistoryList));
    this.myControl.setValue(val, { emitEvent: false });
    this.searchByTitle(val);

  }

  /**
   * Searches by title
   * @param enteredQuery query to search
   */
  searchByTitle(enteredQuery: string) {
    this.searchQuery.query = enteredQuery;
    if (this.searchQuery.query.length > 0) {
      this.dataService.updateSearchQuery(this.searchQuery);
      this.router.navigate(['/results']);
    }
  }

  goToProfile() {
    this.router.navigate(['/user/profile']);
  }

  goToSettings() {
    this.router.navigate(['/preferences']);
  }

  signOut() {
    localStorage.removeItem('user');
    this.authService.logout().subscribe((e) => {
      this.isSignedIn = false;
      this.status = "LOGIN";
      this.router.navigate(["/user/signin"]);
    });
  }

  signIn() {
    this.router.navigate(['/user/signin']);
  }

  goToHelp() {
    console.log('Navigate to Help');
  }

  goToAbout() {
    console.log('Navigate to About');
  }

  sendFeedback() {
    console.log('Navigate to Send Feedback');
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
}
