/**
 * new ipc service (9/4)
 * Service to communicate to ipc main
 */
import {
  Injectable
  // , ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
declare var electron: any;
// const { ipcRenderer } = electron;
@Injectable({
  providedIn: 'root'
})
export class IpcService {

  libraryFolders = new BehaviorSubject<string[]>([]);
  libraryMovies = new BehaviorSubject<string[]>([]);
  preferencesConfig = new BehaviorSubject<string[]>([]);
  // ipcRenderer: typeof ipcRenderer;
  constructor(
    // private ref: ChangeDetectorRef
  ) {
    // this.ipcRenderer = (<any>window).require('electron').ipcRenderer;

    // this.ipcRenderer.on('library-folders', (event, data) => {
    //   console.log('library-folders:', data);
    //   this.libraryFolders.next(data)
    // })
    // this.ipcRenderer.on('preferences-config', (event, data) => {
    //   console.log('preferences-config:', data);
    //   this.preferencesConfig.next(data)
    // })
    // this.ipcRenderer.on('library-movies', (event, data) => {
    //   console.log('library-movies data:', data);
    //   this.libraryMovies.next(data)
    // })
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
   * Opens files and folders
   */
  fileExplorer() {
    // this.ipcRenderer.send('file-explorer')
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
   * Gets preferences from the config file
   * @param preferencesObject preferences object to save
   */
  getPreferences(preferencesObject) {
    // this.ipcRenderer.send('get-preferences', preferencesObject)
  }

  /**
   * Opens the folder
   * @param data folder directory
   */
  openFolder(data) {
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

  // library movies db
  /**
   * Retrieves movies from library db
   */
  getMoviesFromLibrary() {
    // this.ipcRenderer.send('get-library-movies')
  }
}
