/**
 * IPC renderer comm to the main.
 * TODO: change behaviorsubjects to something else.
 */
import { environment } from './../../environments/environment';
import * as IPCRendererChannel from '../../assets/IPCRendererChannel.json';
import * as IPCMainChannel from '../../assets/IPCMainChannel.json';

/**
 * Service to communicate to ipc main
 */
import {
  Injectable, NgZone
  //// , ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core'
import { BehaviorSubject, Observable, fromEvent } from 'rxjs'
declare var electron: any
import { ipcRenderer } from 'electron'
import { ILibraryInfo } from '../interfaces'


@Injectable({
  providedIn: 'root'
})
export class IpcService {

  libraryFolders = new BehaviorSubject<string[]>([])
  libraryMovies = new BehaviorSubject<string[]>([])
  libraryMovie = new BehaviorSubject<string[]>([])
  movieMetadata = new BehaviorSubject<string[]>([])
  bookmarkSingle = new BehaviorSubject<IBookmark>({ id: '', imdbId: '', tmdbId: 0 })
  watchedSingle = new BehaviorSubject<IWatched>({ id: '', imdbId: '', tmdbId: 0 })
  scannedMovieSingle = new BehaviorSubject<IWatched>({ id: '', imdbId: '', tmdbId: 0 })
  scannedMovieMulti = new BehaviorSubject<IWatched>({ id: '', imdbId: '', tmdbId: 0 })
  videoFile = new BehaviorSubject<any>([])
  bookmarkChanges = new BehaviorSubject<IBookmarkChanges[]>([])
  movieIdentified = new BehaviorSubject<any>({ id: 0 })
  searchList = new BehaviorSubject<any>([])
  torrentVideo = new BehaviorSubject<string[]>([])
  preferences = new BehaviorSubject<any>([])
  streamLink = new BehaviorSubject<any>('')
  private ipcRenderer: typeof ipcRenderer

  constructor(private ngZone: NgZone,
    // private cdr: ChangeDetectorRef
  ) {
    console.log(IPCRendererChannel)
    console.log(IPCMainChannel)
    console.log()
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

      // this.ipcRenderer.once(Channel.SearchList, (event, data: any) => {
      //   console.log('searchList:', data)
      //   this.searchList.next(data)
      // })
      // this.ipcRenderer.on(IPCMainChannel.PREFERENCES_SET_COMPLETE, (event: Electron.IpcRendererEvent, data: any) => {
      //   this.preferences.next(data)
      // })
      this.ipcRenderer.on(IPCMainChannel.PREFERENCES_GET_COMPLETE, (event: Electron.IpcRendererEvent, data) => {
        this.preferences.next(data)
        console.log('IPCMainChannel.PREFERENCES_COMPLETE ', data)
      })
      this.ipcRenderer.on(IPCMainChannel.STREAM_LINK, (event: Electron.IpcRendererEvent, data) => {
        this.streamLink.next(data)
        console.log('IPCMainChannel.STREAM_LINK ', data)
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
          case IPCMainChannel.LibraryFolders:
            this.libraryFolders.next(data)
            break;
          case IPCMainChannel.LibraryMovies:
            this.libraryMovies.next(data)
            break;
          case IPCMainChannel.LibraryMovie:
            this.libraryMovie.next(data)
            break;
          case IPCMainChannel.MovieMetadata:
            this.movieMetadata.next(data)
            break;
          case IPCMainChannel.ScannedSuccess:
            this.scannedMovieSingle.next(data)
            break;
          case IPCMainChannel.WatchedSuccess:
            this.watchedSingle.next(data)
            break;
          case IPCMainChannel.VideoSuccess:
            this.videoFile.next(data)
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
    //   this.ipcRenderer.send('get-drives');
    // });
    // console.log('get system drives')
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
    // this.ipcRenderer.send('get-library-movies', ['find-collection', 1])
    // this.ipcRenderer.send('get-library-movies')
  }

  /**
   * Ipc renderer that sends command to main renderer to get movies from library db.
   */
  getMoviesFromLibraryByPage(val) {
    // this.ipcRenderer.send('get-library-movies', ['find-collection', val]);
  }
  // getMoviesFromLibraryByPage(val) {

  //   this.ipcRenderer.send('get-library-movies', ['find-collection', val]);
  //   return new Promise<any>((resolve, reject) => {
  //     this.ipcRenderer.once('library-movies', (event, arg) => {
  //       console.log('library-movies', arg);
  //       resolve(arg);
  //     });
  //   });
  // }

  /**
   * Ipc renderer that sends command to main renderer to get specified movie from library db.
   * Replies offline directories.
   * @param data imdb id or movie title and release year or tmdb id
   */
  getMovieFromLibrary(data) {
    // this.ipcRenderer.send('get-library-movie', [data]);
    // return new Promise<ILibraryInfo>((resolve, reject) => {
    //   this.ipcRenderer.once('library-movie', (event, arg) => {
    //     console.log('library-movie', arg);
    //     resolve(arg);
    //   });
    // });
    return new Promise<ILibraryInfo>((resolve, reject) => {
      resolve(null);
    });
    // return null
  }

  // // User services
  // // user services; watchlist/bookmarks, watched
  getBookmark(val) {
    // this.ipcRenderer.send('bookmark', ['bookmark-get', val])
  }

  startScanLibrary() {

    this.ipcRenderer.send(IPCRendererChannel.SCAN_LIBRARY_START)
    this.ipcRenderer.on(IPCMainChannel.ScanLibraryResult, e => {
    })
    this.ipcRenderer.on(IPCMainChannel.ScanLibraryComplete, e => {
      this.ipcRenderer.removeListener(IPCMainChannel.ScanLibraryResult, d => { })
      this.ipcRenderer.removeListener(IPCMainChannel.ScanLibraryComplete, d => { })
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

  pref = ((event, data) => {
    console.log('got something', data)
    // this.preferences.next(data)
  })

  removeListener(channel: string) {
    console.log('REMOVING LISTENER', channel)
    // this.ipcRenderer.removeListener(channel, d => { })
    this.ipcRenderer.removeListener(channel, this.pref)
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
