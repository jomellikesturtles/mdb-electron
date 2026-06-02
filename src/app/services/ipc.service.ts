/**
 * IPC renderer comm to the main.
 * TODO: change behaviorsubjects to something else.
 */
/**
 * Service to communicate to ipc main
 */
import { environment } from '@environments/environment';
import { RendererToMainChannels, MainToRendererChannels } from '../../electron/core/contracts/ipc-channels';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { IRawLibrary } from './library.service';
import { LoggerService } from '@core/logger.service';
import { IAppError } from '@models/app-error.model';

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  libraryMovies = new BehaviorSubject<string[]>([]);
  libraryMovie = new BehaviorSubject<string[]>([]);
  bookmarkChanges = new BehaviorSubject<IBookmarkChanges[]>([]);
  movieIdentified = new BehaviorSubject<any>({ id: 0 });
  search = new BehaviorSubject<any>([]); // searchList
  torrentVideo = new BehaviorSubject<string[]>([]);
  preferences = new BehaviorSubject<any>([]);
  streamLink = new BehaviorSubject<any>('');
  appErrors = new BehaviorSubject<IAppError | null>(null);
  private statsForNerds = new BehaviorSubject<any>({});
  statsForNerdsSubscribable = this.statsForNerds.asObservable();
  private ipcRenderer: any;
  private config: any;

  constructor(
    private loggerService: LoggerService
  ) {
    // Resolve environment safely (handles cases where 'environment' is the module object)
    this.config = (environment as any).environment || environment;
    console.log('RendererToMainChannels.MINIMIZE_APP: ', RendererToMainChannels.MINIMIZE_APP);
    if (this.isElectron2()) {
      this.ipcRenderer = (window as any).electron.ipcRenderer;

      this.ipcRenderer.on('torrent-video', (data: any) => {
        this.loggerService.info(`torrent-video data: ${data}`);
        this.torrentVideo.next(data);
      });

      this.ipcRenderer.on(MainToRendererChannels.PREFERENCES_GET_COMPLETE, (data) => {
        this.preferences.next(data);
        this.loggerService.info(`MainToRendererChannels.PREFERENCES_COMPLETE ${JSON.stringify(data)}`);
      });
      this.ipcRenderer.on(MainToRendererChannels.STREAM_LINK, (data) => {
        this.streamLink.next(data);
        this.loggerService.info(`MainToRendererChannels.STREAM_LINK ${data}`);
      });
      this.ipcRenderer.on(MainToRendererChannels.STATS, (data) => {
        this.statsForNerds.next(data);
        this.loggerService.info(`MainToRendererChannels.STATS ${JSON.stringify(data)}`);
      });
      this.ipcRenderer.on(MainToRendererChannels.ERROR, (data: IAppError) => {
        this.appErrors.next(data);
        this.loggerService.error(`Backend Error [${data.source}]: ${data.message} ${JSON.stringify(data)}`);
      });
    } else {
      this.loggerService.warn('IpcService: Electron environment not detected. IPC features will be disabled.');
    }
  }

  async getFiles() {
    // return new Promise<string[]>((resolve, reject) => {
    //   this.ipcRenderer.once('library-folders', (arg) => {
    //     resolve(arg);
    //   });
    //   this.ipcRenderer.send('retrieve-library-folders');
    // });
    return [];
  }

  /**
   * Gets the drives in the system.
   */
  async getSystemDrives() {
    // return new Promise<string[]>((resolve, reject) => {
    //   this.ipcRenderer.once('system-drives', (arg) => {
    //     resolve(arg);
    //   });
    // });
    // this.ipcRenderer.send('get-drives')
    return [];
  }
  /**
   * Opens the folder
   * @param data folder directory
   */
  openFolder(data: string) {
    if (!this.isElectron()) return;
    this.loggerService.info(`openFolder: ${data}`);
  }

  /**
   * Ipc renderer that sends command to main renderer to get movies from library db.
   * @param idList
   */
  getMoviesFromLibraryInList(idList: number[]): Promise<IRawLibrary[]> {
    if (!this.isElectron()) return Promise.resolve([]);
    const theUuid = uuidv4();
    this.sendToMain(RendererToMainChannels.LIBRARY, { operation: IpcOperations.FIND_IN_LIST, uuid: theUuid },
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
    if (!this.isElectron()) return Promise.resolve({ totalPages: 0, totalResults: 0, results: [] });
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
    if (!this.isElectron()) return Promise.resolve({ totalPages: 0, totalResults: 0, results: [] });
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
  getMovieFromLibrary(arg: number | string): Promise<IRawLibrary[]> {
    if (!this.isElectron()) return Promise.resolve([]);
    const theUuid = uuidv4();
    this.sendToMain(RendererToMainChannels.LIBRARY, { operation: IpcOperations.FIND, uuid: theUuid },
      { tmdbId: arg });
    return this.listenOnce(`library-${theUuid}`);
  }

  getProfile() {
    if (!this.isElectron()) return Promise.resolve(null);
    const theUuid = uuidv4();
    this.sendToMain(RendererToMainChannels.PROFILE, { operation: IpcOperations.FIND, uuid: theUuid });
    return this.listenOnce(`profile-${theUuid}`);
  }

  userData(headers: Headers, body: Body, params: IPCParams) {
    if (!this.isElectron()) return from(Promise.resolve(null));
    const theUuid = uuidv4();
    const channel = RendererToMainChannels.USER_DATA;
    headers.uuid = theUuid;
    this.sendToMainNew(channel, headers,
      body, params);
    return from(this.listenOnceWithTimeout(`${channel}-${theUuid}`));
  }

  // ----- END OF USER DATA
  startScanLibrary() {
    if (!this.isElectron()) return;
    this.sendToMain(RendererToMainChannels.SCAN_LIBRARY_START);
    this.ipcRenderer.on(MainToRendererChannels.ScanLibraryResult, e => {
      this.loggerService.info(`${MainToRendererChannels.ScanLibraryResult}: ${e}`);
    });
    this.ipcRenderer.once(MainToRendererChannels.ScanLibraryComplete, e => {
      this.loggerService.info('ScanLibraryComplete');
      this.ipcRenderer.removeListener(MainToRendererChannels.ScanLibraryResult, d => { });
    });
  }

  stopScanLibrary() {
    if (!this.isElectron()) return;
    this.sendToMain(RendererToMainChannels.SCAN_LIBRARY_STOP);
  }

  getPlayTorrent(hash: string): Promise<any> {
    if (!this.isElectron()) return Promise.resolve(null);
    this.sendToMain(RendererToMainChannels.PLAY_TORRENT, hash);
    return this.listenOnce(MainToRendererChannels.STREAM_LINK);
  }

  stopStream() {
    if (!this.isElectron()) return;
    this.sendToMain(RendererToMainChannels.STOP_STREAM);
  }

  playOfflineVideo(docId): Promise<any> {
    if (!this.isElectron()) return Promise.resolve(null);
    this.sendToMain(RendererToMainChannels.PLAY_OFFLINE_VIDEO_STREAM, docId);
    return this.listenOnce(MainToRendererChannels.STREAM_LINK);
  }

  getPreferences() {
    if (!this.isElectron()) return from(Promise.resolve(null));
    const theUuid = uuidv4();
    const channel = RendererToMainChannels.PREFERENCES;
    const headers: Headers = { uuid: '', operation: IpcOperations.FIND };
    headers.uuid = theUuid;
    this.sendToMainNew(channel, headers,
      null, {});
    return from(this.listenOnceWithTimeout(`${channel}-${theUuid}`));
  }

  savePreferences(val) {
    if (!this.isElectron()) return from(Promise.resolve(null));
    const theUuid = uuidv4();
    const channel = RendererToMainChannels.PREFERENCES;
    const headers: Headers = { uuid: theUuid, operation: IpcOperations.UPDATE };
    this.sendToMainNew(channel, headers,
      val, null);
    return from(this.listenOnceWithTimeout(`${channel}-${theUuid}`));
  }

  generalOperation(channel: RendererToMainChannels, data: any): Promise<any> {
    if (!this.isElectron()) return Promise.resolve(null);
    const theUuid = uuidv4();
    this.sendToMain(channel.toString(), { operation: IpcOperations.SAVE, uuid: theUuid }, data);
    return this.listenOnce(`${channel}-${theUuid}`);
  }

  changeSubtitle(): Promise<any> {
    if (!this.isElectron()) return Promise.resolve(null);
    this.sendToMain(RendererToMainChannels.GET_SUBTITLE);
    return this.listenOnce(MainToRendererChannels.SUBTITLE_PATH);
  }

  private isElectron(): boolean {
    const runConfig = this.config ? this.config.runConfig : null;
    // return !!(runConfig && runConfig.electron && (window as any).electron && (window as any).electron.ipcRenderer);
    return !!(runConfig && runConfig.electron);
  }
  private isElectron2(): boolean {
    const runConfig = this.config ? this.config.runConfig : null;
    return !!(runConfig && runConfig.electron && (window as any).electron && (window as any).electron.ipcRenderer);
    // return !!(runConfig && runConfig.electron && (window as any).electron && (window as any).electron.ipcRenderer);
  }

  minimizeWindow() {
    if (this.isElectron()) {
      this.sendToMain(RendererToMainChannels.MINIMIZE_APP);
    }
  }
  minimizeRestoreWindow() {
    if (this.isElectron()) {
      this.sendToMain(RendererToMainChannels.RESTORE_APP);
    }
  }
  exitApp() {
    if (this.isElectron()) {
      this.sendToMain(RendererToMainChannels.EXIT_APP);
    }
  }

  private removeListener(channel: string) {
    if (!this.isElectron()) return;
    this.loggerService.info(`REMOVING LISTENER ${channel}`);
    this.ipcRenderer.removeListener(channel, d => { });
  }

  private sendToMain(channel: string, headers?: Headers | string, body?: Body) {
    if (!this.isElectron()) return;
    try {
      this.ipcRenderer.send(channel, [headers, body]);
      this.loggerService.info(`sent to ipc... ${channel} [${JSON.stringify(headers)}, ${JSON.stringify(body)}]`);
    } catch (e) {
      this.loggerService.error(`'failed to send Ipc: ${channel} [${JSON.stringify(headers)}, ${JSON.stringify(body)}] | ${e}`);
    }
  }

  private sendToMainNew(channel: string, headers: Headers, body: Body, params?: IPCParams) {
    if (!this.isElectron()) return;
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
    if (!this.isElectron()) return Promise.resolve(null);
    return new Promise<any>((resolve, reject) => {
      try {
        this.ipcRenderer.once(channel, (arg) => {
          this.loggerService.info(`channel: ${JSON.stringify(channel)}  arg: ${arg}`);
          resolve(arg);
        });
      } catch (e) {
        this.loggerService.error(`listen ${JSON.stringify(channel)}  failed | ${e}`);
        resolve(null);
      }
    });
  }

  private listenOnceWithTimeout(channel: string, timeoutMillis = 300000) {
    if (!this.isElectron()) return Promise.resolve(null);
    const promise = new Promise<any>((resolve, reject) => {
      try {
        this.ipcRenderer.once(channel, (arg) => {
          this.loggerService.info(`channel: ${JSON.stringify(channel)} arg: ${arg}`);
          resolve(arg);
        });
      } catch (e) {
        this.loggerService.error(`listen ${JSON.stringify(channel)} failed | ${e}`);
        reject(null);
      }
    });
    const timeout = new Promise((resolve, reject) =>
      setTimeout(
        () => {
          if (this.ipcRenderer) {
            this.ipcRenderer.removeListener(channel, e => {
              this.loggerService.warn(`Removed ipc listener ${channel}`);
            });
          }
          this.loggerService.error(`removed ${JSON.stringify(channel)} listener`);
          reject(`Timed out after ${timeoutMillis} ms.`);
        },
        timeoutMillis));
    return Promise.race([
      promise,
      timeout
    ]);

  }

  // IPCCommand and IPCChannel should be updated to use the new enums or direct references
  // if you still need these for backward compatibility
  IPCCommand = RendererToMainChannels;
  IPCChannel = MainToRendererChannels;
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
  tmdbId?: number | string;
  idList?: number[] | string;
  _id?: string | number;
  [x: string]: any;
}

export interface IPCParams {
  query?: Object;
  sort?: Object;
  page?: number;
  size?: number;
  // skip?: number;
  // limit?: number;
  [x: string]: any;
  // limit: number, offset: number, sortBy: string, type: string;
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
