/**
 * new ipc service (9/4)
 * Service to communicate to ipc main
 */
import {
  Injectable
  //// , ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core'
import { BehaviorSubject } from 'rxjs'
declare var electron: any
const { ipcRenderer } = electron
import { ILibraryInfo } from '../interfaces'
@Injectable({
  providedIn: 'root'
})
export class IpcService {
  libraryFolders = new BehaviorSubject<string[]>([])
  libraryMovies = new BehaviorSubject<string[]>([])
  libraryMovie = new BehaviorSubject<string[]>([])
  preferencesConfig = new BehaviorSubject<string[]>([])
  movieMetadata = new BehaviorSubject<string[]>([])
  private ipcRenderer: typeof ipcRenderer
  constructor() //// private ref: ChangeDetectorRef
  {
    this.ipcRenderer = (<any>window).require('electron').ipcRenderer

    this.libraryFolders.next(['test', 'test2'])
    // this.ipcRenderer.on('library-folders', (event, data) => {
    //   console.log('library-folders:', data)
    //   this.libraryFolders.next(data)
    // })
    // this.ipcRenderer.on('library-movies', (event, data) => {
    //   console.log('library-movies data:', data)
    //   this.libraryMovies.next(data)
    // })
    // this.ipcRenderer.on('library-movie', (event, data) => {
    //   console.log('library-movie data:', data)
    //   this.libraryMovie.next(data)
    // })
    // this.ipcRenderer.on('library-movie-title-year', (event, data) => {
    //   console.log('library-movie-title-year data:', data)
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
  }

  // async getFiles(){
  //   this.ipcRenderer.

  // }

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
    // this.ipcRenderer.send('search-torrent', data)
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
  /**
   * Ipc renderer that sends command to main renderer to get movies from library db.
   */
  getMoviesFromLibrary() {
    console.log('get-library-movies')
    // this.ipcRenderer.send('get-library-movies')
  }
  /**
   * Ipc renderer that sends command to main renderer to get specified movie from library db.
   * Replies offline directories.
   * @param data imdb id or movie title and release year or tmdb id
   */
  async getMovieFromLibrary(data) {
    console.log('getMovieFromLibrary data', data);
    // this.ipcRenderer.send('get-library-movie', [data]);
    // return new Promise<ILibraryInfo>((resolve, reject) => {
    //   this.ipcRenderer.once('library-movie', (event, arg) => {
    //     console.log('library-movie', arg);
    //     resolve(arg);
    //   });
    // });
    return null
  }

  getImage(url: string, imdbId: string, type: string) {
    const param = [url, imdbId, type]
    // this.ipcRenderer.send('get-image', param)
  }

  setImage() {

  }

  // user services; watchlist/bookmarks, watched
  getWatchlist(val) {
    // this.ipcRenderer.send('get-watchlist', val)
  }
  addToWatchlist(val) {
    // this.ipcRenderer.send('add-watchlist', val)
  }
  removeFromWatchlist(val) {
    // this.ipcRenderer.send('remove-watchlist', val)
  }
  getMarkAsWatched(val) {
    // this.ipcRenderer.send('get-watched', val)
  }
  addMarkAsWatched(val) {
    // this.ipcRenderer.send('add-watched', val)
  }
  removeMarkAsWatched(val) {
    // this.ipcRenderer.send('remove-watched', val)
  }
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
