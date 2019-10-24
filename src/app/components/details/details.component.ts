import { Component, OnInit, ChangeDetectorRef, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Movie, Test, OmdbMovieDetail, Rating, Torrent, MdbMovieDetails } from '../../subject';
import { SELECTEDMOVIE, TEST_MOVIE_DETAIL } from '../../mock-data';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../../services/data.service';
import { MovieService } from '../../services/movie.service';
import { TorrentService } from '../../services/torrent.service';
import { IpcService } from '../../services/ipc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
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

  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private movieService: MovieService,
    private ipcService: IpcService,
    private torrentService: TorrentService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  results: any;
  str = 'this is test';
  // selectedMovie: OmdbMovieDetail;
  // selectedMovie: MdbMovieDetails;
  selectedMovie;
  movieBackdrop;
  torrents: Torrent[] = [];
  globalImdbId;
  testSelectedMovie = TEST_MOVIE_DETAIL
  testMovieBackdrop = './assets/test-assets/wall-e_backdrop.jpg'
  isAvailable = false
  hasData = true
  movieMetadataSubscription
  libraryMovieSubscription

  ngOnInit() {
    this.selectedMovie = null
    // this.testSelectedMovie.Poster = './assets/test-assets/wall-e_poster.jpg'
    this.selectedMovie = this.testSelectedMovie
    // this.movieBackdrop = this.testMovieBackdrop

    // let imdbId = 0
    // this.activatedRoute.params.subscribe(params => {
    //   console.log('activatedRoute.params', params);
    //   if (params.imdbId) {
    //     console.log('params.imdbId true');
    //     imdbId = params.imdbId;
    //     this.getMovieDataOffline(imdbId)
    //     this.getMovieFromLibrary(imdbId)
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
    this.libraryMovieSubscription = this.ipcService.libraryMovie.subscribe(value => {
      this.selectedMovie.isAvailable = value;
      this.cdr.detectChanges()
    })

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
  }

  ngOnDestroy(): void {
    this.movieMetadataSubscription.unsubscribe()
    this.libraryMovieSubscription.unsubscribe()
    this.selectedMovie = null
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
  addToWatchlist(val: string) {
    this.ipcService.addToWatchlist(val)
  }
  /**
   * Removes movie from user's watchlist
   * @param val imdb id
   */
  removeFromWatchlist(val: string) {
    this.ipcService.removeFromWatchlist(val)
  }

  /**
   * Gets the mark as watched status of the movie
   * @param val imdb id
   */
  getMarkAsWatched(val: string) {
    this.ipcService.getMarkAsWatched(val)
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

  getMovieFromLibrary(val: any) {
    this.ipcService.getMovieFromLibrary(val)
  }
  saveMovieDataOffline(val: any) {
    console.log('setMovieMetadata ', val)
    this.ipcService.setMovieMetadata(val)
  }
  /**
   * Gets movie details, torrents
   * @param val imdb id
   */
  getMovieOnline(val: any) {
    // tt2015381 is Guardians of the galaxy 2014; for testing only
    console.log('getMovie initializing with value...', val);
    //   // this.selectedMovie.LibraryInfo
    //   // this.getTorrents(data.Title
    this.movieService.getMovieInfo(val.trim()).subscribe(data => {
      console.log('got from getMovieOnline ', data)
      this.selectedMovie = data;
      this.saveMovieDataOffline(data)
    });
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
  getTorrents(val: string) {
    console.log('getTorrents initializing... with val ', val);
    this.torrentService.getTorrents(val).subscribe(data => {
      const resultTorrents = data;
      this.torrents = resultTorrents.filter(obj => {
        if (!obj.name) {
          obj.name = `${this.selectedMovie.Title} ${obj.quality} ${obj.type}`;
        }
        return obj;
      });
    });
  }

  /**
   * Opens link externally
   * @param param1 link to open
   */
  goToLink(param1) {
    let url = ''
    switch (param1) {
      case 'google':
        url = `https://www.google.com/search?q=${this.selectedMovie.Title} ${this.selectedMovie.Year}`
        break;
      case 'imdb':
        url = `https://www.imdb.com/title/${this.selectedMovie.imdbID}`
        break;
      default:
        break;
    }
    this.ipcService.openLinkExternal(url)
  }

  sanitize(torrent: Torrent) {
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
//     const fileSizeRegex = new RegExp(`^([0-9])\\d+$`, `g`);
//     let output = '';
//     if (!val.trim().match(fileSizeRegex)) {
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
