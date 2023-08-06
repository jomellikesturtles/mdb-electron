import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MDBTorrent, MDBTorrentAndMovieObject } from '@models/interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { STRING_REGEX_IMDB_ID } from '../../shared/constants';
import { IYTSSingleQuery } from '@models/yts-torrent.model';
import GeneralUtil from '@utils/general.util';
import { environment } from '@environments/environment';
import { TorrentQuery } from './torrent.query';
import { MDBTorrentModel, TorrentStore } from './torrent.store';

@Injectable({
  providedIn: 'root'
})
export class TorrentService {

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private torrentQuery: TorrentQuery,
    private torrentStore: TorrentStore
  ) { }

  TRACKERS = environment.torrent.trackers;
  assetsDirectory = '../assets/';
  fileLine: string[];
  torrentsInfo = [];
  displayedTorrentsInfo = [];
  YTS_URL = environment.yts.url;

  /**
   * TODO: add checking for online source connnection.
   * @param val `[title, year]`
   */
  getTorrents(query: string, year?: string | number): Observable<MDBTorrentAndMovieObject> {
    const REGEX_IMDB_ID = new RegExp(STRING_REGEX_IMDB_ID, `gi`);
    // if (typeof query === 'string' && query.trim().match(REGEX_IMDB_ID)) {
    return this.getTorrentsOnline(query);;
  }

  /**
   * Gets torrent from online.
   */
  private getTorrentsOnline(imdbId: string, refresh = false): Observable<MDBTorrentAndMovieObject> {
    // tt2015381 - guardians of the galaxy
    let entityId = 'torrent:' + imdbId;
    if (!this.torrentQuery.hasEntity(entityId) || refresh) {
      let url = `${this.YTS_URL}?query_term=${imdbId}`;
      return this.http.get<IYTSSingleQuery>(url).pipe(tap(_ => this.log('')),
        map((data: IYTSSingleQuery) => {
          const newData = new MDBTorrentAndMovieObject(data);
          const store: MDBTorrentModel = {
            id: entityId,
            mdbTorrentAndMovieObject: newData
          };
          this.torrentStore.add(store);
          return newData;
        }),
        catchError(this.handleError<any>('getTorrentsOnline')));
    }
    return of(this.torrentQuery.getEntity(entityId).mdbTorrentAndMovieObject);
  }

  searchTorrentsByQuery(val: string): Observable<any> {
    console.log('insearchtorentsquery');
    val = 'tt0499549';
    const url = `${this.YTS_URL}?query_term=${val}`;
    // let result = this.http.get<any>(url).pipe(
    //   tap(_ => this.log(`searched torrents for ${val}`)),
    //   catchError(this.handleError<any>('search torrents fail')))
    const result = this.http.get<any>(url).pipe(map(response => response));
    // console.log('result: ', JSON.parse(result.))
    console.log('result: ', result);
    return result;
  }

  /**
   * Sanitizes magnet link
   * @param torrent Torrent object
   */
  sanitize(torrent: MDBTorrent) {
    let val;
    if (torrent.hash.length !== 40) {
      val = this.getMagnetLinkWithImproperHash(torrent.hash, torrent.name);
    } else {
      val = GeneralUtil.getMagnetLinkWithProperHash(torrent.hash);
    }
    return this.sanitizer.bypassSecurityTrustUrl(val);
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
      let _hex = raw.charCodeAt(i).toString(16);
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
   * Gets the straming link with Hash.
   * @param hash hash
   * @returns streaming url
   */
  getStreamLink(hash: String): Observable<any> {
    // tt2015381 - guardians of the galaxy
    let url = `http://localhost:3000/getStreamLink/${hash}`;

    return this.http.get<string>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getStreamLink')));
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
