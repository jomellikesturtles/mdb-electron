import { Component, OnInit, Input } from '@angular/core';
import { Movie, Test, OmdbMovieDetail, Rating, Torrent } from '../../subject';
import { SELECTEDMOVIE } from '../../mock-data';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../../services/data.service';
import { MovieService } from '../../services/movie.service';
import { TorrentService } from '../../services/torrent.service';
import { ActivatedRoute } from '@angular/router';
import { log } from 'util';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})

/**
 * Get movie info, torrent, links, get if available in local
 */
export class DetailsComponent implements OnInit {
  @Input() testData: Test;

  constructor(
    private sanitizer: DomSanitizer,
    private movieService: MovieService,
    private dataService: DataService,
    private torrentService: TorrentService,
    private activatedRoute: ActivatedRoute
  ) {}

  results: any;
  str = 'this is test';
  // selectedMovie = SELECTEDMOVIE;
  selectedMovie: OmdbMovieDetail;
  movieBackdrop;
  torrents: Torrent[] = [];
  ngOnInit() {
    // this.torrentService.getTorrents(' tt0499549 ').subscribe(data => console.log(data[0]));
    // this.getMovie('tt0499549')
    // this.getTorrents('tt0499549')
    // this.getMovie(imdb_id)

    const imdbId = this.activatedRoute.snapshot.paramMap.get('imdbId');
    // commented for harmony
    this.dataService.currentMovie.subscribe(data => {
      // ran twice
      console.log('fromdataservice: ', data);
      if (data) {
        this.getMovie(data);
        this.getBackdrop(data);
      } else {
        this.getMovie(imdbId);
        this.getBackdrop(imdbId);
      }
    });
    // end of commented for harmony
  }
  goToGoogle(val) {
    console.log(val);
  }

  getMovie(val: any) {
    console.log('getMovie initializing with value...', val);
    // tt2015381 is Guardians of the galaxy 2014; for testing only
    this.movieService.getMovieInfo(val.trim()).subscribe(data => {
      this.selectedMovie = data;
      // this.getTorrents(data.Title)
    });
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

  getTestApi(): void {
    const str = 'thistest';
    console.log(`HeroService: ${str}`);
    this.movieService
      .getTestApi(1)
      .subscribe(testData => (this.testData = testData));
  }

  sanitize(torrent: Torrent) {
    return this.torrentService.sanitize(torrent);
  }

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
