import { TmdbAppendToResponseParameters, GenreCodes } from './../../../interfaces';
import { VideoService } from './../../../services/video.service';
import { Component, OnInit, ChangeDetectorRef, Input, ChangeDetectionStrategy, OnDestroy, NgZone } from '@angular/core';
import { IRating, MDBTorrent, ILibraryInfo, ITmdbMovieDetail, TmdbParameters } from '../../../interfaces';
import { MdbMovieDetails } from '../../../classes';
import { TEST_TMDB_MOVIE_DETAILS } from '../../../mock-data';
import { DomSanitizer } from '@angular/platform-browser';
import { BookmarkService } from '../../../services/bookmark.service'
import { DataService } from '../../../services/data.service';
import { MovieService } from '../../../services/movie.service';
import { TorrentService } from '../../../services/torrent.service';
import { UtilsService } from '../../../services/utils.service';
import { IpcService } from '../../../services/ipc.service';
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
  changeDetection: ChangeDetectionStrategy.OnPush
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
    private videoService: VideoService,
    private watchedService: WatchedService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    if (!environment.runConfig.useTestData) {
      const id = this.activatedRoute.snapshot.paramMap.get('id')
      this.getMovieOnline(id)
    } else {
      this.movieDetails.convertToMdbObject(TMDB_FULL_MOVIE_DETAILS)
      this.loadVideoData()
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
    this.getBookmark()
    this.getWatched()
    this.getVideo()
    this.getTorrents()
    this.displayBackdrop()
    this.getTrailer()
  }

  getTrailer() {
    this.movieTrailer = this.movieDetails.videos.results.find((e) => e.type === 'Trailer')
  }

  playVideo() {
    this.showVideo = true
  }

  /**
   * !UNUSED
   */
  getMovieCredits() {
    // TmdbParameters.
    const tmdbId = this.movieDetails.tmdbId
    this.movieService.getTmdbMovieDetails(tmdbId, [], 'credits').subscribe(data => {
      console.log('got from getMovieCredits ', data)
      // this.selectedMovie = data;
      // this.saveMovieDataOffline(data)
    });
  }

  getVideo() {
    // this.ipcService.call(IPCCommand.OpenVideo, this.movieDetails.tmdbId)
    this.procVideo = true
    // this.ipcService.videoFile.subscribe(data => {
    //   if (data === null || data === 0) {
    //     this.isMovieAvailable = false
    //   } else {
    //     this.streamLink = data
    //     this.isMovieAvailable = true
    //   }
    //   this.procVideo = false
    //   this.cdr.detectChanges()
    // })
    this.videoService.getVideo(this.movieDetails.tmdbId).then(e => {
      console.log('FROM VEIDEOSERVICE: ', e)
      if (e) {
        this.streamLink = e.videoUrl
        this.isMovieAvailable = true
        this.showVideo = true
      }
    }).catch(e => {

    }).finally(() => {
      this.procVideo = false
      this.cdr.detectChanges()
    }
    )
  }

  /**
   * Gets bookmark status.
   */
  async getBookmark() {
    // this.ipcService.call(IPCCommand.Bookmark, [IPCCommand.BookmarkGet, this.movieDetails.tmdbId])
    // this.procBookmark = true
    // this.ipcService.bookmarkSingle.subscribe(data => {
    //   if (data === null || data.id === '') {
    //     this.isBookmarked = false
    //   } else {
    //     this.isBookmarked = true
    //   }
    //   this.procBookmark = false
    //   this.cdr.detectChanges()
    // })
    this.procBookmark = true
    const bookmark = await this.bookmarkService.getBookmark(this.movieDetails.tmdbId)

    if (bookmark) {
      this.movieDetails.bookmark = bookmark
      this.isBookmarked = true
    }
    console.log('BOOKMARK: ', bookmark)
    this.procBookmark = false
    this.cdr.detectChanges()
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

    //   this.ipcService.call(IPCCommand.Bookmark, ['bookmark-remove', this.movieDetails.tmdbId])
    //   this.ipcService.call(IPCCommand.Bookmark, ['bookmark-add', this.movieDetails.tmdbId])
  }

  /**
   * Gets the mark as watched status of the movie
   */
  async getWatched() {
    // this.ipcService.call(IPCCommand.Watched, [IPCCommand.Get, this.movieDetails.tmdbId])
    this.ipcService.watchedSingle.subscribe(data => { })
    this.procWatched = true
    const res = await this.watchedService.getWatched(this.movieDetails.tmdbId)
    if (res) {
      this.movieDetails.watched = res
      this.isWatched = true
    }
    this.procWatched = false
    this.cdr.detectChanges()
  }

  async toggleWatched(percentage: string) {
    this.procWatched = true
    let wDoc

    wDoc = await this.userDataService.toggleWatched(this.movieDetails)
    this.isWatched = !this.isWatched
    console.log('WATCHEDADD/remove:', wDoc)
    this.procWatched = false
    this.cdr.detectChanges()

    // if (!this.movieDetails.watched || !this.movieDetails.watched.id) {
    //   wDocId = await this.userDataService.saveUserData('watched', this.movieDetails)
    //   this.movieDetails.watched = wDocId
    // } else {
    //   wDocId = await this.watchedService.removeWatched(this.movieDetails.watched.id)
    //   this.movieDetails.watched = null
    // }
    // console.log('WATCHEDADD/remove:', wDocId)
    // this.procWatched = false
    // this.cdr.detectChanges()

    //   this.ipcService.call(IPCCommand.Watched, [IPCCommand.Add, this.movieDetails.tmdbId])
    //   this.ipcService.call(IPCCommand.Watched, [IPCCommand.Remove, this.movieDetails.tmdbId])
  }

  /**
   * Gets movie offline
   * @param val imdb id
   */
  getMovieDataOffline(val: any) {
    this.ipcService.call(this.ipcService.IPCCommand.MovieMetadata, [this.ipcService.IPCCommand.Get, val])
  }

  async getMovieFromLibrary() {
    const val = this.movieDetails.tmdbId
    const result = await this.ipcService.getMovieFromLibrary(val)
    console.log(result);
    // this.streamLink = result
    this.cdr.detectChanges()
  }

  saveMovieDataOffline(val: any) {
    this.ipcService.call(this.ipcService.IPCCommand.MovieMetadata, [this.ipcService.IPCCommand.Set, val])
  }

  /**
   * Gets movie details, torrents
   * @param val tmdb id
   */
  getMovieOnline(val: any) {
    // tt2015381 is Guardians of the galaxy 2014; for testing only
    console.log('getMovie initializing with value...', val);

    this.movieService.getTmdbMovieDetails(val, [], 'videos,images,credits,similar,external_ids,recommendations').pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      // this.movieService.getTmdbMovieDetails(val, [], 'videos,images,credits,similar,external_ids,recommendations').subscribe(data => {
      console.log('got from getMovieOnline ', data)
      this.selectedMovie = data;
      const myObject = this.selectedMovie
      this.movieDetails.convertToMdbObject(myObject)
      this.loadVideoData()
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
        this.torrents.sort(function (a, b) { return b.peers - a.peers });
      }
      this.cdr.detectChanges()
    });
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
    this.dataService.updateDiscoverQuery([type, id, name])
    this.router.navigate([`/discover`]);
    // this.router.navigate([`/discover`], { relativeTo: this.activatedRoute });
  }

  goToMovie(val: string) {
    const highlightedId = val
    this.dataService.updateHighlightedMovie(highlightedId);
    this.router.navigate([`/details/${highlightedId}`]);
    this.cdr.detectChanges()
    // this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });
  }

  goToPerson(val) {
    this.router.navigate([`/person-details/${val}`], { relativeTo: this.activatedRoute });
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
}
