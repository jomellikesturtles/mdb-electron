import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, Subscriber, forkJoin } from 'rxjs';
// import 'rxjs/add/operator/retry';
// import 'rxjs/add/operator/catch';
import { catchError, map, tap, retry } from 'rxjs/operators';
// import { Test, Movie, Torrent } from '../subject'
import { ITorrent } from '../interfaces'
import { forEach } from '@angular/router/src/utils/collection';
import { IpcService, IpcCommand } from '../services/ipc.service'
import { DomSanitizer } from '@angular/platform-browser'
import { Pipe, PipeTransform } from '@angular/core';
import { REGEX_IMDB_ID } from '../constants';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TorrentService {

  constructor(
    private http: HttpClient,
    private ipcService: IpcService,
    private sanitizer: DomSanitizer) { }

  trackers = [`udp://glotorrents.pw:6969/announce`,
    `udp://tracker.opentrackr.org:1337/announce`,
    `udp://torrent.gresille.org:80/announce`,
    `udp://tracker.openbittorrent.com:80`,
    `udp://tracker.coppersurfer.tk:6969`,
    `udp://tracker.leechers-paradise.org:6969`,
    `udp://p4p.arenabg.ch:1337`,
    `udp://tracker.internetwarriors.net:1337`]
  fileName = 'torrent_dump_full.csv'
  testFileName = 'torrent_dump_mini.csv'
  assetsDirectory = '../assets/'
  fileLine: string[]
  torrentsInfo = []
  displayedTorrentsInfo = []
  ytsUrl = 'https://yts.am/api/v2/list_movies.json'

  getTorrentsOnline(imdbId: String) {
    // tt2015381
    let url = `${this.ytsUrl}?query_term=${imdbId}`
    return this.http.get<any>(url).pipe(map(data => {
      // let torrents: Torrent[];
      return data.data.movies[0].torrents;
    }))
  }
  /**
   * Searches torrents offline
   * @param val imdb or title
   */
  async getTorrentsOffline(val: string[]) {
    console.log('in getTorrentsOffline...; to be removed, jquery will handle instead')

    this.ipcService.call(IpcCommand.SearchTorrent, val)
    // return new Promise<any>((resolve, reject) => {
    //   this.ipcRenderer.once('library-movies', (event, arg) => {
    //     console.log('library-movies', arg);
    //     resolve(arg);
    //   });
    // });

  }

  getTorrents(val): Observable<any> {
    let result
    if (typeof val === 'string' && val.trim().match(REGEX_IMDB_ID)) {
      result = this.getTorrentsOnline(val);
    } else {
      result = this.getTorrentsOffline(val);
    }
    // this.sanitize(result)
    return result
  }

  searchTorrentsByQuery(val: string): Observable<any> {
    console.log('insearchtorentsquery')
    val = 'tt0499549'
    const url = `${this.ytsUrl}?query_term=${val}`
    // let result = this.http.get<any>(url).pipe(
    //   tap(_ => this.log(`searched torrents for ${val}`)),
    //   catchError(this.handleError<any>('search torrents fail')))
    const result = this.http.get<any>(url).pipe(map(response => response))
    // console.log('result: ', JSON.parse(result.))
    console.log('result: ', result)
    return result
  }

  /**
   * Sanitizes magnet link
   * @param torrent Torrent object
   */
  sanitize(torrent: ITorrent) {
    let val
    if (torrent.hash.length !== 40) {
      val = this.getMagnetLinkWithImproperHash(torrent.hash, torrent.name);
    } else {
      val = this.getMagnetLinkWithProperHash(torrent.hash);
    }
    return this.sanitizer.bypassSecurityTrustUrl(val);
  }

  getMagnetLinkWithProperHash(hash: string) {
    const base = `magnet:?xt=urn:btih:${hash}`
    return base
  }

  // test value: hKhdWMQTrHqcPpmm4oDz+tlixWQ=;"Passengers.2016.1080p.Bluray.x265.10bit-z97"
  getMagnetLinkWithImproperHash(base64: string, name: string) {
    let base = 'magnet:?xt=urn:btih:' + this.getInfoHash(base64);
    let withname = base + '&dn=' + this.urlencode(name);
    // if (bestTrackers.length > 4){
    //     for (let c = 0; c < 5; c++) {
    //         withname = withname + '&tr=' + urlencode(bestTrackers[c].announce)
    //     }
    // } else {
    //     if (allTrackers.length > 0) {
    //         let i = allTrackers.length > 4 ? 5 : allTrackers.length;
    //         allTrackers.sort(function(a, b){return 0.5 - Math.random()});
    //         for (let c = 0; c < i; c++) {
    //             withname = withname + '&tr=' + urlencode(allTrackers[c])
    //         }
    //     } else {
    //         popMsg('No trackers were found. Magnet link won\'t contain any trackers. Try updating trackers', 'warning');
    //     }
    //     if (!bestTrackers.length > 0){
    //         popMsg('Keep in mind that if you double-click on the torrent before download, app will select 5 best trackers for the magnet link', 'info');
    //     }
    // }
    return withname;
  }

  getInfoHash(base64: string) {
    let raw = atob(base64);
    let HEX = '';
    for (let i = 0; i < raw.length; i++) {
      let _hex = raw.charCodeAt(i).toString(16)
      HEX += (_hex.length == 2 ? _hex : '0' + _hex);
    }
    return HEX.toUpperCase();
  }

  urlencode(text: string) {
    return encodeURIComponent(text).replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
      .replace(/%20/g, '+');
  }
}

@Pipe({ name: 'simplifySize' })
export class SimplifySizePipe implements PipeTransform {
  transform(value: number): string {
    console.log('topipe value: ', value)
    let output = '';
    if (value < 1000) {
      output = value.toFixed(2).toString() + 'bytes';
    } else if (value >= 1000 && value < 1000000) {
      value = value / 1000;
      output = value.toFixed(2).toString() + 'kB';
    } else if (value >= 1000000 && value < 1000000000) {
      value = value / 1000000;
      output = value.toFixed(2).toString() + 'MB';
    } else if (value >= 100000000) {
      value = value / 1000000000;
      output = value.toFixed(2).toString() + 'GB';
    }
    return output;
  }
}

@Pipe({ name: 'magnet' })
export class MagnetPipe implements PipeTransform {
  transform(value: string): string {
    let output = '';
    // let output = 'magnet';
    // let client = '?xt=urn:btih';
    let hash = value;
    let fileName = '&dn=';
    output += hash;

    return output;
  }
}
// magnet:?xt=urn:btih:TORRENT_HASH&dn=Url+Encoded+Movie+Name&tr=http://track.one:1234/announce&tr=udp://track.two:80
// BE046ED20B048C4FB86E15838DD69DADB27C5E8A
// 13-2010
// &tr=http://track.one:1234/announce&tr=udp://track.two:80
// magnet:?xt=urn:btih:BE046ED20B048C4FB86E15838DD69DADB27C5E8A&dn=13-2010&tr=http://track.one:1234/announce&tr=udp://track.two:80
