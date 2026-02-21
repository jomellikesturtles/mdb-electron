import { UserDataService } from '@services/user-data/user-data.service';
import { PreferencesService } from '@services/preferences.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '@services/data.service';
import { MovieService } from '@services/movie/movie.service';
import { TorrentService } from '@services/torrent/torrent.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MDBMovie } from '@models/mdb-movie.model';
import { IProfileData } from '@models/profile-data.model';
import ObjectUtil from '@utils/object.utils';
import GeneralUtil from '@utils/general.util';
import { BookmarkService } from '@services/media/bookmark.service';
import { PlayedService } from '@services/media/played.service';
import { FavoriteService } from '@services/media/favorite.service';
import { LoggerService } from '@core/logger.service';
import { FeatureName, FeatureToggleService } from '@core/services/feature-toggle.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  _movie: MDBMovie;
  @Input()
  set movie(inputMessage: MDBMovie) {
    this._movie = new MDBMovie(inputMessage);

    if (this.preferencesService.isGetTorrentFromMovieCard) {
      // UNCOMMENT BELOW to get external_id and torrent one by one
      this.movieService.getExternalId(this._movie.tmdbId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(externalId => {
        if (externalId && externalId.imdb_id) {
          this.torrentService.getTorrents(externalId.imdb_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
            if (e.status === 'ok' && e.torrents.length > 0) {
              // const firstTorrent = e.data.movies[0].torrents[0];
              // this._movie.library = firstTorrent
              // this._movie.library.id = firstTorrent.hash
            }
          });
        }
      });
    }
  }
  get movie(): MDBMovie {
    return this._movie;
  }

  _cardWidth = '130px';
  @Input()
  set cardWidth(inputMessage: any) {
    this._cardWidth = inputMessage;
  }
  get cardWidth(): any {
    return this._cardWidth;
  }

  _library: any;
  @Input()
  set library(inputVideo: any) {
    this._library = inputVideo;
  }
  get library(): any {
    return this._library;
  }

  _userData: IProfileData;
  @Input()
  set userData(inputData: IProfileData) {
    this._userData = inputData;
    if (!ObjectUtil.isEmpty(inputData)) {
      if (inputData.played) {
        this.watchedPercentage = inputData.played.percentage + '%';
      }
    }
  }
  get userData(): IProfileData {
    return this._userData;
  }

  isAdminMode = false;
  isProcessingFavorite = false;
  isProcessingBookmark = false;
  procWatched = false;
  procHighlight = false;
  isWatched = false;
  _isBookmarked = false;
  _isFavorite = false;
  _isPlayed = false;
  isAvailable = false;
  watchedPercentage = '0%';
  isSingleClick: any;
  private ngUnsubscribe = new Subject();

  constructor(
    private dataService: DataService,
    private movieService: MovieService,
    private preferencesService: PreferencesService,
    private torrentService: TorrentService,
    private userDataService: UserDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private bookmarkService: BookmarkService,
    private favoriteService: FavoriteService,
    private playedService: PlayedService,
    private loggerService: LoggerService,
    private featureToggleService: FeatureToggleService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Adds movie object to the selected movies list
   * @param movie current selected movie
   */
  onHighlight(): void {
    this.procHighlight = true;
    // this._movie.isHighlighted = !this._movie.isHighlighted
    // if (this._movie.isHighlighted) {
    //   this.store.dispatch(new AddMovie(this._movie))
    // } else {
    //   this.store.dispatch(new RemoveMovie(this._movie))
    // }
    this.procHighlight = false;
  }

  /**
   * Opens the movie's details page.
   */
  onOpenMovie(): void {
    const highlightedId = this._movie.tmdbId;
    this.dataService.updateHighlightedMovie(highlightedId);
    // this.navigationService.goToPage()
    this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });

    // below is for imdb id, but we will settle for tmdb id for now
    // this.movieService.getExternalId(movie.id).subscribe(data => {
    //   const highlightedId = data.imdb_id;
    //   localStorage.setItem('imdb_id', highlightedId)
    //   this.dataService.updateHighlightedMovie(highlightedId);
    //   this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });
    // })
  }

  onPreview(): void {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        this.dataService.updatePreviewMovie(this._movie);
      }
    }, 300);
  }

  set isBookmarked(val: number | Object) {
    this.loggerService.info('set isBookmarked called');
    this._isBookmarked = this.userDataService.commonSetter(val);
  }

  set isFavorite(val: number | Object) {
    this.loggerService.info('set isFavorite called');
    this._isFavorite = this.userDataService.commonSetter(val);
  }

  set isPlayed(val: number | Object) {
    this.loggerService.info('set isPlayed called');
    this._isPlayed = this.userDataService.commonSetter(val);
  }

  /**
   * Toggles movie from user's watchlist or bookmarks
   */
  async toggleBookmark() {
    this.isProcessingBookmark = true;
    const tmdbId = this._movie.tmdbId;
    const bookmarkToggleFunction = this._isBookmarked ? this.bookmarkService.remove('tmdbId', tmdbId) : this.bookmarkService.save({ tmdbId });
    bookmarkToggleFunction.subscribe(e => {
      this.isBookmarked = e.isBookmark;
      this.isProcessingBookmark = false;
    });
  }

  async togglePlayed() {
    this.procWatched = true;
    const tmdbId = this._movie.tmdbId;
    let res = false;
    if (this._isPlayed) {
      res = await this.playedService.removePlayed('tmdbId', tmdbId).toPromise();
    } else {
      res = await this.playedService.savePlayed({ tmdbId }).toPromise();
    }
    this.isPlayed = res;
    this.procWatched = false;
  }

  toggleFavorite() {
    this.isProcessingFavorite = true;
    const tmdbId = this._movie.tmdbId;
    const favoriteToggleFunction = this._isFavorite ? this.favoriteService.remove('tmdbId', tmdbId) : this.favoriteService.save({ tmdbId });
    favoriteToggleFunction.subscribe(e => {
      this.isFavorite = e.isFavorite;
      this.isProcessingFavorite = false;
    });
  }

  /**
   * Gets the year.
   * @param releaseDate release date with format YYYY-MM-DD
   */
  getYear(releaseDate: string): string {
    return GeneralUtil.getYear(releaseDate);
  }

  /**
   * Gets poster. CURRENTLY UNUSED
   * @param poster poster url
   * TODO: Fetch from offline or generate canvass.
   */
  getPoster(poster: string): string {
    return '';
  }

  goToYear(year: string): void {
    this.dataService.updateDiscoverQuery({ type: 'year', value: year, name: null });
    this.router.navigate([`/discover`], {
      relativeTo: this.activatedRoute, queryParams: { type: 'year', year: year }
    });
  }

  isFeatureEnabled(featureName: FeatureName) {
    return this.featureToggleService.isEnabled(featureName);
  }
}
