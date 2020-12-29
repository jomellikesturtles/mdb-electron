import { Component, OnInit } from '@angular/core';
import { IpcService } from '../../services/ipc.service'
import { DISPLAYEDMOVIES, MOVIEGENRES } from '../../mock-data'
import { Router, ActivatedRoute } from '@angular/router'
import { DataService } from '../../services/data.service'
import { TorrentService } from '../../services/torrent.service'

@Component({
  selector: 'app-bulk-download',
  templateUrl: './bulk-download.component.html',
  styleUrls: ['./bulk-download.component.scss']
})
export class BulkDownloadComponent implements OnInit {

  displayedMovies = DISPLAYEDMOVIES
  selectedMovie = null;
  sampleJson = `{
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
  }`
  result: any

  constructor(
    private ipcService: IpcService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService) {
  }

  ngOnInit() {

    this.dataService.selectedMovies.subscribe(data => {
      data.forEach(element => {
        element.year = element.release_date.slice(0, element.release_date.indexOf('-'));
        this.displayedMovies = data;
      });
    })
  }
  // getTorrent

  getTorrents() {
    var localDisplayedMovies = this.displayedMovies

    // localDisplayedMovies.forEach(movie => {
    //   movie.torrents = this.getTorrentByTitle(movie)
    // });
  }

  getTorrentsByTitleAlgorithm(value) {
    this.ipcService.call(this.ipcService.IPCCommand.GetTorrentsTitle, value)
  }

  getTorrentByTitle(movie) {
    const title = movie.title;
    const year = movie.year;
    let torrents = null
    // assuming getting torrent from file now works
    switch (movie.imdbId) {
      case 'tt2015381':
        torrents = [
          {
            id: 1,
            name: 'Guardians of the Galaxy (2014) 1080p BrRip x264 - YIFY',
            size: 1988939229,
            hash: '11A2AC68A11634E980F265CB1433C599D017A759',
            checked: false
          },
          {
            id: 1,
            name: 'Guardians of the Galaxy Vol. 2 (2017) 720p BrRip x264 - VPPV',
            size: 1215947108,
            hash: '68132C479348C1AA2618D55C8BBEC6EB2597A5BA',
            checked: false
          },
        ]
        break;
      case 'tt5215952':
        torrents = [
          {
            id: 1,
            name: 'The.Wailing.2016.1080p.BluRay.10bit.HEVC-MkvCage [aka Gokseong]',
            size: 3976321027,
            hash: '2F157306E5114EA8044302586A89FDC4E0FAC2A1',
            checked: false
          },
        ]
        break;
      case 'tt1213641':
        torrents = [
          {
            id: 1,
            name: 'First.Man.2018.HC.HDRip.XviD.AC3-EVO',
            size: 1474599225,
            hash: '885CCCAD7F1942A515DA564FCF62933A105931DB',
            checked: false
          },
          {
            id: 2,
            name: 'First.Man.2018.720p.BRRip.x264.MkvCage',
            size: 1375985558,
            hash: '712837DCAA3F4275B89E640EB21DAE72D2E0C38B',
            checked: false
          },
        ]
        break;
      case 'tt0099785':
        torrents = [
          {
            id: 1,
            name: 'Home Alone (1990) 1080p BrRip x264 - YIFY',
            size: 1767740507,
            hash: '5FEFAC61C0F42FFC43946B3379A540D1A38F6480',
            checked: false
          }
        ]
        break;
      // case 'tt0087538':
      //   let torrents = [
      //     {
      //       id: 1,
      //       name: 'Guardians of the Galaxy (2014) 1080p BrRip x264 - YIFY',
      //       size: 1988939229,
      //       hash: '11A2AC68A11634E980F265CB1433C599D017A759',
      //       checked: false
      //     },
      //   ]
      //   return torrents

      //   break;
      // case 'tt0092099':
      //   let torrents = [
      //     {
      //       id: 1,
      //       name: 'Top Gun (1986) 1080p BrRip x264 - 1.29GB - YIFY',
      //       size: 1988939229,
      //       hash: '11A2AC68A11634E980F265CB1433C599D017A759',
      //       checked: false
      //     },
      //     {
      //       id: 1,
      //       name: 'Top Gun (1986) 720p BrRip x264 - 750MB - YIFY',
      //       size: 786726662,
      //       hash: '1E450B7823C44962D60932EDADF18E07D2B0A663',
      //       checked: false
      //     },
      //   ]
      //   return torrents

      //   break;
      // case 'tt0105236':
      //   let torrents = [
      //     {
      //       id: 1,
      //       name: 'Guardians of the Galaxy (2014) 1080p BrRip x264 - YIFY',
      //       size: 1988939229,
      //       hash: '11A2AC68A11634E980F265CB1433C599D017A759',
      //       checked: false
      //     },
      //   ]
      //   return torrents

      //   break;
      // case 'tt0145487':
      //   let torrents = [
      //     {
      //       id: 1,
      //       name: 'Guardians of the Galaxy (2014) 1080p BrRip x264 - YIFY',
      //       size: 1988939229,
      //       hash: '11A2AC68A11634E980F265CB1433C599D017A759',
      //       checked: false
      //     },
      //   ]
      //   return torrents

      //   break;
      // case 'tt0348150':
      //   let torrents = [
      //     {
      //       id: 1,
      //       name: 'Guardians of the Galaxy (2014) 1080p BrRip x264 - YIFY',
      //       size: 1988939229,
      //       hash: '11A2AC68A11634E980F265CB1433C599D017A759',
      //       checked: false
      //     },
      //   ]
      //   return torrents

      //   break;
      // case 'tt1213641':
      //   let torrents = [
      //     {
      //       id: 1,
      //       name: 'Guardians of the Galaxy (2014) 1080p BrRip x264 - YIFY',
      //       size: 1988939229,
      //       hash: '11A2AC68A11634E980F265CB1433C599D017A759',
      //       checked: false
      //     },
      //   ]
      //   return torrents

      //   break;
      // case 'tt0099785':
      //   let torrents = [
      //     {
      //       id: 1,
      //       name: 'Guardians of the Galaxy (2014) 1080p BrRip x264 - YIFY',
      //       size: 1988939229,
      //       hash: '11A2AC68A11634E980F265CB1433C599D017A759',
      //       checked: false
      //     },
      //   ]
      //   return torrents
      //   break;
      default:
        break;
    }
    return torrents
  }

  getTorrentByQuery() {

  }

  onSelectMovie(movie: any) {
    this.selectedMovie = movie
  }

  downloadMovie(movie) {
    const torrentsToDownload = movie[0].torrents.filter(obj => {
      return obj.checked === true
    })
  }

  /**
   * Removes movie from the displayed movies list
   * @param movie movie to remove
   */
  removeMovie(movie) {
    const newDisplayedMovies = this.displayedMovies.filter(obj => {
      console.log(obj.id != movie.id)
      return obj.id != movie.id
    })
    console.log('newDisplayedMovies', newDisplayedMovies);
    this.displayedMovies = newDisplayedMovies
    // const newDisplayedMovies = this.displayedMovies.filter(obj => {
    //   return obj.imdbId != movie.imdbId
    // })
    // this.displayedMovies = newDisplayedMovies
  }

  /**
   * Go to movie's detail
   * @param movie selected movie object
   */
  goToMovie(movie) {
    let tmdbId = movie.id
    this.router.navigate([`/details/${tmdbId}`], { relativeTo: this.activatedRoute })
  }
  // https://yts.lt/api/v2/movie_suggestions.json?movie_id=10
  /**
   * Downloads all checked torrents from the front-end
   */
  downloadAllChecked() {
    let torrentsToDownload = [];
    this.displayedMovies.forEach(movie => {
      const movieTorrents = movie.torrents
      if (movieTorrents) {
        // torrentsToDownload.push(movie.torrents.filter(torrent => {
        //   return torrent.checked === true;
        // }));
        movieTorrents.forEach(torrent => {
          if (torrent.checked == true) {
            torrentsToDownload.push(torrent)
          }
        });
      }
    });
    console.log(torrentsToDownload);
  }
}

export class SelectedMovie {
  title: string;
  year: number;
  plot: string;
  imdbId: string;
}
export class TorrentResult {
  status: string;
  statusMessage: string;
}

export class Test1 {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

class SerializationHelper {
  static toInstance<T>(obj: T, json: string): T {
    const jsonObj = JSON.parse(json);
    const fromJSONString = 'fromJSON'
    if (typeof obj[fromJSONString] === 'function') {
      obj[fromJSONString](jsonObj);
    }
    else {
      for (var propName in jsonObj) {
        obj[propName] = jsonObj[propName]
      }
    }

    return obj;
  }
}
