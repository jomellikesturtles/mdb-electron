import { GenreCodes } from '@models/interfaces';
import { IRawLibrary, LibraryService } from '@services/library.service';
import {
  Component, OnInit,
  OnDestroy,
} from '@angular/core';
import { MDBTorrent } from '@models/interfaces';
import { DataService } from '@services/data.service';
import { MovieService } from '@services/movie/movie.service';
import { TorrentService } from '@services/torrent/torrent.service';
import { IpcService } from '@services/ipc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TROUBLE_QUOTES } from '@shared/constants';
import { PlayedService, IPlayed } from '@services/media/played.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { basename } from 'path';
import { FavoriteService } from '@services/media/favorite.service';
import { IProfileData } from '@models/profile-data.model';
import { MDBMovie } from '@models/mdb-movie.model';
import GeneralUtil from '@utils/general.util';
import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ImagePreviewComponent } from '@shared/components/image-preview/image-preview.component';
import { BookmarkService } from '@services/media/bookmark.service';
import { LoggerService } from '@core/logger.service';
import { MediaUserDataService } from '@services/media/media-user-data.service';
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
  movieDetailsDirectors;
  movieDetailsWriters;
  movieDetailsProducers;
  movieDetailsCast;
  movieCertification;
  movieDetails = new MDBMovie();
  userLocation = 'US';
  procBookmark = false;
  procWatched = false;
  procFavorite = false;
  procVideo = false;
  procPlayLink = false;
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
  private ngUnsubscribe = new Subject();

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
    private bookmarkService: BookmarkService,
    private playedService: PlayedService,
    private loggerService: LoggerService
  ) { }

  ngOnInit() {

    // this.activatedRoute.snapshot.subscribe(val => {
    this.activatedRoute.params.subscribe(val => {
      this.showVideo = false;
      this.getMovieOnline(val['id']);
    });

  }

  ngOnDestroy(): void {
    GeneralUtil.DEBUG.log('DETAILS DESTROY');
    // this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Loads minor video data.
   */
  loadVideoData() {
    this.movieDetailsDirectors = this.getDirectors();
    this.movieDetailsWriters = this.getWriters();
    this.movieDetailsProducers = this.getProducers();
    this.movieDetailsCast = this.getCast();
    // this.movieCertification = this.getMovieCertification()
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
      this.streamLink = 'https://s3.eu-central-1.amazonaws.com/pipe.public.content/short.mp4';
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
    this.libraryService.openVideoStream(val).then(e => {
      GeneralUtil.DEBUG.log('streamlink1:', e);
      // if (e != 0 && e != [] && e != '' && e.length > 0) {
      if (e) {
        this.showVideo = true;
        this.streamLink = e;
      }
    });
  }

  /**
   * Gets the user's watched, bookmark, library data of the movie
   */
  getUserMovieData() {
    this.procVideo, this.procBookmark, this.procWatched = true;

    this.mediaUserDataService.getMediaUserData(this.movieDetails.tmdbId).subscribe((profileData: IProfileData) => {

      GeneralUtil.DEBUG.log('usermoviedata', profileData);
      if (profileData.bookmark) {
        this.userData.bookmark = profileData.bookmark;
        this._isBookmarked = this.mediaUserDataService.commonSetter(profileData.bookmark);
      }
      if (profileData.played) {
        this.userData.played = profileData.played;
        this._isPlayed = this.mediaUserDataService.commonSetter(profileData.played);
      }
      if (profileData.favorite) {
        this.userData.favorite = profileData.favorite;
        this._isFavorite = this.mediaUserDataService.commonSetter(profileData.favorite);
      }
      if (profileData.listLinkMovie) {
        this.userData.listLinkMovie = profileData.listLinkMovie;
      }
      if (profileData.review) {
        this.userData.review = profileData.review;
      }
      this.procVideo, this.procBookmark, this.procWatched = false;
    });
  }

  set isBookmarked(val: number | Object) {
    this.loggerService.info('set isBookmarked called');
    this._isBookmarked = this.mediaUserDataService.commonSetter(val);
  }

  set isFavorite(val: number | Object) {
    this.loggerService.info('set isFavorite called');
    this._isFavorite = this.mediaUserDataService.commonSetter(val);
  }

  set isPlayed(val: number | Object) {
    this.loggerService.info('set isPlayed called');
    this._isPlayed = this.mediaUserDataService.commonSetter(val);
  }

  /**
   * Toggles movie from user's watchlist or bookmarks
   */
  async toggleBookmark() {
    this.procBookmark = true;
    const tmdbId = this.movieDetails.tmdbId;
    let res = false;
    if (this._isBookmarked) {
      res = await this.bookmarkService.removeBookmark('tmdbId', tmdbId).toPromise();
    } else {
      res = await this.bookmarkService.saveBookmark(tmdbId).toPromise();
    }
    this.isBookmarked = res;
    this.procBookmark = false;
  }

  async togglePlayed() {
    this.procWatched = true;
    const tmdbId = this.movieDetails.tmdbId;
    let res = false;
    if (this._isPlayed) {
      res = await this.playedService.removePlayed('tmdbId', tmdbId).toPromise();
    } else {
      res = await this.playedService.savePlayed({ tmdbId }).toPromise();
    }
    this.isPlayed = res;
    this.procWatched = false;
  }

  async toggleFavorite() {
    this.procFavorite = true;
    const tmdbId = this.movieDetails.tmdbId;
    let res;
    if (this._isFavorite) {
      res = await this.favoriteService.removeFavorite('tmdbId', tmdbId).toPromise();
    } else {
      res = await this.favoriteService.saveFavorite({ tmdbId }).toPromise();
    }
    this.isFavorite = res;
    this.procFavorite = false;
  }

  /**
   * Gets movie offline
   * @param val imdb id
   */
  getMovieDataOffline(val: any) {
    // this.ipcService.call(this.ipcService.IPCCommand.MovieMetadata, [this.ipcService.IPCCommand.Get, val])
  }

  saveMovieDataOffline(val: any) {
    // this.ipcService.call(this.ipcService.IPCCommand.MovieMetadata, [this.ipcService.IPCCommand.Set, val])
  }

  /**
   * Gets movie details, torrents
   * @param val tmdb id
   */
  getMovieOnline(val: number) {
    // tt2015381 is Guardians of the galaxy 2014; for testing only
    GeneralUtil.DEBUG.log('getMovie initializing with value...', val);

    this.movieService.getMovieDetails(val, 'videos,images,credits,similar,external_ids,recommendations').subscribe(data => {
      this.movieDetails = data;
      this.loadVideoData();
      this.hasData = true;
      // COMMENTED UNTIL 'error spawn ENAMETOOLONG' is fixed.
      // this.saveMovieDataOffline(this.movieDetails)
    });
  }

  /**
   * Gets the movie's certification based on user' location.
   */
  getMovieCertification() {
    const myLoc = this.movieDetails.releaseDates.results.find((e) => e.iso_3166_1 === this.userLocation);
    const toReturn = myLoc.release_dates[0].certification;
    // let toReturn = myLoc.release_dates.find((e) => { return e.type === 3 })
    // toReturn = toReturn.certification
    return toReturn;
  }

  /**
   * Gets the movie poster
   */
  getMoviePoster() {
    // implement offline movie poster
  }

  /**
   * !UNUSED
   * Gets backdrop or background image
   * @param val IMDb id
   */
  getBackdrop(val) {
    this.movieService.getMovieBackdrop(val.trim()).subscribe(data => {
      const numberOfBackgrounds = data.moviebackground.length;
      if (numberOfBackgrounds) {
        const imageIndex = Math.round(
          Math.random() * (numberOfBackgrounds - 0) + 0
        );
        this.movieBackdrop = data.moviebackground[imageIndex].url;
      } else {
        // this.movieBackdrop = this.selectedMovie.Poster;
      }
    });
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
    this.procPlayLink = true;
    this.libraryService.getMovieFromLibrary(this.movieDetails.tmdbId).then((libraryList: IRawLibrary[]) => {
      GeneralUtil.DEBUG.log("libraryList", libraryList);
      if (libraryList.length > 0) {
        this.bestPlayLink = this.mapPlayLink(libraryList[0]);
        this.playLinks = [...this.playLinks, ...this.mapPlayLinkList(libraryList)];
      }
    });

    let query;
    query = this.movieDetails.externalIds.imdb_id;
    this.torrentService.getTorrents(query).subscribe(data => {
      if (data) {
        this.torrents = this.torrentService.mapTorrentsList(data);
        this.torrents.sort(function (a, b) { return b.peers - a.peers; }); // sort by seeders
        this.playLinks = [...this.playLinks, ...this.mapPlayLinkList(this.torrents)];

        if (!this.bestPlayLink && this.torrents.length > 0) this.bestPlayLink = this.mapPlayLink(this.torrents[0]); // TODO: add sorting by preferred quality
      }
      this.procPlayLink = false;
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

    if (environment.runConfig.isElectron) {
      // this.ipcService.call(this.ipcService.IPCCommand.OpenLinkExternal, url)
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
    // // this.navigationService.goToPage()
    // this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });

    const highlightedId = val;
    this.dataService.updateHighlightedMovie(highlightedId);
    // this.router.navigate([`./details/${highlightedId}`]);
    this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });
  }

  goToPerson(castId) {
    this.router.navigate([`/person-details/${castId}`], { relativeTo: this.activatedRoute });
    // this.router.navigate([`/person-details/${castId}`], { relativeTo: this.activatedRoute });
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
  /**
   * Copies link to clipboard
   * @param magnetLink link top copy
   */
  copyToClipboard(magnetLink: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = magnetLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
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
}

class PlayLink {

  id?: string;
  name?: string;
  type: "torrent" | "offline";
  [x: string]: any;
  // size?: string
  hash?: string;
  // url?: string
  // quality?: string
  // type?: string
  // seeds?: number
  // peers?: number
  // sizeBytes?: number
  // added?: string
  // dateUploaded?: string
  // dateUploadedUnix?: number
  // isYts?: boolean
  // magnetLink?: string,
  // type: 'offline' | 'torrent'
  // fullFilePath: string,
  // title: string,
  // year: number,
  // tmdbId: number,
}
