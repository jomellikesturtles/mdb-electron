import { Component, OnInit, ChangeDetectorRef, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { IOmdbMovieDetail, IRating, ITorrent, ILibraryInfo, ITmdbMovieDetail, TmdbParameters } from '../../interfaces';
import { MdbMovieDetails } from '../../classes';
import { TEST_MOVIE_DETAIL, TEST_TMDB_MOVIE_DETAILS } from '../../mock-data';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../../services/data.service';
import { MovieService } from '../../services/movie.service';
import { TorrentService } from '../../services/torrent.service';
import { UtilsService } from '../../services/utils.service';
import { IpcService } from '../../services/ipc.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { TROUBLE_QUOTES } from '../../constants';
import { TMDB_FULL_MOVIE_DETAILS } from '../../mock-data-movie-details';
declare var $: any

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
  @Input() data: Observable<any>;

  isWatched = false
  isBookmarked = false
  selectedMovie;
  currentMovie: MdbMovieDetails;
  movieBackdrop;
  torrents: ITorrent[] = [];
  globalImdbId;
  testSelectedMovie = TEST_TMDB_MOVIE_DETAILS
  testMovieBackdrop = './assets/test-assets/wall-e_backdrop.jpg'
  isAvailable = false
  hasData = false
  movieMetadataSubscription
  libraryMovieSubscription
  myVideoPath = ""
  troubleQuote
  movieDetailsDirectors
  movieDetailsWriters
  movieDetailsProducers
  movieCertification
  movieDetails = new MdbMovieDetails()
  userLocation = 'US'
  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private movieService: MovieService,
    private ipcService: IpcService,
    private torrentService: TorrentService,
    private utilsService: UtilsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getTroubleQuote()
    // this.selectedMovie = this.testSelectedMovie
    console.time('convertTime');
    this.convertObject(TMDB_FULL_MOVIE_DETAILS)
    console.timeEnd('convertTime');
    this.movieDetailsDirectors = this.getDirectors()
    this.movieDetailsWriters = this.getWriters()
    this.movieDetailsProducers = this.getProducers()
    this.movieCertification = this.getMovieCertification()
    this.getTorrents()
    this.getMovieFromLibrary()
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });

    // this.activatedRoute.params.subscribe(params => {
    //   console.log('activatedRoute.params', params);
    //   if (params.id) {
    //     console.log('params.imdbId true');
    //     // this.imdbId = params.id;
    //     this.getMovieOnline(params.id)
    //   } else {
    //     this.hasData = false
    //   }
    // });

    // this.movieMetadataSubscription = this.ipcService.movieMetadata.subscribe(value => {
    //   // console.log('this.ipcService.movieMetadata.subscribe ', value)
    //   if (value.length !== 0) {
    //     if (String(value) === 'empty') {
    //       console.log('getting from online')
    //       this.getMovieOnline(imdbId)
    //       this.getBackdrop(imdbId);
    //     } else {
    //       console.log('got from offline ', value)
    //       this.selectedMovie = value;
    //       this.getBackdrop(imdbId);
    //     }
    //   }
    //   this.cdr.detectChanges()
    // })

    // get availability of movie
    // this.libraryMovieSubscription = this.ipcService.libraryMovie.subscribe(value => {
    //   this.selectedMovie.isAvailable = value;
    //   this.cdr.detectChanges()
    // })

    // // commented for test
    // const imdbId = this.activatedRoute.snapshot.paramMap;
    // this.dataService.currentMovie.subscribe(data => {
    //   // ran twice
    //   console.log('fromdataservice: ', data);
    //   if (data) {
    //     this.getMovie(data);
    //     this.getBackdrop(data);
    //   } else {
    //     this.getMovie(imdbId);
    //     this.getBackdrop(imdbId);
    //   }
    // });
    // // end of commented for test
    $('[data-toggle="popover"]').popover()
    $('[data-toggle="tooltip"]').tooltip({ placement: 'top' })
    this.getMarkAsWatched()
  }

  ngOnDestroy(): void {
    // this.movieMetadataSubscription.unsubscribe()
    // this.libraryMovieSubscription.unsubscribe()
    // this.selectedMovie = null
  }

  convertObject(v) {

    Object.keys(v).forEach(key => {
      console.log(`converting ${key} with value `, v[key]);
      switch (key) {
        case 'Actors':
          this.movieDetails.releaseDate = v[key]
          break;
        case 'adult':
          this.movieDetails.isAdult = v[key]
          break;
        case 'Awards':
          this.movieDetails.awards = v[key]
          break;
        case 'backdrop_path':
          this.movieDetails.backgroundPath = v[key]
          break;
        case 'belongs_to_collection':
          this.movieDetails.belongsToCollection = v[key]
          break;
        case 'BoxOffice':
        case 'revenue':
          this.movieDetails.boxOffice = v[key]
          break;
        case 'Director':
          this.movieDetails.director = v[key]
          break;
        case 'Genre':
          this.movieDetails.genres = v[key]
          break;
        case 'homepage':
          this.movieDetails.website = v[key]
          break;
        case 'id':
          this.movieDetails.tmdbId = v[key]
          break;
        case 'imdb_id':
        case 'imdbID':
          this.movieDetails.imdbId = v[key]
          break;
        case 'Language':
        case 'spoken_languages':
          this.movieDetails.languages = v[key]
          break;
        case 'original_language':
          this.movieDetails.originalLanguage = v[key]
          break;
        case 'original_title':
          this.movieDetails.originalTitle = v[key]
          break;
        case 'Poster':
        case 'poster_path':
          this.movieDetails.posterPath = v[key]
          break;
        case 'Plot':
        case 'overview':
          this.movieDetails.plot = v[key]
          break;
        case 'Title':
          this.movieDetails.title = v[key]
          break;
        case 'TmdbID':
          this.movieDetails.tmdbId = v[key]
          break;
        case 'release_date':
        case 'Released':
          this.movieDetails.releaseDate = v[key]
          break;
        case 'vote_average':
          this.movieDetails.voteAverage = v[key]
          break;
        case 'vote_count':
          this.movieDetails.voteCount = v[key]
          break;
        case 'Writer':
          this.movieDetails.writer = v[key]
          break;
        case 'Year':
          this.movieDetails.releaseYear = v[key]
          break;

        default:
          this.movieDetails[key] = v[key]
          break;
      }
    });

    Object.keys(this.movieDetails).forEach(key => {
      console.log(`movieDetails key ${key} with value `, v[key]);
    })
  }

  getMovieCredits() {
    // TmdbParameters.
    const tmdbId = this.movieDetails.tmdbId
    this.movieService.getTmdbMovieDetails(tmdbId).subscribe(data => {
      console.log('got from getMovieCredits ', data)
      // this.selectedMovie = data;
      // this.saveMovieDataOffline(data)
    });
  }

  /**
   * Gets movie's watchlist status
   * @param val imdb id
   */
  getToWatchlist(val: string) {
    this.ipcService.getWatchlist(val)
  }

  /**
   * Adds movie into user's watchlist
   * @param val imdb id
   */
  addBookmark(val?: string) {
    this.ipcService.addToWatchlist(val)
  }

  /**
   * Removes movie from user's watchlist
   * @param val imdb id
   */
  removeBookmark(val: string) {
    this.ipcService.removeFromWatchlist(val)
  }

  /**
   * Gets the mark as watched status of the movie
   * @param val imdb id
   */
  getMarkAsWatched(val?: string) {
    if (!val) {
      this.ipcService.getMarkAsWatched(this.movieDetails.imdbId)
    } else {
      this.ipcService.getMarkAsWatched(val)
    }
  }

  /**
   * Adds watched status of the movie
   * @param val imdb id
   */
  addMarkAsWatched(val: string) {
    this.ipcService.addMarkAsWatched(val)
  }

  /**
   * Removes watched status of the movie
   * @param val imdb id
   */
  removeMarkAsWatched(val: string) {
    this.ipcService.removeMarkAsWatched(val)
  }

  /**
   * Gets movie offline
   * @param val imdb id
   */
  getMovieDataOffline(val: any) {
    this.ipcService.getMovieMetadata(val)
  }

  async getMovieFromLibrary() {
    const val = this.movieDetails.tmdbId
    const result = await this.ipcService.getMovieFromLibrary(val)
    console.log(result);
    this.myVideoPath = 'file:///' + result.directoryList[0]
    this.cdr.detectChanges()
  }

  saveMovieDataOffline(val: any) {
    console.log('setMovieMetadata ', val)
    this.ipcService.setMovieMetadata(val)
  }
  /**
   * Gets movie details, torrents
   * @param val tmdb id
   */
  getMovieOnline(val: any) {
    // tt2015381 is Guardians of the galaxy 2014; for testing only
    console.log('getMovie initializing with value...', val);
    // this.movieService.getMovieInfo(val.trim()).subscribe(data => {
    //   console.log('got from getMovieOnline ', data)
    //   this.selectedMovie = data;
    //   this.saveMovieDataOffline(data)
    // });
    this.movieService.getTmdbMovieDetails(val).subscribe(data => {
      console.log('got from getMovieOnline ', data)
      this.selectedMovie = data;
      const myObject = this.selectedMovie
      this.convertObject(myObject)
      this.hasData = true
      this.saveMovieDataOffline(data)
    });
  }

  getMovieCertification() {
    const myLoc = this.movieDetails.release_dates.results.find((e) => { return e.iso_3166_1 === this.userLocation })
    let toReturn = myLoc.release_dates.find((e) => { return e.type === 3 })
    toReturn = toReturn.certification
    return toReturn
  }

  /**
   * Gets the movie poster
   */
  getMoviePoster() {
    this.ipcService.getImage(this.selectedMovie.Poster, this.selectedMovie.imdbID, 'poster')
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
   * Gets torrents from online and offline
   * @param val name
   * @returns Torrent object
   */
  getTorrents(val?: string) {
    const releaseYear = this.getYear(this.movieDetails.releaseDate)
    const query = `${this.movieDetails.title} ${releaseYear}`
    console.log('getTorrents initializing... with val ', query);
    this.torrentService.getTorrents(query).subscribe(data => {
      const resultTorrents = data;
      this.torrents = resultTorrents.filter(obj => {
        if (!obj.name) {
          obj.name = `${this.movieDetails.Title} ${obj.quality} ${obj.type}`;
        }
        return obj;
      });
    });
  }

  /**
   * Opens link externally
   * @param param1 link type
   * @param param2 id
   */
  goToLink(param1, param2?) {
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
        url = `https://www.imdb.com/title/${this.movieDetails.imdbId}`
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
    this.ipcService.openLinkExternal(url)
  }

  goToMovie(val) {
    // this.selectedMovie = movie;
    const highlightedId = val
    this.dataService.updateHighlightedMovie(highlightedId);
    this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });
  }

  goToPerson(val) {
    this.router.navigate([`/person-details/${val}`], { relativeTo: this.activatedRoute });
  }

  goToFullCredits() {
    const val = this.movieDetails.tmdbId
    this.router.navigate([`/credits/${val}`], { relativeTo: this.activatedRoute });
  }

  goToReleaseYear(val) {
    console.log(val);
  }
  goToGenre(val) {
    console.log(val);
  }

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
      if (crew.job === 'Screenplay') { toReturn.push(crew) }
    });
    return toReturn
  }
  getProducers() {
    const toReturn = []
    this.movieDetails.credits.crew.forEach(crew => {
      if (crew.job === 'Producer') { toReturn.push(crew) }
    });
    return toReturn
  }

  getTroubleQuote() {
    const length = TROUBLE_QUOTES.length
    this.troubleQuote = TROUBLE_QUOTES[Math.floor(Math.random() * (-1 - length + 1)) + length]
  }
  sanitize(torrent: ITorrent) {
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




// @Pipe({ name: 'simplifySize' })
// export class SimplifySizePipe implements PipeTransform {
//   transform(val: string): string {
//     let output = '';
//     if (!val.trim().match(FILE_SIZE_REGEX)) {
//       output = val;
//     } else {
//       let value = Number(val);
//       if (value < 1000) {
//         output = value.toFixed(2).toString() + 'bytes';
//       } else if (value >= 1000 && value < 1000000) {
//         value = value / 1000;
//         output = value.toFixed(2).toString() + 'kB';
//       } else if (value >= 1000000 && value < 1000000000) {
//         value = value / 1000000;
//         output = value.toFixed(2).toString() + 'MB';
//       } else if (value >= 100000000) {
//         value = value / 1000000000;
//         output = value.toFixed(2).toString() + 'GB';
//       }
//     }
//     return output;
//   }
// }
// @Pipe({ name: 'magnet' })
// export class MagnetPipe implements PipeTransform {
//   transform(value: string): string {
//     let output = '';
//     // let output = 'magnet';
//     // let client = '?xt=urn:btih';
//     const hash = value;
//     const fileName = '&dn=';
//     output += hash;

//     return output;
//   }
// }
