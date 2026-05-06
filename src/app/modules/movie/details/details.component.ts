import { GenreCodes } from '@models/interfaces';
import { PlayLink } from '@models/playlink.model';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MDBTorrent } from '@models/interfaces';
import { IpcService } from '@services/ipc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TROUBLE_QUOTES } from '@shared/constants';
import { Subject } from 'rxjs';
import { basename } from 'path';
import { IProfileData } from '@models/profile-data.model';
import { MDBMovie } from '@models/mdb-movie.model';
import GeneralUtil from '@utils/general.util';
import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImagePreviewComponent } from '@shared/components/image-preview/image-preview.component';
import { FeatureName, FeatureToggleService } from '@core/services/feature-toggle.service';
import { AuthenticationService, DataService, HttpBaseService, IRawLibrary, LibraryService } from '@services';
import { BookmarkService, FavoriteService, MediaUserDataService, PlayedService, ListsService } from '@services/media';
import { TorrentService } from '@services/torrent/torrent.service';
import { MovieService } from '@services/movie/movie.service';
import { LoggerService } from '@core/logger.service';
import { NewListDialogComponent } from '@shared/components/list-dialogs/new-list-dialog.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})

/**
 * Get movie info, torrent, links, get if available in local
 */
export class DetailsComponent implements OnInit, OnDestroy {

  movieBackdrop;
  torrents: MDBTorrent[] = [];
  isAvailable = false;
  hasData = false;
  streamLink = '';
  troubleQuote;
  movieDetailsPersons = {
    directors: [],
    writers: [],
    producers: [],
    cast: [],
  };
  movieCertification;
  movieDetails = new MDBMovie();
  userLocation = 'US';
  isProcessingBookmark = false;
  isProcessingWatched = false;
  isProcessingFavorite = false;
  processingVideo = false;
  processingPlayLink = false;
  showVideo = false;
  _isBookmarked = false;
  _isPlayed = false;
  _isFavorite = false;
  movieTrailer: string;
  hasContinueWatching: boolean;
  playLinks = [];
  bestPlayLink: PlayLink;
  certification: 'PG';
  userData: IProfileData = new IProfileData();
  userLists = [
    { id: 1, name: 'Favorites', checked: false },
    { id: 2, name: 'Watchlist', checked: false },
    { id: 3, name: 'Weekend Binge', checked: false },
    { id: 4, name: 'Horror Classics', checked: false }
  ];
  private ngUnsubscribe = new Subject();
  isAuthenticated = this.authService.isAuthenticated().valueOf();

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private movieService: MovieService,
    private ipcService: IpcService,
    private torrentService: TorrentService,
    private mediaUserDataService: MediaUserDataService,
    private libraryService: LibraryService,
    private favoriteService: FavoriteService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private bookmarkService: BookmarkService,
    private playedService: PlayedService,
    private loggerService: LoggerService,
    private authService: AuthenticationService,
    private featureToggleService: FeatureToggleService,
    private listsService: ListsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(val => {
      this.showVideo = false;
      this.getMovieOnline(val['id']);
    });
  }

  toggleList(list: any, event: any) {
    const isChecked = event.checked;
    const mediaId = this.movieDetails.tmdbId;
    const listId = list.id;

    this.listsService.toggleListMembership(listId, mediaId).subscribe({
      next: () => {
        list.checked = isChecked;
        this.snackBar.open(`${isChecked ? 'Added to' : 'Removed from'} ${list.name}`, 'Close', { duration: 3000 });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loggerService.error(`Error toggling list: ${JSON.stringify(err)}`);
        this.snackBar.open(`Failed to update ${list.name}`, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    GeneralUtil.DEBUG.log('DETAILS DESTROY');
    this.ngUnsubscribe.complete();
  }

  /**
   * Loads minor video data.
   */
  loadVideoData() {
    this.movieDetailsPersons.directors = this.getDirectors();
    this.movieDetailsPersons.writers = this.getWriters();
    this.movieDetailsPersons.producers = this.getProducers();
    this.movieDetailsPersons.cast = this.getCast();
    this.getUserMovieData();
    this.getLibrary();
    this.displayBackdrop();
    this.getTrailer();
  }

  getTrailer() {
    this.movieTrailer = this.movieDetails.videos.results.find((e) => e.type.toLowerCase() === 'trailer');
  }

  playBestPlayLink() {
    if (environment.runConfig.useTestData) {
      this.showVideo = true;
      this.streamLink = 'https://samplelib.com/mp4/sample-30s.mp4';
      GeneralUtil.DEBUG.log('playingbestplaylink');
    } else {
      if (this.bestPlayLink.hash) { // is torrent
        this.playTorrent(this.bestPlayLink.hash);
      } else {
        this.playOfflineLibrary(this.bestPlayLink.id);
      }
      GeneralUtil.DEBUG.log('playingbestplaylink');
    }
  }

  /**
   * Plays the best possible stream. Offline copy is prioritized first.
   * @param val hash or id
   */
  playMovie(val: PlayLink) {
    if (val.type === "torrent") { // is torrent
      this.playTorrent(val.hash);
    } else {
      this.playOfflineLibrary(val.id);
    }
  }

  playOfflineLibrary(val) {
    this.libraryService.openVideoStream(val).then((e) => {
      GeneralUtil.DEBUG.log("streamlink1:", e);
      // if (e != 0 && e != [] && e != '' && e.length > 0) {
      if (e) {
        this.showVideo = true;
        this.streamLink = e;
        this.cdr.detectChanges();
      }
    });
  }




  /**
   * Gets the user's watched, bookmark, library data of the movie
   */
  getUserMovieData() {
    (this.processingVideo, this.isProcessingBookmark, (this.isProcessingWatched = true));

    this.mediaUserDataService.getMediaUserData(this.movieDetails.tmdbId).subscribe((profileData: IProfileData) => {
      this.isBookmarked = profileData.isBookmark;
      this.isFavorite = profileData.isFavorite;

      GeneralUtil.DEBUG.log('usermoviedata', profileData);
      (this.processingVideo, this.isProcessingBookmark, (this.isProcessingWatched = false));
      this.cdr.detectChanges();
    });
  }

  set isBookmarked(val: number | Object) {
    this.loggerService.info('set isBookmarked called');
    this._isBookmarked = this.mediaUserDataService.commonSetter(val);
  }

  get isBookmarked(): boolean {
    return this._isBookmarked;
  }

  set isFavorite(val: number | Object) {
    this.loggerService.info('set isFavorite called');
    this._isFavorite = this.mediaUserDataService.commonSetter(val);
  }

  get isFavorite(): boolean {
    return this._isFavorite;
  }

  set isPlayed(val: number | Object) {
    this.loggerService.info('set isPlayed called');
    this._isPlayed = this.mediaUserDataService.commonSetter(val);
  }

  get isPlayed(): boolean {
    return this._isPlayed;
  }

  /**
   * Toggles movie from user's watchlist or bookmarks
   */
  toggleBookmark() {
    this.isProcessingBookmark = true;
    const tmdbId = this.movieDetails.tmdbId;
    const isAdding = !this._isBookmarked;
    const bookmarkToggleFunction = this._isBookmarked ? this.bookmarkService.remove(tmdbId) : this.bookmarkService.save(tmdbId);
    bookmarkToggleFunction.subscribe(e => {
      this.isBookmarked = e.isBookmark;
      this.isProcessingBookmark = false;
      this.snackBar.open(`${isAdding ? 'Added to' : 'Removed from'} Watchlist`, 'Close', { duration: 3000 });
      this.cdr.detectChanges();
    }, err => {
      this.loggerService.error(`toggleBookmark error: ${JSON.stringify(err)}`);
      this.isProcessingBookmark = false;
      this.snackBar.open(`Failed to update Watchlist`, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      this.cdr.detectChanges();
    });

  }

  async togglePlayed() {
    this.isProcessingWatched = true;
    const tmdbId = this.movieDetails.tmdbId;
    const isAdding = !this._isPlayed;
    let res = false;
    try {
      if (this._isPlayed) {
        res = await this.playedService.removePlayed('tmdbId', tmdbId).toPromise();
      } else {
        res = await this.playedService.savePlayed({ tmdbId }).toPromise();
      }
      this.isPlayed = res;
      this.snackBar.open(`${isAdding ? 'Marked as' : 'Removed from'} Watched`, 'Close', { duration: 3000 });
      this.cdr.detectChanges();
    } catch (err) {
      this.loggerService.error(`togglePlayed error: ${JSON.stringify(err)}`);
      this.snackBar.open(`Failed to update Watched status`, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      this.isProcessingWatched = false;
      this.cdr.detectChanges();
    }
  }

  toggleFavorite() {
    this.isProcessingFavorite = true;
    const tmdbId = this.movieDetails.tmdbId;
    const isAdding = !this._isFavorite;
    const favoriteToggleFunction = this._isFavorite ? this.favoriteService.remove(tmdbId) : this.favoriteService.save(tmdbId);
    favoriteToggleFunction.subscribe(e => {
      this.isFavorite = e.isFavorite;
      this.snackBar.open(`${isAdding ? 'Added to' : 'Removed from'} Favorites`, 'Close', { duration: 3000 });
      this.cdr.detectChanges();
    }, err => {
      this.loggerService.error(`toggleFavorite error: ${JSON.stringify(err)}`);
      this.snackBar.open(`Failed to update Favorites`, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      this.isProcessingFavorite = false;
      this.cdr.detectChanges();
    }, () => {
      this.isProcessingFavorite = false;
      this.cdr.detectChanges();
    });
  }


  /**
   * Gets movie details, torrents
   * @param val tmdb id
   */
  getMovieOnline(val: number) {
    GeneralUtil.DEBUG.log('getMovie initializing with value...', val);

    this.movieService.getMovieDetails(val, 'videos,images,credits,similar,external_ids,recommendations,reviews')
      .subscribe((data) => {
        this.movieDetails = data;
        this.loadVideoData();
        this.hasData = true;
        this.movieService.getStreams(data.imdbId).subscribe((data) => {
          GeneralUtil.DEBUG.log("streams", data);
        });
        this.cdr.detectChanges();
      });
  }

  /**
   * Gets the movie's certification based on user' location.
   */
  getMovieCertification() {
    const myLoc = this.movieDetails.releaseDates.results.find((e) => e.iso_3166_1 === this.userLocation);
    const toReturn = myLoc.release_dates[0].certification;
    return toReturn;
  }

  /**
   * Gets the movie poster
   */
  getMoviePoster() {
  }

  /**
   * Displays backdrop or background image
   */
  displayBackdrop() {

    const data = this.movieDetails.images['backdrops'];
    const numberOfBackgrounds = data.length;
    if (numberOfBackgrounds) {
      const imageIndex = Math.round(
        Math.random() * (numberOfBackgrounds - 1)
      );
      this.movieBackdrop = data[imageIndex].file_path;
    }
  }

  /**
   * TODO: add group async
   * Gets movie availability. From user library, torrent, etc.
   * @param val name
   */
  getLibrary() {
    this.processingPlayLink = true;
    this.libraryService.getMovieFromLibrary(this.movieDetails.tmdbId).then((libraryList: IRawLibrary[]) => {
      GeneralUtil.DEBUG.log("libraryList", libraryList);
      if (libraryList.length > 0) {
        this.bestPlayLink = this.mapPlayLink(libraryList[0]);
        this.playLinks = [...this.playLinks, ...this.mapPlayLinkList(libraryList)];
      }
    });

    let imdbId = this.movieDetails.externalIds.imdb_id;
    this.torrentService.getTorrents(imdbId).subscribe(data => {
      if (data) {
        this.torrents = data.torrents;
        this.torrents.sort(function (a, b) { return b.peers - a.peers; }); // sort by seeders
        this.playLinks = [...this.playLinks, ...this.mapPlayLinkList(this.torrents)];

        if (!this.bestPlayLink && this.torrents.length > 0) this.bestPlayLink = this.mapPlayLink(this.torrents[0]); // TODO: add sorting by preferred quality
      }
      this.processingPlayLink = false;
    });
  }

  continueWatching() {

  }

  /**
   * Plays selected torrent.
   * @param hash torrent hash
   */
  playTorrent(hash: string) {
    this.ipcService.getPlayTorrent(hash).then(e => {
      this.showVideo = true;
      this.streamLink = e;
    });
    // this.ipcService.streamLink.subscribe(e => {
    //   GeneralUtil.DEBUG.log('streamlink1:', e)
    //   if (e != 0 && e != [] && e != '' && e.length > 0) {
    //     GeneralUtil.DEBUG.log('streamlink2:', e)
    //     this.showVideo = true
    //     this.streamLink = e
    //   }
    // })
  }

  /**
   * Opens link externally
   * @param linkType link type
   * @param idParam id
   */
  goToLink(linkType: string, idParam?: string) {
    let url = '';
    GeneralUtil.DEBUG.log('1:', linkType, ' 2:', idParam);
    switch (linkType) {
      case 'google':
        let releaseYear = this.getYear(this.movieDetails.releaseDate);
        url = `https://www.google.com/search?q=${this.movieDetails.title} ${releaseYear}`;
        break;
      case 'imdb':
        url = `https://www.imdb.com/title/${this.movieDetails.imdbId}/`;
        break;
      case 'tmdb':
        url = `https://www.themoviedb.org/movie/${this.movieDetails.tmdbId}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/${this.movieDetails.externalIds.facebook_id}`;
        break;
      case 'twitter':
        url = `https://twitter.com/${this.movieDetails.externalIds.twitter_id}`;
        break;
      case 'instagram':
        url = `https://instagram.com/${this.movieDetails.externalIds.instagram_id}`;
        break;
      case 'website':
        url = `${this.movieDetails.website}`;
        break;
      default:
        break;
    }

    if (environment.runConfig.electron) {
    } else {
      window.open(url);
    }
  }

  /**
   * Discovers movies based from criteria.
   * @param type type of discovery. (year, certification, genre)
   * @param id value to discover
   */
  goToDiscover(type: string, id: string, name?: string) {
    this.dataService.updateDiscoverQuery({ type: type, value: id, name: name });
    this.router.navigate([`/discover`], { queryParams: { type: type, id: id, name: name } });
  }

  goToMovie(val: string) {
    const highlightedId = val;
    this.dataService.updateHighlightedMovie(highlightedId);
    this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });
  }

  goToPerson(castId) {
    this.router.navigate([`/person-details/${castId}`], { relativeTo: this.activatedRoute });
  }

  goToFullCredits() {
    const val = this.movieDetails.tmdbId;
    this.router.navigate([`/credits/${val}`], { relativeTo: this.activatedRoute });
  }

  /**
   * Get year from date.
   */
  getYear(val: string) {
    return GeneralUtil.getYear(val);
  }

  getDirectors() {
    const toReturn = [];
    this.movieDetails.credits.crew.forEach(crew => {
      if (crew.job === 'Director') { toReturn.push(crew); }
    });
    return toReturn;
  }

  getWriters() {
    const toReturn = [];
    this.movieDetails.credits.crew.forEach(crew => {
      if (crew.job === 'Writer' || crew.job === 'Screenplay') { toReturn.push(crew); }
    });
    return toReturn;
  }

  getProducers() {
    const toReturn = [];
    this.movieDetails.credits.crew.forEach(crew => {
      if (crew.job.toLowerCase().includes('producer')) { toReturn.push(crew); }
    });
    return toReturn;
  }

  getCast() {
    const toReturn = [];
    this.movieDetails.credits.cast.forEach(crew => {
      toReturn.push(crew);
    });
    return toReturn;
  }

  playPreview() {
    this.dataService.updatePreviewMovie(this.movieDetails);
  }

  getTroubleQuote() {
    const length = TROUBLE_QUOTES.length;
    this.troubleQuote = TROUBLE_QUOTES[Math.floor(Math.random() * (-1 - length + 1)) + length];
  }

  /**
   * Converts genre code into its genre name equivalent.
   * @param genreCode genre code origin
   * @returns genre name
   */
  getGenre(genreCode: number) {
    return GenreCodes[genreCode];
  }

  sanitize(torrent: MDBTorrent) {
    return this.torrentService.sanitize(torrent);
  }

  previewImage() {
    this.dialog.open(ImagePreviewComponent, { data: { imagePath: this.movieDetails.posterPath } });
  }

  copyToClipboard(magnetLink: string) {
    GeneralUtil.copyToClipboard(magnetLink);
  }

  addToList(list?: any) {
    if (list) {
      this.loggerService.info(`Added to list: ${list.name}`);
    } else {
      const dialogRef = this.dialog.open(NewListDialogComponent, {
        width: '400px',
        panelClass: 'mdb-dialog-container'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loggerService.info(`Creating new list: ${JSON.stringify(result)}`);
          this.listsService.createList(result).subscribe({
            next: (newList: any) => {
              this.snackBar.open(`List "${result.name}" created successfully`, 'Close', { duration: 3000 });
              if (newList && newList.id) {
                this.userLists.push({ ...newList, checked: false });
              }
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.loggerService.error(`Error creating list: ${JSON.stringify(err)}`);
              this.snackBar.open('Failed to create new list', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
              this.cdr.detectChanges();
            }
          });
        }
      });
    }
  }

  /**
   * @param rawLibraryList torrent list or library list
   */
  mapPlayLinkList(rawLibraryList: any[]): PlayLink[] {
    let playLinkList: PlayLink[] = [];
    rawLibraryList.forEach(rawLibrary => {
      playLinkList.push(this.mapPlayLink(rawLibrary));
    });
    return playLinkList;
  }

  mapPlayLink(arg: IRawLibrary | MDBTorrent): PlayLink {
    let playLink = new PlayLink();
    playLink.id = arg.hasOwnProperty('_id') ? arg['_id'] : null;
    playLink.hash = arg.hasOwnProperty('hash') ? arg['hash'] : null;
    playLink.name = arg.hasOwnProperty('name') ? arg['name'] : basename(arg['fullFilePath']);
    playLink.quality = arg.hasOwnProperty('quality') ? arg['quality'] : '';
    playLink.type = arg.hasOwnProperty('hash') ? 'torrent' : 'offline';
    return playLink;
  }

  isFeatureEnabled(featureName: FeatureName) {
    return this.featureToggleService.isEnabled(featureName);
  }

}
