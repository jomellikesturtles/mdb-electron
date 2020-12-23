import { GenreCodes } from './../../../interfaces';
import { IRawLibrary, LibraryService } from '../../../services/library.service';
import {
  Component, OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { MDBTorrent } from '../../../interfaces';
import { MdbMovieDetails } from '../../../classes';
import { TEST_TMDB_MOVIE_DETAILS } from '../../../mock-data';
import { DomSanitizer } from '@angular/platform-browser';
import { BookmarkService } from '../../../services/bookmark.service'
import { DataService } from '../../../services/data.service';
import { MovieService } from '../../../services/movie.service';
import { TorrentService } from '../../../services/torrent.service';
import { UtilsService } from '../../../services/utils.service';
import { IpcService, IUserMovieData } from '../../../services/ipc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TROUBLE_QUOTES } from '../../../constants';
import { TMDB_FULL_MOVIE_DETAILS } from '../../../mock-data-movie-details';
import { UserDataService } from 'src/app/services/user-data.service';
import { environment } from 'src/environments/environment';
import { WatchedService, IWatched } from 'src/app/services/watched.service';
declare var $: any
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

/**
 * Get movie info, torrent, links, get if available in local
 */
export class DetailsComponent implements OnInit, OnDestroy {

  selectedMovie;
  currentMovie: MdbMovieDetails;
  movieBackdrop;
  torrents: MDBTorrent[] = [];
  testSelectedMovie = TEST_TMDB_MOVIE_DETAILS
  rawData = null
  testMovieBackdrop = './assets/test-assets/wall-e_backdrop.jpg'
  isAvailable = false
  isMovieAvailable = false
  hasData = false
  streamLink = ''
  troubleQuote
  movieDetailsDirectors
  movieDetailsWriters
  movieDetailsProducers
  movieCertification
  movieDetails = new MdbMovieDetails()
  userLocation = 'US'
  procBookmark = false
  procWatched = false
  procVideo = false
  showVideo = false
  isBookmarked = false
  isWatched = false
  movieTrailer: string
  hasContinueWatching: boolean
  playLinks = []
  bestPlayLink: PlayLink;
  private ngUnsubscribe = new Subject();

  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private bookmarkService: BookmarkService,
    private dataService: DataService,
    private movieService: MovieService,
    private ipcService: IpcService,
    private torrentService: TorrentService,
    private utilsService: UtilsService,
    private userDataService: UserDataService,
    private libraryService: LibraryService,
    private watchedService: WatchedService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    if (!environment.runConfig.useTestData) {
      this.activatedRoute.params.subscribe(val => {
        console.log(val)
        this.getMovieOnline(val['id'])
      })
    } else {
      this.movieDetails.convertToMdbObject(TMDB_FULL_MOVIE_DETAILS)
      this.loadVideoData()
      this.cdr.detectChanges();
    }

    $('[data-toggle="popover"]').popover()
    $('[data-toggle="tooltip"]').tooltip({ placement: 'top' })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  /**
   * Loads minor video data.
   */
  loadVideoData() {
    this.movieDetailsDirectors = this.getDirectors()
    this.movieDetailsWriters = this.getWriters()
    this.movieDetailsProducers = this.getProducers()
    // this.movieCertification = this.getMovieCertification()
    this.getUserMovieData()
    this.getTorrents()
    this.displayBackdrop()
    this.getTrailer()

  }

  getTrailer() {
    this.movieTrailer = this.movieDetails.videos.results.find((e) => e.type.toLowerCase() === 'trailer')
  }

  playBestPlayLink() {
    if (this.bestPlayLink.hash) { // is torrent
      this.playTorrent(this.bestPlayLink.hash)
    } else {
      this.playOfflineLibrary(this.bestPlayLink.id);
    }
  }

  /**
   * Plays the best possible stream. Offline copy is prioritized first.
   * @param val hash or id
   */
  playMovie(val: any) {
    if (val) { // is torrent
      this.playTorrent(val.hash);
    } else {
      this.playOfflineLibrary(val);
    }
  }

  playOfflineLibrary(val) {
    this.libraryService.openVideoStream(this.movieDetails.tmdbId).then(e => {
      console.log('streamlink1:', e)
      if (e != 0 && e != [] && e != '' && e.length > 0) {
        this.streamLink = e
        this.showVideo = true
        this.cdr.detectChanges()
      }
    })
  }

  /**
   * Gets the user's watched, bookmark, library data of the movie
   */
  getUserMovieData() {
    this.procVideo, this.procBookmark, this.procWatched = true
    this.userDataService.getMovieUserData(this.movieDetails.tmdbId).then((userMovieData: IUserMovieData) => {
      console.log('usermoviedata', userMovieData)
      if (userMovieData.library) {
        // if (libraryList.length > 0) {
        this.isMovieAvailable = true
        const libraryList = userMovieData.library.libraryList
        this.playLinks = [...this.playLinks, ...libraryList]
        this.bestPlayLink = libraryList[0]
      }
      if (userMovieData.bookmark) {
        this.movieDetails.bookmark = userMovieData.bookmark
        this.isBookmarked = true
      }
      if (userMovieData.watched) {
        this.movieDetails.watched = userMovieData.watched
        this.isWatched = true
      }
    }).catch(e => {
    }).finally(() => {
      this.procVideo, this.procBookmark, this.procWatched = false
      this.cdr.detectChanges()
    })
  }

  /**
   * Toggles movie from user's watchlist or bookmarks
   */
  async toggleBookmark() {

    this.procBookmark = true
    let bmDoc
    bmDoc = await this.userDataService.toggleBookmark(this.movieDetails)
    this.isBookmarked = !this.isBookmarked
    console.log('BOOKMARKADD/remove:', bmDoc)
    this.procBookmark = false
    this.cdr.detectChanges()
  }

  async toggleWatched() {
    this.procWatched = true
    let wDoc

    wDoc = await this.watchedService.toggleWatched(this.movieDetails)
    this.isWatched = !this.isWatched
    console.log('WATCHEDADD/remove:', wDoc)
    this.procWatched = false
    this.cdr.detectChanges()
  }

  /**
   * Gets movie offline
   * @param val imdb id
   */
  getMovieDataOffline(val: any) {
    this.ipcService.call(this.ipcService.IPCCommand.MovieMetadata, [this.ipcService.IPCCommand.Get, val])
  }

  saveMovieDataOffline(val: any) {
    this.ipcService.call(this.ipcService.IPCCommand.MovieMetadata, [this.ipcService.IPCCommand.Set, val])
  }

  /**
   * Gets movie details, torrents
   * @param val tmdb id
   */
  getMovieOnline(val: number) {
    // tt2015381 is Guardians of the galaxy 2014; for testing only
    console.log('getMovie initializing with value...', val);

    // this.movieService.getTmdbMovieDetails(val, [], 'videos,images,credits,similar,external_ids,recommendations').pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
    this.movieService.getTmdbMovieDetails(val, 'videos,images,credits,similar,external_ids,recommendations').subscribe(data => {
      console.log('got from getMovieOnline ', data)
      this.selectedMovie = data;
      const myObject = this.selectedMovie
      this.movieDetails.convertToMdbObject(myObject)
      this.loadVideoData()
      this.rawData = data
      this.hasData = true
      // COMMENTED UNTIL 'error spawn ENAMETOOLONG' is fixed.
      // this.saveMovieDataOffline(this.movieDetails)
    });
  }

  /**
   * Gets the movie's certification based on user' location.
   */
  getMovieCertification() {
    const myLoc = this.movieDetails.release_dates.results.find((e) => e.iso_3166_1 === this.userLocation)
    const toReturn = myLoc.release_dates[0].certification
    // let toReturn = myLoc.release_dates.find((e) => { return e.type === 3 })
    // toReturn = toReturn.certification
    return toReturn
  }

  /**
   * Gets the movie poster
   */
  getMoviePoster() {
    this.ipcService.call(this.ipcService.IPCCommand.GetImage, [this.selectedMovie.Poster, this.selectedMovie.imdbID, 'poster'])
    return this.selectedMovie.Poster
  }

  /**
   * Gets the movie backdrop
   */
  getMovieBackdrop() {
    // this.ipcService.getImage(this.selectedMovie.imdbID, 'backdrop')
    return this.selectedMovie.Poster
  }

  /**
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
        this.movieBackdrop = this.selectedMovie.Poster;
      }
    });
  }

  /**
   * Displays backdrop or background image
   */
  displayBackdrop() {

    const data = this.movieDetails.images['backdrops']
    const numberOfBackgrounds = data.length
    if (numberOfBackgrounds) {
      const imageIndex = Math.round(
        Math.random() * (numberOfBackgrounds - 1)
      );
      this.movieBackdrop = data[imageIndex].file_path;
    }
  }

  /**
   * Gets torrents from online and offline
   * @param val name
   * @returns Torrent object
   */
  getTorrents() {
    const releaseYear = this.getYear(this.movieDetails.releaseDate)
    let query
    // let query = [this.movieDetails.title, releaseYear]
    // console.log('getTorrents initializing... with val ', query);
    query = this.movieDetails.external_ids.imdb_id
    this.torrentService.getTorrents(query).subscribe(data => {
      if (data) {
        this.torrents = this.torrentService.mapTorrentsList(data);
        this.torrents.sort(function (a, b) { return b.peers - a.peers }); // sort by seeders
        this.playLinks = [...this.playLinks, ...this.torrents]
        if (!this.bestPlayLink) this.bestPlayLink = this.torrents[0]; // TODO: add sorting by preferred quality
      }
      this.cdr.detectChanges()
    });
  }

  continueWatching() {

  }

  /**
   * Plays selected torrent.
   * @param hash torrent hash
   */
  playTorrent(hash: string) {
    this.ipcService.getPlayTorrent(hash)
    this.ipcService.streamLink.subscribe(e => {
      console.log('streamlink1:', e)
      if (e != 0 && e != [] && e != '' && e.length > 0) {
        console.log('streamlink2:', e)
        this.streamLink = e
        this.showVideo = true
        this.cdr.detectChanges()
      }
    })
    // this.torrentService.getStreamLink(hash).subscribe(e => {
    //   if (e) {
    //     this.streamLink = e.url
    //     this.showVideo = true
    //   }
    //   this.cdr.detectChanges()
    // })
  }

  /**
   * Opens link externally
   * @param param1 link type
   * @param param2 id
   */
  goToLink(param1: string, param2?: string) {
    let url = ''
    console.log('1:', param1, ' 2:', param2);
    switch (param1) {
      case 'google':
        let releaseYear
        if (!this.movieDetails.releaseYear) {
          releaseYear = this.getYear(this.movieDetails.releaseDate);
        } else {
          releaseYear = this.movieDetails.releaseYear
        }
        url = `https://www.google.com/search?q=${this.movieDetails.title} ${releaseYear}`
        break;
      case 'imdb':
        url = `https://www.imdb.com/title/${this.movieDetails.imdbId}/`
        break;
      case 'tmdb':
        url = `https://www.themoviedb.org/movie/${this.movieDetails.tmdbId}`
        break;
      case 'facebook':
        url = `https://www.facebook.com/${this.movieDetails.external_ids.facebook_id}`
        break;
      case 'twitter':
        url = `https://twitter.com/${this.movieDetails.external_ids.twitter_id}`
        break;
      case 'instagram':
        url = `https://instagram.com/${this.movieDetails.external_ids.instagram_id}`
        break;
      case 'website':
        url = `${this.movieDetails.website}`
        break;
      default:
        break;
    }
    const env = this.utilsService.getEnvironment()
    if (env === 'desktop') {
      this.ipcService.call(this.ipcService.IPCCommand.OpenLinkExternal, url)
    } else if (env === 'web') {
      window.open(url)
    }
  }

  /**
   * Discovers movies based from criteria.
   * @param type type of discovery. (year, certification, genre)
   * @param id value to discover
   */
  goToDiscover(type: string, id: string, name?: string) {

    this.dataService.updateDiscoverQuery({ type: type, value: id, name: name })
    this.router.navigate([`/discover`], { queryParams: { type: type, id: id, name: name } });
  }

  goToMovie(val: string) {

    // const highlightedId = this._movie.id;
    // this.dataService.updateHighlightedMovie(highlightedId);
    // // this.navigationService.goToPage()
    // this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });

    const highlightedId = val
    this.dataService.updateHighlightedMovie(highlightedId);
    // this.router.navigate([`./details/${highlightedId}`]);
    this.cdr.detectChanges()
    this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });
  }

  goToPerson(castId) {
    this.router.navigate([`/person-details/${castId}`], { relativeTo: this.activatedRoute });
  }

  goToFullCredits() {
    const val = this.movieDetails.tmdbId
    this.router.navigate([`/credits/${val}`], { relativeTo: this.activatedRoute });
  }

  /**
   * Get year from date.
   */
  getYear(val: string) {
    return this.utilsService.getYear(val)
  }

  getDirectors() {
    const toReturn = []
    this.movieDetails.credits.crew.forEach(crew => {
      if (crew.job === 'Director') { toReturn.push(crew) }
    });
    return toReturn
  }

  getWriters() {
    const toReturn = []
    this.movieDetails.credits.crew.forEach(crew => {
      if (crew.job === 'Writer' || crew.job === 'Screenplay') { toReturn.push(crew) }
    });
    return toReturn
  }

  getProducers() {
    const toReturn = []
    this.movieDetails.credits.crew.forEach(crew => {
      if (crew.job.toLowerCase().includes('producer')) { toReturn.push(crew) }
    });
    return toReturn
  }

  playTrailer() {
    this.dataService.updatePreviewMovie(this.rawData)
    // this.dataService.updatePreviewMovie()
  }

  getTroubleQuote() {
    const length = TROUBLE_QUOTES.length
    this.troubleQuote = TROUBLE_QUOTES[Math.floor(Math.random() * (-1 - length + 1)) + length]
  }

  /**
   * Converts genre code into its genre name equivalent.
   * @param genreCode genre code origin
   * @returns genre name
   */
  getGenre(genreCode: number) {
    return GenreCodes[genreCode]
  }

  sanitize(torrent: MDBTorrent) {
    return this.torrentService.sanitize(torrent);
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

  mapPlayLinkList(val: []): PlayLink[] {
    let playLinkList: PlayLink[];
    val.forEach(playlink => {
      playLinkList.push(this.mapPlayLink(playlink));
    })
    return playLinkList;
  }

  mapPlayLink(arg: IRawLibrary | MDBTorrent): PlayLink {
    let playLink: PlayLink
    playLink.id = arg.hasOwnProperty('_id') ? arg['_id'] : null
    playLink.hash = arg.hasOwnProperty('hash') ? arg['hash'] : null
    playLink.name = arg.hasOwnProperty('name') ? arg['name'] : arg['title']
    playLink.type = arg.hasOwnProperty('hash') ? 'torrent' : 'offline'
    return playLink
  }
}

interface PlayLink {

  id?: number
  name?: string
  [x: string]: any
  // size?: string
  hash?: string
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
