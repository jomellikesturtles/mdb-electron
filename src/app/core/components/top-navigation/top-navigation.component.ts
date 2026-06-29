import { Component, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { IpcService } from '@services/ipc.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import { map, startWith, filter } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ISearchQuery } from '@models/interfaces';
import { Actions, ofActionDispatched } from "@ngxs/store";
import { Login } from "app/store/auth/auth.state";
import { AuthenticationService, DataService } from '@services';
import { NavigationService } from '@core/services/navigation.service';
import { MockDataService } from '@services/mock-data.service';
import { MatDialog } from '@angular/material/dialog';
import { AppDownloadDialogComponent } from '@shared/components/app-download-dialog/app-download-dialog.component';
import { ExternalLinkDialogComponent } from '@shared/components/external-link-dialog/external-link-dialog.component';
import { AboutDialogComponent } from '@shared/components/info-dialogs/about-dialog.component';
import { HelpDialogComponent } from '@shared/components/info-dialogs/help-dialog.component';
import { FeedbackDialogComponent } from '@shared/components/info-dialogs/feedback-dialog.component';
import { ProfileSwitcherDialogComponent } from '@shared/components/profile-switcher-dialog/profile-switcher-dialog.component';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent implements OnInit {
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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private $actions: Actions,
    private navigationService: NavigationService,
    private mockDataService: MockDataService,
    private dialog: MatDialog
  ) { }

  isElectron = environment.runConfig.electron;
  isMac = this.isElectron && /Mac/.test(window.navigator.platform);
  isMacBrowser = !this.isElectron && /Mac/.test(window.navigator.platform);
  isWindowsBrowser = !this.isElectron && /Win/.test(window.navigator.platform);
  isLinuxBrowser = !this.isElectron && /Linux/.test(window.navigator.platform);
  downloadUrl = 'https://github.com/jomellikesturtles/mdb-electron/releases/download/v1.0.0-alpha/mdb-darwin-arm64.zip';
  
  status = ''; // Initialize to empty string
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
  isAuthenticated = this.authService.isAuthenticated;
  lastQuery = '';

  myControl = new FormControl();
  ngOnInit() {
    this.mockDataService.getMovieGenres().subscribe(genres => {
      this.searchQuery.genres = genres;
    });

    this.$actions.pipe(ofActionDispatched(Login)).subscribe((e) => {
    });

    // Listen to route changes to update history if URL is edited manually
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const q = this.activatedRoute.snapshot.queryParamMap.get('q');
      if (q && q !== this.lastQuery) {
        this.lastQuery = q;
        this.myControl.setValue(q, { emitEvent: false });
        this.updateSearchHistory(q);
      }
    });

    this.getSearchHistoryList();
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

    if (this.lastQuery === val && (this.router.url.startsWith('/search') || this.router.url === '/results')) {
      return;
    }
    this.lastQuery = val;

    this.updateSearchHistory(val);
    this.myControl.setValue(val, { emitEvent: false });
    this.searchByTitle(val);

  }

  private updateSearchHistory(val: string) {
    // Update search history: move to front and maintain max length
    this.searchHistoryList = this.searchHistoryList.filter(q => q.toLowerCase() !== val.toLowerCase());
    this.searchHistoryList.unshift(val);
    if (this.searchHistoryList.length > this.SEARCH_HISTORY_MAX_LENGTH) {
      this.searchHistoryList = this.searchHistoryList.slice(0, this.SEARCH_HISTORY_MAX_LENGTH);
    }
    localStorage.setItem('mdb_search_history', JSON.stringify(this.searchHistoryList));
  }

  /**
   * Searches by title
   * @param enteredQuery query to search
   */
  searchByTitle(enteredQuery: string) {
    this.searchQuery.query = enteredQuery;
    if (this.searchQuery.query.length > 0) {
      this.dataService.updateSearchQuery(this.searchQuery);
      this.router.navigate(['/search'], { queryParams: { q: enteredQuery } });
    }
  }

  goToProfile() {
    this.router.navigate(['/user/profile']);
  }

  onSwitchProfile() {
    this.dialog.open(ProfileSwitcherDialogComponent, {
      width: '400px',
      disableClose: false
    });
  }

  goToSettings() {
    this.router.navigate(['/preferences']);
  }

  signOut() {
    localStorage.removeItem('user');
    this.authService.logout().subscribe((e) => {
      this.status = "LOGIN";
      this.router.navigate(["/user/signin"]);
    });
  }

  signIn() {
    this.router.navigate(['/user/signin']);
  }

  goToHelp() {
    this.dialog.open(HelpDialogComponent, {
      width: '550px',
      disableClose: false
    });
  }

  goToAbout() {
    this.dialog.open(AboutDialogComponent, {
      width: '450px',
      disableClose: false
    });
  }

  sendFeedback() {
    this.dialog.open(FeedbackDialogComponent, {
      width: '480px',
      disableClose: false
    });
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

  onDownloadApp() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      this.dialog.open(AppDownloadDialogComponent);
    } else if (this.isMacBrowser) {
      const dialogRef = this.dialog.open(ExternalLinkDialogComponent, {
        width: '400px',
        data: { url: this.downloadUrl }
      });

      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          window.open(this.downloadUrl, '_blank');
        }
      });
    }
  }
}
