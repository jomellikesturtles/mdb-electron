/**
 * IPC renderer comm to the main.
 * TODO: change behaviorsubjects to something else.
 */
/**
 * Service to communicate to ipc main
 */
import { environment } from '@environments/environment';
import * as IPCRendererChannel from '../../assets/IPCRendererChannel.json';
import * as IPCMainChannel from '../../assets/IPCMainChannel.json';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { IpcRenderer, ipcRenderer } from 'electron';
import { IRawLibrary } from './library.service';
import { LoggerService } from '@core/logger.service';

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  libraryMovies = new BehaviorSubject<string[]>([]);
  libraryMovie = new BehaviorSubject<string[]>([]);
  bookmarkChanges = new BehaviorSubject<IBookmarkChanges[]>([]);
  movieIdentified = new BehaviorSubject<any>({ id: 0 });
  searchList = new BehaviorSubject<any>([]);
  torrentVideo = new BehaviorSubject<string[]>([]);
  preferences = new BehaviorSubject<any>([]);
  streamLink = new BehaviorSubject<any>('');
  private statsForNerds = new BehaviorSubject<any>({});
  statsForNerdsSubscribable = this.statsForNerds.asObservable();
  private ipcRenderer: typeof ipcRenderer;

  constructor(
    private loggerService: LoggerService
  ) {
    if (environment.runConfig.isElectron) {

      console.log((window as any).require('electron'));

      this.ipcRenderer = (window as any).require('electron').ipcRenderer;

      this.ipcRenderer.on('torrent-video', (event, data: any) => {
        console.log('event: ', event);
        console.log('data: ', data);
        this.torrentVideo.next(data);
      });

      this.ipcRenderer.on(IPCMainChannel.PREFERENCES_GET_COMPLETE, (event: Electron.IpcRendererEvent, data) => {
        this.preferences.next(data);
        console.log('IPCMainChannel.PREFERENCES_COMPLETE ', data);
      });
      this.ipcRenderer.on(IPCMainChannel.STREAM_LINK, (event: Electron.IpcRendererEvent, data) => {
        this.streamLink.next(data);
        console.log('IPCMainChannel.STREAM_LINK ', data);
      });
      this.ipcRenderer.on(IPCMainChannel.STATS, (event: Electron.IpcRendererEvent, data) => {
        this.statsForNerds.next(data);
        console.log('IPCMainChannel.STATS ', data);
      });
    }
  }

  async getFiles() {
    // return new Promise<string[]>((resolve, reject) => {
    //   this.ipcRenderer.once('library-folders', (event, arg) => {
    //     resolve(arg);
    //   });
    //   this.ipcRenderer.send('retrieve-library-folders');
    // });
  }

  /**
   * Gets the drives in the system.
   */
  async getSystemDrives() {
    // return new Promise<string[]>((resolve, reject) => {
    //   this.ipcRenderer.once('system-drives', (event, arg) => {
    //     resolve(arg);
    //   });
    // });
    // this.ipcRenderer.send('get-drives')
  }
  /**
   * Opens the folder
   * @param data folder directory
   */
  openFolder(data: string) {
    console.log('open', data);
    // this.ipcRenderer.send('go-to-folder', ['open', data])
  }

  /**
   * Ipc renderer that sends command to main renderer to get movies from library db.
   * @param idList
   */
  getMoviesFromLibraryInList(idList: number[]): Promise<any> {
    const theUuid = uuidv4();
    this.sendToMain('library', { operation: IpcOperations.FIND_IN_LIST, uuid: theUuid },
      { idList: idList });
    return this.listenOnce(`library-${theUuid}`);
  }

  /**
   * Paginated, first page.
   * @param collectionName
   * @param order
   * @param size
   */
  getMultiplePaginatedFirst(collectionName: string, sort: string, size?: number): Promise<IUserDataPaginated> {
    const theUuid = uuidv4();
    this.sendToMain(collectionName, { operation: IpcOperations.GET_BY_PAGE, uuid: theUuid },
      { sort: sort, size: size, lastVal: 0 });
    return this.listenOnce(`${collectionName}-${theUuid}`);
  }

  /**
   * Paginated, NOT first page.
   * @param collectionName
   * @param order
   * @param limit
   * @param lastVal
   */
  getMultiplePaginated(collectionName: string, sort: string, limit?: number, lastVal?: string | number): Promise<IUserDataPaginated> {
    const theUuid = uuidv4();
    this.sendToMain(collectionName, { operation: IpcOperations.GET_BY_PAGE, uuid: theUuid },
      { sort: sort, limit: limit, lastVal: lastVal });
    return this.listenOnce(`${collectionName}-${theUuid}`);
  }

  /**
   * Ipc renderer that sends command to main renderer to get specified movie from library db.
   * Replies offline library object(s).
   * @param arg imdb id or movie title and release year or tmdb id
   */
  getMovieFromLibrary(arg): Promise<IRawLibrary> {
    const theUuid = uuidv4();
    this.sendToMain('library', { operation: IpcOperations.FIND, uuid: theUuid },
      { tmdbId: arg });
    return this.listenOnce(`library-${theUuid}`);
  }

  userData(headers: Headers, body: Body, params?: Object) {
    const theUuid = uuidv4();
    const channel = 'user-data';
    // const channel = IPCRendererChannel.USER_DATA;
    headers.uuid = theUuid;
    this.sendToMainNew(channel, headers,
      body, params);
    return from(this.listenOnceWithTimeout(`${channel}-${theUuid}`));
  }

  // ----- END OF USER DATA
  startScanLibrary() {

    this.sendToMain(IPCRendererChannel.SCAN_LIBRARY_START);
    this.ipcRenderer.on(IPCMainChannel.ScanLibraryResult, e => {
      console.log(IPCMainChannel.ScanLibraryResult, e);
    });
    this.ipcRenderer.once(IPCMainChannel.ScanLibraryComplete, e => {
      console.log('completscan');
      this.ipcRenderer.removeListener(IPCMainChannel.ScanLibraryResult, d => { });
    });
  }

  stopScanLibrary() {
    this.sendToMain(IPCRendererChannel.SCAN_LIBRARY_STOP);
  }

  getPlayTorrent(hash: string): Promise<any> {
    this.sendToMain(IPCRendererChannel.PLAY_TORRENT, hash);
    return this.listenOnce(`stream-link`);
  }

  stopStream() {
    this.sendToMain(IPCRendererChannel.STOP_STREAM);
  }

  playOfflineVideo(docId): Promise<any> {
    this.sendToMain(IPCRendererChannel.PLAY_OFFLINE_VIDEO_STREAM, docId);
    return this.listenOnce(`stream-link`);
  }

  getPreferences() {

    this.sendToMain(IPCRendererChannel.PREFERENCES_GET);
    // this.ipcRenderer.addListener(IPCMainChannel.PREFERENCES_GET_COMPLETE, this.pref)

    // (event, data: any) => {
    // console.log('IPCMainChannel.PREFERENCES_COMPLETE ', data)
    // this.pref()
    // this.preferences.next(data)
    // this.ipcRenderer.removeListener(IPCMainChannel.PREFERENCES_GET_COMPLETE, e => { })
    // })
  }

  savePreferences(val) {
    this.sendToMain(IPCRendererChannel.PREFERENCES_SET, val);
    // this.ipcRenderer.on(IPCMainChannel.PREFERENCES_SET_COMPLETE, (event, data: any) => {
    //   console.log('IPCMainChannel.PREFERENCES_SET_COMPLETE ', data)
    //   this.preferences.next(data)
    //   this.ipcRenderer.removeListener(IPCMainChannel.PREFERENCES_SET_COMPLETE, d => { })
    // })
  }

  generalOperation(channel: typeof IPCRendererChannel, data: any): Promise<any> {
    const theUuid = uuidv4();
    this.sendToMain(channel.toString(), { operation: IpcOperations.SAVE, uuid: theUuid }, data);
    return this.listenOnce(`${channel}-${theUuid}`);
  }

  changeSubtitle(): Promise<any> {
    this.sendToMain("get-subtitle");
    return this.listenOnce('subtitle-path');
  }

  minimizeWindow() {
    this.sendToMain(this.IPCCommand.MinimizeApp);
  }
  minimizeRestoreWindow() {
    this.sendToMain(this.IPCCommand.RestoreApp);
  }
  exitApp() {
    this.sendToMain(this.IPCCommand.ExitApp);
  }

  private removeListener(channel: string) {
    console.log('REMOVING LISTENER', channel);
    this.ipcRenderer.removeListener(channel, d => { });
  }

  private sendToMain(channel: string, headers?: Headers | string, body?: Body) {
    try {
      this.ipcRenderer.send(channel, [headers, body]);
      console.log('sent to ipc... ', channel, [headers, body]);
    } catch {
      console.log('failed to send Ipc: ', channel, [headers, body]);
      this.loggerService.error(`'failed to send Ipc: ${channel} [${headers}, ${body}]`);
    }
  }

  private sendToMainNew(channel: string, headers: Headers, body: Body, params?: any) {
    const ipcContext: IPCContext = { headers, body, params };
    const ipcContextStr: string = JSON.stringify(ipcContext); //serialize
    try {
      this.loggerService.info(`sending to ipc...:  ${channel}  ipcContextStr: ${ipcContextStr}`);
      this.ipcRenderer.send(channel, ipcContextStr);
    } catch (e) {
      this.loggerService.error(`'failed to send Ipc: ${channel} | ${ipcContextStr} | ${e}`);
    }
  }

  private listenOnce(channel: string, timeoutSeconds = 300) {
    return new Promise<any>((resolve, reject) => {
      try {
        this.ipcRenderer.once(channel, (event, arg) => {
          this.loggerService.info(`channel:  ${channel}  arg: ${arg}`);
          resolve(arg);
        });
      } catch {
        this.loggerService.error(`listen ${channel} failed`);
        resolve(null);
      }
    });
  }

  private listenOnceWithTimeout(channel: string, timeoutMillis = 30) {
    // return new Promise<any>((resolve, reject) => {
    //   try {
    //     this.ipcRenderer.once(channel, (event, arg) => {
    //       this.loggerService.info(`channel:  ${channel}  arg: ${arg}`);
    //       resolve(arg);
    //     });
    //   } catch {
    //     this.loggerService.error(`listen ${channel} failed`);
    //     resolve(null);
    //   }
    // });
    const promise = new Promise<any>((resolve, reject) => {
      try {
        this.ipcRenderer.once(channel, (event, arg) => {
          this.loggerService.info(`channel:  ${channel}  arg: ${arg}`);
          resolve(arg);
        });
      } catch {
        this.loggerService.error(`listen ${channel} failed`);
        reject(null);
      }
    });
    const timeout = new Promise((resolve, reject) =>
      setTimeout(
        () => reject(`Timed out after ${timeoutMillis} ms.`),
        timeoutMillis));
    return Promise.race([
      promise,
      timeout
    ]);

  }

  IPCCommand = IPCRendererChannel['default'];
  IPCChannel = IPCMainChannel['default'];
}

interface IPCContext {
  headers?: Headers;
  body?: Body;
  params?: any;
}

interface Headers {
  operation?: IpcOperations,
  uuid?: string,
  subChannel?: string;
}

interface Body {
  tmdbId?: number;
  idList?: number[];
  _id?: string | number;
  [x: string]: any;
}

export interface IPCParams {
  limit: number, offset: number, sortBy: string, type: string;
}

export enum IpcOperations {
  FIND = 'find',
  FIND_ONE = 'find-one',
  FIND_IN_LIST = 'find-in-list',
  UPDATE = 'update',
  SAVE = 'save',
  REMOVE = 'remove',
  GET_BY_PAGE = 'get-by-page',
  COUNT = 'count'
}

export enum SubChannel {
  LIST = 'list',
  LIST_LINK_MEDIA = 'listLinkMedia',
  FAVORITE = 'favorite',
  BOOKMARK = 'bookmark',
  ALL = 'all',
  PLAYED = 'played',
  PROGRESS = 'progress',
  REVIEW = 'review'
}

export interface IBookmarkChanges {
  change: BookmarkChanges;
}

export enum BookmarkChanges {
  UPDATE = 'update',
  DELETE = 'delete',
  INSERT = 'insert'
}

export interface IBookmark {
  tmdbId: number,
  imdbId: string,
  id: string;
}

interface ILibrary {
  title?: string,
  year?: number,
  tmdbId?: number,
  imdbId?: string,
  libraryList: ILibraryData[];
}

interface ILibraryData {
  fullFilePath: string,
  _id: string;
}

export interface IUserDataPaginated {
  totalPages: number,
  totalResults: number,
  page?: number,
  results: any[],
}
