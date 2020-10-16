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
declare var electron: any
import { ipcRenderer } from 'electron'
import { ILibraryInfo } from '../interfaces'


@Injectable({
  providedIn: 'root'
})
export class IpcService {

  libraryMovies = new BehaviorSubject<string[]>([])
  libraryMovie = new BehaviorSubject<string[]>([])
  bookmarkSingle = new BehaviorSubject<IBookmark>({ id: '', imdbId: '', tmdbId: 0 })
  watchedSingle = new BehaviorSubject<IWatched>({ id: '', imdbId: '', tmdbId: 0 })
  scannedMovieSingle = new BehaviorSubject<IWatched>({ id: '', imdbId: '', tmdbId: 0 })
  scannedMovieMulti = new BehaviorSubject<IWatched>({ id: '', imdbId: '', tmdbId: 0 })
  bookmarkChanges = new BehaviorSubject<IBookmarkChanges[]>([])
  movieIdentified = new BehaviorSubject<any>({ id: 0 })
  searchList = new BehaviorSubject<any>([])
  torrentVideo = new BehaviorSubject<string[]>([])
  preferences = new BehaviorSubject<any>([])
  streamLink = new BehaviorSubject<any>('')
  statsForNerds = new BehaviorSubject<any>({})
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
    // this.ipcRenderer.removeListener().
    if (environment.runConfig.electron) {
      console.log('LISTENING...');
      this.ipcRenderer.on(channel, (event, data: any) => {
        console.log(`ipcRenderer channel: ${channel} data: ${data}`)
        switch (channel) {
          case IPCMainChannel.BookmarkAddSuccess:
            this.bookmarkSingle.next(data)
            break;
          case IPCMainChannel.BookmarkGetSuccess:
            this.bookmarkSingle.next(data)
            break;
          case IPCMainChannel.BookmarkRemoveSuccess:
            this.bookmarkSingle.next(data)
            break;
          case IPCMainChannel.BookmarkChanges:
            this.bookmarkChanges.next(data)
            break;
          case IPCMainChannel.LibraryMovies:
            this.libraryMovies.next(data)
            break;
          case IPCMainChannel.LibraryMovie:
            this.libraryMovie.next(data)
            break;
          case IPCMainChannel.ScannedSuccess:
            this.scannedMovieSingle.next(data)
            break;
          case IPCMainChannel.WatchedSuccess:
            this.watchedSingle.next(data)
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

  // library movies db
  getMoviesFromLibrary() {
    console.log('get-library-movies')
    // this.ipcRenderer.send('get-library-movies', ['get-by-page', 1])
    // this.ipcRenderer.send('get-library-movies')
  }

  /**
   * Ipc renderer that sends command to main renderer to get movies from library db.
   * @param idList
   */
  getMoviesFromLibraryInList(idList: number[]): Promise<any> {
    const theUuid = uuidv4()
    console.log(`libraryMovies ${theUuid}`)
    this.ipcRenderer.send(`get-library-movies`, [`find-in-list`, theUuid, idList]);
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
  getMultiplePaginatedFirst(collectionName: string, order: string, limit?: number) {
    const theUuid = uuidv4()
    console.log(`libraryMovies ${theUuid}`)
    this.ipcRenderer.send(`get-library-movies`, [`get-by-page`, theUuid, order, limit, 0]);
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
  getMultiplePaginated(collectionName: string, order: string, limit?: number, lastVal?: string | number) {
    const theUuid = uuidv4()
    console.log(`libraryMovies ${theUuid}`)
    this.ipcRenderer.send(`get-library-movies`, [`get-by-page`, theUuid, order, limit, lastVal]);
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
    console.log(`getMovieFromLibrary ${theUuid}`)
    this.ipcRenderer.send(`get-library-movies`, [`find`, theUuid, arg]);
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`library-movie-${theUuid}`, (event, arg) => {
        console.log(`getMovieFromLibrary ${theUuid}`)
        resolve(arg);
      });
    });
  }

  // // user services; watchlist/bookmarks, watched
  getBookmark(val) {
    // this.ipcRenderer.send('bookmark', ['bookmark-get', val])
  }

  // ----- WATCHED
  getWatched(data) {
    const theUuid = uuidv4()
    console.log(`watched ${theUuid}`)
    this.ipcRenderer.send(`watched`, [`findOne`, theUuid, data]);
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
    console.log(`libraryMovies ${theUuid}`)
    this.ipcRenderer.send(`watched`, [`find-in-list`, theUuid, idList]);
    return new Promise<any>((resolve, reject) => {
      this.ipcRenderer.once(`watched-${theUuid}`, (event, arg) => {
        console.log(`libraryMovies ${theUuid}`)
        resolve(arg);
      });
    });
  }

  saveWatched(data) {
    const theUuid = uuidv4()
    console.log(`watched ${theUuid}`)
    this.ipcRenderer.send(`watched`, ['save', theUuid, data]);
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
  // ----- END OF WATCHED
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

  removeListener(channel: string) {
    console.log('REMOVING LISTENER', channel)
    this.ipcRenderer.removeListener(channel, d => { })
  }

  IPCCommand = IPCRendererChannel['default']
  IPCChannel = IPCMainChannel['default']
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
export interface ITorrent {
  uploadSpeed: number,
  downloadSpeed: number,
}
