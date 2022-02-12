import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, Subscriber, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MDBTorrent, ITPBTorrent } from '@models/interfaces'
import { IpcService } from '@services/ipc.service'
import { DomSanitizer } from '@angular/platform-browser'
import { Pipe, PipeTransform } from '@angular/core';
import { STRING_REGEX_IMDB_ID } from '../../shared/constants';
import { IYTSSingleQuery, YTSTorrent } from '@models/yts-torrent.model';
import { CacheService } from '../cache.service';
import GeneralUtil from '@utils/general.util';

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
    private cacheService: CacheService,
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
  ytsUrl = 'https://yts.mx/api/v2/list_movies.json'
  ytsUrl2 = 'https://yts.am/api/v2/list_movies.json'


  /**
   * Gets torrent from online.
   */
  getTorrentsOnline(imdbId: string): Observable<IYTSSingleQuery | null> {
    // tt2015381 - guardians of the galaxy
    return this.cacheService.get(imdbId + '_YT', this.torrentsOnline(imdbId))
  }
  /**
   * Searches torrents offline
   * @param val imdb or title
   * @param year year
   */
  async getTorrentsOffline(val: string, year: string | number) {
    // this.ipcService.call(this.ipcService.IPCCommand.SearchTorrent, [val, year])
  }

  /**
   * TODO: add checking for online source connnection.
   * @param val `[title, year]`
   */
  getTorrents(query: string, year?: string | number): Observable<any> {
    let result
    const REGEX_IMDB_ID = new RegExp(STRING_REGEX_IMDB_ID, `gi`);
    if (typeof query === 'string' && query.trim().match(REGEX_IMDB_ID)) {
      result = this.getTorrentsOnline(query);
    } else {
      result = this.getTorrentsOffline(query, year);
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
  sanitize(torrent: MDBTorrent) {
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

  /**
   * Converts trrents to MDB torrent regardless of source. ie thepiratebay, yts
   */
  mapTorrent(rawTorrent: ITPBTorrent | YTSTorrent): MDBTorrent {
    let newTorrent = new MDBTorrent()
    // check yts properties first
    newTorrent.hash = rawTorrent.hash
    newTorrent.sizeBytes = rawTorrent.hasOwnProperty('size_bytes') ? rawTorrent['size_bytes'] : rawTorrent['sizeBytes']
    newTorrent.size = rawTorrent.hasOwnProperty('size') ? rawTorrent['size'] :
    GeneralUtil.prettyBytes(rawTorrent['sizeBytes'])
    newTorrent.name = rawTorrent.hasOwnProperty('name') ? rawTorrent['name'] : null
    newTorrent.dateUploaded = rawTorrent.hasOwnProperty('date_uploaded') ? rawTorrent['date_uploaded'] : rawTorrent['added']
    newTorrent.dateUploadedUnix = rawTorrent.hasOwnProperty('date_uploaded_unix') ? rawTorrent['date_uploaded_unix'] : (new Date(rawTorrent['added']).getTime() / 1000)
    newTorrent.magnetLink = this.getMagnetLinkWithProperHash(rawTorrent.hash)
    newTorrent.isYts = rawTorrent.hasOwnProperty('url') ? true : false
    newTorrent.url = rawTorrent.hasOwnProperty('url') ? rawTorrent['url'] : this.getMagnetLinkWithProperHash(rawTorrent.hash)
    newTorrent.quality = rawTorrent.hasOwnProperty('quality') ? rawTorrent['quality'] : 'unknown'
    newTorrent.seeds = rawTorrent.hasOwnProperty('seeds') ? rawTorrent['seeds'] : null
    newTorrent.peers = rawTorrent.hasOwnProperty('peers') ? rawTorrent['peers'] : null
    return newTorrent;
  }

  mapTorrentsList(rawTorrents: YTSTorrent[] | ITPBTorrent[]): MDBTorrent[] {
    let torrents: (ITPBTorrent | YTSTorrent)[] = []
    if (rawTorrents.hasOwnProperty('@meta') && rawTorrents['data'].count > 0) {  // if yts and has count
      torrents = rawTorrents['data'].movies[0].torrents // assuming there is only 1 movie or is searched with ID
    } else if (rawTorrents.length > 0) {
      torrents = rawTorrents
    }
    let newTorrents = []
    torrents.forEach((torrent: ITPBTorrent | YTSTorrent) => {
      newTorrents.push(this.mapTorrent(torrent))
    })
    return newTorrents;
  }

  /**
   * Gets the straming link with Hash.
   * @param hash hash
   * @returns streaming url
   */
  getStreamLink(hash: String): Observable<any> {
    // tt2015381 - guardians of the galaxy
    let url = `http://localhost:3000/getStreamLink/${hash}`

    return this.http.get<string>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getStreamLink')))
  }

  private torrentsOnline(imdbId: string): Observable<IYTSSingleQuery | null>  {
    let url = `${this.ytsUrl}?query_term=${imdbId}`
    return this.http.get<IYTSSingleQuery>(url)
  }

  /**
   * Error handler.
   * @param operation the operation
   * @param result result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`TorrentService: ${message} `);
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
