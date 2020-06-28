/**
 * IPC renderer comm to the main.
 * TODO: change behaviorsubjects to something else.
 */
import { environment } from './../../environments/environment';
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
// // const { ipcRenderer } = electron
import { ILibraryInfo } from '../interfaces'

export enum Channel {
  BookmarkAddSuccess = 'bookmark-add-success',
  BookmarkGetSuccess = 'bookmark-get-success',
  BookmarkRemoveSuccess = 'bookmark-remove-success',
  BookmarkChanges = 'bookmark-changes',
  LibraryFolders = 'library-folders',
  LibraryMovie = 'library-movie',
  LibraryMovies = 'library-movies',
  AppMinimizing = 'app-minimizing',
  AppRestoring = 'app-restoring',
  MovieMetadata = 'movie-metadata',
  PreferencesConfig = 'preferences-config',
  ScannedSuccess = 'scanned-success',
  SearchList = 'search-list',
  VideoSuccess = 'video-success',
  WatchedSuccess = 'watched-success',
  MovieIdentified = 'movie-identified-success', // emits when movie from library is identified
}

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  libraryFolders = new BehaviorSubject<string[]>([])
  libraryMovies = new BehaviorSubject<string[]>([])
  libraryMovie = new BehaviorSubject<string[]>([])
  movieMetadata = new BehaviorSubject<string[]>([])
  preferencesConfig = new BehaviorSubject<string[]>([])
  bookmarkSingle = new BehaviorSubject<IBookmark>({ id: '', imdbId: '', tmdbId: 0 })
  watchedSingle = new BehaviorSubject<IWatched>({ id: '', imdbId: '', tmdbId: 0 })
  scannedMovieSingle = new BehaviorSubject<IWatched>({ id: '', imdbId: '', tmdbId: 0 })
  scannedMovieMulti = new BehaviorSubject<IWatched>({ id: '', imdbId: '', tmdbId: 0 })
  videoFile = new BehaviorSubject<any>([])
  bookmarkChanges = new BehaviorSubject<IBookmarkChanges[]>([])
  movieIdentified = new BehaviorSubject<any>({ id: 0 })
  searchList = new BehaviorSubject<any>([])
  private ipcRenderer: typeof ipcRenderer

  constructor(private ngZone: NgZone,
    // private cdr: ChangeDetectorRef
  ) ////
  {
    // UNCOMMENT IF IN ELECTRON MODE
    if (environment.runConfig.electron) {
      this.ipcRenderer = (window as any).require('electron').ipcRenderer

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

  call(message: IpcCommand, args?: any) {

    if (environment.runConfig.electron) {
      console.log(`IPC Command: ${message}, args: ${args}`)
      this.ipcRenderer.send(message, args)
    }
  }

  /**
   * Listens to ipc renderer.
   * @param channel name of the channel
   */
  listen(channel: Channel): void | Promise<any> {
    // this.ipcRenderer.removeListener().
    if (environment.runConfig.electron) {
      console.log('LISTENING...');
      this.ipcRenderer.on(channel, (event, data: any) => {
        console.log(`ipcRenderer channel: ${channel} data: ${data}`)
        switch (channel) {
          case Channel.BookmarkAddSuccess:
            this.bookmarkSingle.next(data)
            break;
          case Channel.BookmarkGetSuccess:
            this.bookmarkSingle.next(data)
            break;
          case Channel.BookmarkRemoveSuccess:
            this.bookmarkSingle.next(data)
            break;
          case Channel.BookmarkChanges:
            this.bookmarkChanges.next(data)
            break;
          case Channel.LibraryFolders:
            this.libraryFolders.next(data)
            break;
          case Channel.LibraryMovies:
            this.libraryMovies.next(data)
            break;
          case Channel.LibraryMovie:
            this.libraryMovie.next(data)
            break;
          case Channel.PreferencesConfig:
            this.preferencesConfig.next(data)
            break;
          case Channel.MovieMetadata:
            this.movieMetadata.next(data)
            break;
          case Channel.ScannedSuccess:
            this.scannedMovieSingle.next(data)
            break;
          case Channel.WatchedSuccess:
            this.watchedSingle.next(data)
            break;
          case Channel.VideoSuccess:
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

  /**
   * Search movie
   * @param data query to search
   */
  searchQuery(data) {
    console.log('Searching ', data)
    // this.ipcRenderer.send('search-query', data)
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

}

export enum IpcCommand {
  MinimizeApp = 'app-min',
  RestoreApp = 'app-restore',
  ExitApp = 'exit-program',
  FirebaseProvider = 'firebase-provider',
  ScanLibrary = 'scan-library',
  StopScanLibrary = 'stop-scan-library',
  OpenLinkExternal = 'open-link-external',
  OpenInFileExplorer = 'open-file-explorer',
  OpenVideo = 'open-video',
  RetrieveLibraryFolders = 'retrieve-library-folders',
  Bookmark = 'bookmark',
  BookmarkAdd = 'bookmark-add',
  BookmarkGet = 'bookmark-get',
  Watched = 'watched',
  MovieMetadata = 'movie-metadata',
  Get = 'get',
  Add = 'add',
  Set = 'set',
  Remove = 'remove',
  GetPreferences = 'get-preferences',
  SavePreferences = 'save-preferences',
  GoToFolder = 'go-to-folder',
  Up = 'up',
  UpdateTorrentDump = 'update-torrent-dump',
  GetBookmarkChanges = 'get-bookmark-changes',
  SearchTorrent = 'torrent-search',
  ModalFileExplorer = 'modal-file-explorer',
  GetTorrentsTitle = 'get-torrents-title',
  GetImage = 'get-image',
  GetSearchList = 'get-search-list'
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
