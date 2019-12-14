/**
 * new ipc service (9/4)
 * Service to communicate to ipc main
 */
import {
  Injectable, NgZone
  //// , ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core'
import { BehaviorSubject, Observable, fromEvent } from 'rxjs'
declare var electron: any
import { ipcRenderer } from 'electron'
// const { ipcRenderer } = electron
import { ILibraryInfo } from '../interfaces'

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

  private ipcRenderer: typeof ipcRenderer

  constructor(private ngZone: NgZone) //// private ref: ChangeDetectorRef
  {
    this.ipcRenderer = (<any>window).require('electron').ipcRenderer

    // this.ipcRenderer.on('library-folders', (event, data) => {
    //   console.log('library-folders:', data)
    //   this.libraryFolders.next(data)
    // })

    // this.ipcRenderer.on('library-movies', (event, data) => {
    //   this.libraryMovies.next(data)
    // })

    // this.ipcRenderer.on('library-movie', (event, data) => {
    //   console.log('library-movie data:', data)
    //   this.libraryMovie.next(data)
    // })
    // this.ipcRenderer.on('preferences-config', (event, data) => {
    //   console.log('preferences-config:', data)
    //   this.preferencesConfig.next(data)
    // })
    // this.ipcRenderer.on('movie-metadata', (event, data) => {
    //   console.log('movie-metadata:', data)
    //   this.movieMetadata.next(data)
    // })
    // this.ipcRenderer.on('shortcut-search', () => {
    //   console.log('shortcut-search')
    // })
    // this.ipcRenderer.on('shortcut-preferences', () => {
    //   console.log('shortcut-preferences')
    // })

    // ----------------------------

    // this.ipcRenderer.on('bookmark-get-success' || 'bookmark-add-success' || 'bookmark-remove-success', (event, data) => {
    //   this.bookmarkSingle.next(data)
    //   console.log('ipcRenderer bookmark-get', data)
    // })

    // BOOKMARKS
    // this.ipcRenderer.on('bookmark-get-success', (event, data) => {
    //   this.bookmarkSingle.next(data)
    // })
    // this.ipcRenderer.on('bookmark-add-success', (event, data) => {
    //   this.bookmarkSingle.next(data)
    // })
    // this.ipcRenderer.on('bookmark-remove-success', (event, data) => {
    //   this.bookmarkSingle.next(data)
    // })
    // // WATCHED
    // this.ipcRenderer.on('watched-success', (event, data) => {
    //   console.log('watched-success', data);
    //   this.watchedSingle.next(data)
    // })
    // // SCANNED MOVIE
    // this.ipcRenderer.on('scanned-success', (event, data) => {
    //   console.log('scanned-success', data);
    //   this.scannedMovieSingle.next(data)
    // })
    // this.ipcRenderer.on('video-success', (event, data) => {
    //   console.log('video-success', data);
    //   this.videoFile.next(1)
    // })
    // console.log = function (data) {
    //   ipcRenderer.send('logger', data)
    // }
  }

  sendProvider(provider) {
    this.ipcRenderer.send('firebase-provider', [provider])
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
   * All messages in logger
   */
  sendMessage(data) {
    console.log('sendMessage')
    console.log(data)
    // this.ipcRenderer.send('logger', data)
  }

  /**
   * Opens link to browser
   * @param url url to open
   */
  openLinkExternal(url: string) {
    // this.ipcRenderer.send('open-link-external', url)
  }
  /**
   * Opens files and folders
   */
  modalFileExplorer() {
    // this.ipcRenderer.send('modal-file-explorer')
  }
  /**
   * Opens files and folders
   */
  getLibraryFolders() {
    // this.ipcRenderer.send('retrieve-library-folders')
  }
  /**
   * Scans the library folders
   */
  scanLibrary() {
    // this.ipcRenderer.send('scan-library')
  }

  /**
   * Saves preferences to the config file
   * @param preferencesObject preferences object to save
   */
  savePreferences(preferencesObject) {
    // this.ipcRenderer.send('save-preferences', preferencesObject)
  }
  /**
   * Gets preferences from the config file.
   */
  getPreferences() {
    // this.ipcRenderer.send('get-preferences')
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
   * Opens the parent folder
   * @param data folder directory
   */
  openParentFolder(data: string) {
    console.log('up', data)
    // this.ipcRenderer.send('go-to-folder', ['up', data])
  }

  /**
   * Opens folder with system file explorer.
   * @param data folder directory
   */
  openFileExplorer(data: string) {
    console.log(data)
    // this.ipcRenderer.send('open-folder', data)
  }

  openVideo(tmdbId) {
    // throw new Error("Method not implemented.");
    // this.ipcRenderer.send('open-video', [tmdbId])
  }
  /**
   * Get torrents from offline dump of movie by title
   * @param value movie title or imdb id
   */
  getTorrentsByTitle(value) {
    // this.ipcRenderer.send('get-torrents-title', value)
  }
  /**
   * Search movie
   * @param data query to search
   */
  searchQuery(data) {
    console.log('Searching ', data)
    // this.ipcRenderer.send('search-query', data)
  }

  /**
   * Searches for torrent in offline dump
   * @param data search query
   */
  searchTorrent(data) {
    console.log('searchTorrent ', data)
    // this.ipcRenderer.send('torrent-search', data)
  }

  /**
   * Gets movie metadata from offline source.
   * @param data search query
   */
  getMovieMetadata(data) {
    console.log('getMovieMetadata ', data)
    // this.ipcRenderer.send('movie-metadata', ['get', data])
  }
  /**
   * Sets movie metadata from offline source.
   * @param data search query
   */
  setMovieMetadata(data) {
    console.log('setMovieMetadata ', data)
    // this.ipcRenderer.send('movie-metadata', ['set', data])
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

  getImage(url: string, imdbId: string, type: string) {
    const param = [url, imdbId, type]
    // this.ipcRenderer.send('get-image', param)
  }

  setImage() {

  }

  // // User services
  // // user services; watchlist/bookmarks, watched
  getBookmark(val) {
    // this.ipcRenderer.send('bookmark', ['bookmark-get', val])
  }
  addBookmark(val) {
    // this.ipcRenderer.send('bookmark', ['bookmark-add', val])
  }
  removeBookmark(val) {
    // this.ipcRenderer.send('bookmark', ['bookmark-remove', val])
  }
  updateBookmark(val) {
    // this.ipcRenderer.send('bookmark', ['bookmark-update', val])
  }
  getMarkAsWatched(val) {
    // this.ipcRenderer.send('watched', ['get', val])
  }
  addMarkAsWatched(val) {
    // this.ipcRenderer.send('watched', ['add', val])
  }
  removeMarkAsWatched(val) {
    // this.ipcRenderer.send('watched', ['remove', val])
  }

  // App Window Events
  minimizeWindow() {
    this.ipcRenderer.send('app-min')
  }
  restoreWindow() {
    this.ipcRenderer.send('app-restore')
  }
  exitProgram() {
    this.ipcRenderer.send('exit-program')
  }
}

export interface IBookmark {
  tmdbId: number
  imdbId: string,
  id: string
}

export interface IWatched {
  tmdbId: number
  imdbId: string,
  id: string
  timestamp?: number,
}
