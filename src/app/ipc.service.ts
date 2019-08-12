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
    // if ((<any>window).require) {
    //   try {
    //     this.ipc = (<any>window).require('electron').ipcRenderer
    //   } catch (error) {
    //     throw error
    //   }
    // } else {
    //   console.warn('Could not load electron ipc')
    // }
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
}
