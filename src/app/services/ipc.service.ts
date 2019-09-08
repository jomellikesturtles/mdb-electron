/**
 * new ipc service (9/4)
 */
import { Injectable } from '@angular/core';
declare var electron: any;
const { ipcRenderer, clipboard, shell } = electron;

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  ipcRenderer: typeof ipcRenderer;
  constructor(
    // private ipc: IpcRenderer
  ) {
    this.ipcRenderer = (<any>window).require('electron').ipcRenderer;
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
  scanLibrary() {
    this.ipcRenderer.send('scan-library')
  }
  mockScanLibrary() {
    console.log('mock-scan-library')
    this.ipcRenderer.send('mock-scan-library')
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
