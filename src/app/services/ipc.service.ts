/**
 * IPC renderer comm to the main.
 * TODO: change behaviorsubjects to something else.
 */
import { environment } from './../../environments/environment';
import * as IPCRendererChannel from '../../assets/IPCRendererChannel.json';
import * as IPCMainChannel from '../../assets/IPCMainChannel.json';
import { v4 as uuidv4 } from 'uuid'
/**
 * Service to communicate to ipc main
 */
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, fromEvent } from 'rxjs'
import { ipcRenderer } from 'electron'
import { ILibraryInfo } from '../interfaces'
import { IRawLibrary } from './library.service';


@Injectable({
  providedIn: 'root'
})
export class IpcService {

  libraryMovies = new BehaviorSubject<string[]>([])
  libraryMovie = new BehaviorSubject<string[]>([])
  bookmarkChanges = new BehaviorSubject<IBookmarkChanges[]>([])
  movieIdentified = new BehaviorSubject<any>({ id: 0 })
  searchList = new BehaviorSubject<any>([])
  torrentVideo = new BehaviorSubject<string[]>([])
  preferences = new BehaviorSubject<any>([])
  streamLink = new BehaviorSubject<any>('')
  private statsForNerds = new BehaviorSubject<any>({})
  statsForNerdsSubscribable = this.statsForNerds.asObservable()
  private ipcRenderer: typeof ipcRenderer

  constructor() {
    if (environment.runConfig.electron) {
      this.ipcRenderer = (window as any).require('electron').ipcRenderer

      this.ipcRenderer.on('torrent-video', (event, data: any) => {
        console.log('event: ', event)
        console.log('data: ', data)
        this.torrentVideo.next(data)
      })
      // COMMENTED FOR ANGULAR UPDATE
      // function enumKeys<E>(e: E): (keyof E)[] {
      //   return Object.keys(e) as (keyof E)[];
      // }
      // for (const key of enumKeys(Channel)) {
      //   const locale: Channel = Channel[key];
      //   console.log(locale);
      //   this.listen(locale)
      // }

      this.ipcRenderer.on(IPCMainChannel.PREFERENCES_GET_COMPLETE, (event: Electron.IpcRendererEvent, data) => {
        this.preferences.next(data)
        console.log('IPCMainChannel.PREFERENCES_COMPLETE ', data)
      })
      this.ipcRenderer.on(IPCMainChannel.STREAM_LINK, (event: Electron.IpcRendererEvent, data) => {
        this.streamLink.next(data)
        console.log('IPCMainChannel.STREAM_LINK ', data)
      })
      this.ipcRenderer.on(IPCMainChannel.STATS, (event: Electron.IpcRendererEvent, data) => {
        this.statsForNerds.next(data)
        console.log('IPCMainChannel.STATS ', data)
      })
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

  call(message: string, args?: any) {

    if (environment.runConfig.electron) {
      console.log(`IPC Command: ${message}, args: ${args}`)
      this.ipcRenderer.send(message, args)
    }
  }

  /**
   * Listens to ipc renderer.
   * @param channel name of the channel
   */
  listen(channel: string): void | Promise<any> {
    if (environment.runConfig.electron) {
      console.log('LISTENING...');
      this.ipcRenderer.on(channel, (event, data: any) => {
        console.log(`ipcRenderer channel: ${channel} data: ${data}`)
        switch (channel) {
          case IPCMainChannel.BookmarkChanges:
            this.bookmarkChanges.next(data)
            break;
          case IPCMainChannel.LibraryMovies:
            this.libraryMovies.next(data)
            break;
          case IPCMainChannel.LibraryMovie:
            this.libraryMovie.next(data)
            break;
          default:
            console.log(`channel ${channel} uncaught`)
            break;
        }
      })
    }
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
    console.log('open', data)
    // this.ipcRenderer.send('go-to-folder', ['open', data])
  }

  /**
   * Ipc renderer that sends command to main renderer to get movies from library db.
   * @param idList
   */
  getMoviesFromLibraryInList(idList: number[]): Promise<any> {
    const theUuid = uuidv4()
    this.sendToMain('get-library-movies', { operation: IpcOperations.FIND_IN_LIST, uuid: theUuid },
      { idList: idList });
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`library-movies-${theUuid}`, (event, arg) => {
        console.log(`libraryMovies ${theUuid}`)
        resolve(arg);
      });
    });
  }

  /**
   * Paginated, first page.
   * @param collectionName
   * @param order
   * @param limit
   */
  getMultiplePaginatedFirst(collectionName: string, order: string, limit?: number): Promise<PageinatedObject> {
    const theUuid = uuidv4()
    this.sendToMain('get-library-movies', { operation: IpcOperations.GET_BY_PAGE, uuid: theUuid },
      { order: order, limit: limit, lastVal: 0 });
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`library-movies-${theUuid}`, (event, arg) => {
        console.log(`libraryMovies ${theUuid}`)
        resolve(arg);
      });
    });
  }

  /**
   * Paginated, NOT first page.
   * @param collectionName
   * @param order
   * @param limit
   * @param lastVal
   */
  getMultiplePaginated(collectionName: string, order: string, limit?: number, lastVal?: string | number): Promise<PageinatedObject> {
    const theUuid = uuidv4()
    this.sendToMain('get-library-movies', { operation: IpcOperations.GET_BY_PAGE, uuid: theUuid },
      { order: order, limit: limit, lastVal: lastVal });
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`library-movies-${theUuid}`, (event, arg) => {
        console.log(`libraryMovies ${theUuid}`)
        resolve(arg);
      });
    });
  }

  /**
   * Ipc renderer that sends command to main renderer to get specified movie from library db.
   * Replies offline library object(s).
   * @param arg imdb id or movie title and release year or tmdb id
   */
  getMovieFromLibrary(arg) {
    const theUuid = uuidv4()
    this.sendToMain('get-library-movies', { operation: IpcOperations.FIND, uuid: theUuid },
      { tmdbId: arg });
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`library-movie-${theUuid}`, (event, arg) => {
        console.log(`getMovieFromLibrary ${theUuid}`)
        resolve(arg);
      });
    });
  }

  // // user services; watchlist/bookmarks, watched
  getBookmark(data: number) {
    const theUuid = uuidv4()
    this.sendToMain('bookmark', { operation: IpcOperations.FIND_ONE, uuid: theUuid },
      { tmdbId: data })
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`bookmark-${theUuid}`, (event, arg) => {
        console.log(`getBookmark ${theUuid}`)
        resolve(arg);
      });
    });
  }

  getBookmarkInList(idList: number[]): Promise<any> {
    const theUuid = uuidv4()
    this.sendToMain('bookmark', {
      operation: IpcOperations.FIND_IN_LIST,
      uuid: theUuid
    }, { idList: idList });
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`bookmark-${theUuid}`, (event, arg) => {
        console.log(`getBookmarkInList ${theUuid}`)
        resolve(arg);
      });
    });
  }

  saveBookmark(data) {
    const theUuid = uuidv4()
    this.sendToMain('bookmark', { operation: IpcOperations.SAVE, uuid: theUuid },
      data);
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`bookmark-${theUuid}`, (event, arg) => {
        console.log(`saveBookmark ${theUuid}`)
        resolve(arg);
      });
    });
  }

  removeBookmark(type: string, id: string | number) {
    const theUuid = uuidv4()
    this.sendToMain('bookmark', { operation: IpcOperations.REMOVE, uuid: theUuid }, { type: type, id: id });
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`watched-${theUuid}`, (event, arg) => {
        console.log(`removeWatched ${theUuid}`)
        resolve(arg);
      });
    });
  }

  // ----- WATCHED
  getWatched(data: number) {
    const theUuid = uuidv4()
    this.sendToMain('watched', { operation: IpcOperations.FIND_ONE, uuid: theUuid },
      { tmdbId: data })
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`watched-${theUuid}`, (event, arg) => {
        console.log(`getWatched ${theUuid}`)
        resolve(arg);
      });
    });
  }

  /**
   * Ipc renderer that sends command to main renderer to get movies from library db.
   * @param idList
   */
  getWatchedInList(idList: number[]): Promise<any> {
    const theUuid = uuidv4()
    this.sendToMain('watched', {
      operation: IpcOperations.FIND_IN_LIST,
      uuid: theUuid
    }, { idList: idList });
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`watched-${theUuid}`, (event, arg) => {
        console.log(`watched ${theUuid}`)
        resolve(arg);
      });
    });
  }

  saveWatched(data) {
    const theUuid = uuidv4()
    this.sendToMain('watched', { operation: IpcOperations.SAVE, uuid: theUuid }, data);
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`watched-${theUuid}`, (event, arg) => {
        console.log(`saveWatched ${theUuid}`)
        resolve(arg);
      });
    });
  }

  updateWatchedStatus(val: IWatched) {
    this.ipcRenderer.send('', val)
  }

  removeWatched(type: string, id: string | number) {
    const theUuid = uuidv4()
    this.sendToMain('watched', { operation: IpcOperations.REMOVE, uuid: theUuid }, { type: type, id: id });
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`watched-${theUuid}`, (event, arg) => {
        console.log(`removeWatched ${theUuid}`)
        resolve(arg);
      });
    });
  }


  // ----- END OF WATCHED
  /**
   *
   * @param id tmdb id
   */
  getMovieUserData(id: number): Promise<IUserMovieData> {
    const theUuid = uuidv4()
    this.sendToMain('user-data', {
      operation: IpcOperations.FIND,
      uuid: theUuid
    }, { tmdbId: id });
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`user-data-${theUuid}`, (event, arg) => {
        console.log(`user-data ${theUuid}`)
        resolve(arg);
      });
    });
  }

  getMovieUserDataInList(idList: number[]): Promise<IUserMovieData[]> {
    const theUuid = uuidv4()
    this.sendToMain('user-data', {
      operation: IpcOperations.FIND_IN_LIST,
      uuid: theUuid
    }, { idList: idList });
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`user-data-${theUuid}`, (event, arg) => {
        console.log(`user-data ${theUuid}`)
        resolve(arg);
      });
    });
  }

  // ----- END OF USER DATA
  startScanLibrary() {

    this.ipcRenderer.send(IPCRendererChannel.SCAN_LIBRARY_START)
    this.ipcRenderer.on(IPCMainChannel.ScanLibraryResult, e => {
      console.log(IPCMainChannel.ScanLibraryResult, e)
    })
    this.ipcRenderer.once(IPCMainChannel.ScanLibraryComplete, e => {
      console.log('completscan')
      this.ipcRenderer.removeListener(IPCMainChannel.ScanLibraryResult, d => { })
    })
  }

  stopScanLibrary() {
    this.ipcRenderer.send(IPCRendererChannel.SCAN_LIBRARY_STOP)
  }

  getPlayTorrent(hash: string) {
    this.ipcRenderer.send(IPCRendererChannel.PLAY_TORRENT, hash)
  }

  stopStream() {
    this.ipcRenderer.send(IPCRendererChannel.STOP_STREAM)
  }

  playOfflineVideo(tmdbId): Promise<any> {
    this.ipcRenderer.send(IPCRendererChannel.PLAY_OFFLINE_VIDEO_STREAM, tmdbId);
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`stream-link`, (event, arg) => {
        resolve(arg);
      });
    });
  }

  getPreferences() {

    this.ipcRenderer.send(IPCRendererChannel.PREFERENCES_GET)
    // this.ipcRenderer.addListener(IPCMainChannel.PREFERENCES_GET_COMPLETE, this.pref)

    // (event, data: any) => {
    // console.log('IPCMainChannel.PREFERENCES_COMPLETE ', data)
    // this.pref()
    // this.preferences.next(data)
    // this.ipcRenderer.removeListener(IPCMainChannel.PREFERENCES_GET_COMPLETE, e => { })
    // })
  }

  savePreferences(val) {
    this.ipcRenderer.send(IPCRendererChannel.PREFERENCES_SET, val)
    // this.ipcRenderer.on(IPCMainChannel.PREFERENCES_SET_COMPLETE, (event, data: any) => {
    //   console.log('IPCMainChannel.PREFERENCES_SET_COMPLETE ', data)
    //   this.preferences.next(data)
    //   this.ipcRenderer.removeListener(IPCMainChannel.PREFERENCES_SET_COMPLETE, d => { })
    // })
  }

  changeSubtitle(): Promise<any> {
    this.sendToMain("get-subtitle")
    return new Promise((resolve) => {
      this.ipcRenderer.once('subtitle-path', (event,arg) => {
        resolve(arg)
      })
    })
  }

  removeListener(channel: string) {
    console.log('REMOVING LISTENER', channel)
    this.ipcRenderer.removeListener(channel, d => { })
  }

  private sendToMain(channel: string, headers?: Headers, body?: Body) {
    console.log('sending to ipc... ', channel, [headers, body])
    try {
      this.ipcRenderer.send(channel, [headers, body])
    } catch {
      console.log('failed to send Ipc: ', channel, [headers, body])
    }
  }

  IPCCommand = IPCRendererChannel['default']
  IPCChannel = IPCMainChannel['default']
}

interface Headers {
  operation: IpcOperations,
  uuid: string
}

interface Body {
  tmdbId?: number
  idList?: number[]
  [x: string]: any
}

enum IpcOperations {
  FIND = 'find',
  FIND_ONE = 'find-one',
  FIND_IN_LIST = 'find-in-list',
  UPDATE = 'update',
  SAVE = 'save',
  REMOVE = 'remove',
  GET_BY_PAGE = 'get-by-page',
  COUNT = 'count'
}
export interface IBookmarkChanges {
  change: BookmarkChanges
}

export enum BookmarkChanges {
  UPDATE = 'update',
  DELETE = 'delete',
  INSERT = 'insert'
}

export interface IBookmark {
  tmdbId: number,
  imdbId: string,
  id: string
}

export interface IWatched {
  tmdbId: number,
  imdbId: string,
  id: string
  timestamp?: number,
}
// browse folder
// export interface IUserMovieData {
//   bookmark: IBookmark,
//   watched: IWatched,
//   library: ILibrary
// }

export interface IUserMovieData {
  tmdbId?: number,
  bookmark: IBookmark,
  watched: IWatched,
  library: ILibrary
}

interface ILibrary {
  title?: string,
  year?: number,
  tmdbId?: number,
  imdbId?: string,
  libraryList: ILibraryData[]
}

interface ILibraryData {
  fullFilePath: string,
  _id: string
}

interface PageinatedObject {
  totalPages: number,
  totalResults: number,
  page: number,
  results: any[],
}
