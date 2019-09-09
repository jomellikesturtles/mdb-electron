/**
 * new ipc service (9/4)
 */
import { Injectable
  // , ChangeDetectorRef 
} from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { Injectable } from '@';
declare var electron: any;
const { ipcRenderer, clipboard, shell } = electron;
@Injectable({
  providedIn: 'root'
})
export class IpcService {

  // libraryFolders = new BehaviorSubject<string[]>([]);
  // directory = new BehaviorSubject<string[]>([]);
  ipcRenderer: typeof ipcRenderer;
  constructor(
    // private ipc: IpcRenderer
    // private ref: ChangeDetectorRef
  ) {
    this.ipcRenderer = (<any>window).require('electron').ipcRenderer;

    // this.ipcRenderer.on('library-folders', (data) => {
    //   console.log(data.toString())
    //   this.libraryFolders = data;
    // })
  }

  /**
   * All messages in logger
   */
  sendMessage(data) {
    console.log('sendMessage')
    console.log(data)
    this.ipcRenderer.send('logger', data)
  }
  /**
   * Opens files and folders
   */
  fileExplorer() {
    this.ipcRenderer.send('file-explorer')
  }
  /**
   * Opens files and folders
   */
  modalFileExplorer() {
    this.ipcRenderer.send('modal-file-explorer')
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
    this.ipcRenderer.send('scan-library')
  }
  openFolder(data) {
    console.log(data)
    this.ipcRenderer.send('open-folder', data)
  }
  searchQuery(data) {
    console.log('Searching ', data)
    this.ipcRenderer.send('search-query', data)
  }

  /**
   * Searches for torrent in offline dump
   * @param data search query
   */
  searchTorrent(data) {
    console.log('searchTorrent ', data)
    // this.ipcRenderer.send('search-torrent', data)
  }


}
