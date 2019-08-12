import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ipcMain, IpcRenderer } from 'electron'
import { IpcService } from '../ipc.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.scss']
})
export class UserPreferencesComponent implements OnInit {
  // userPreferences = USERPREFERENCES;
  // unsavedPreferences: Preferences;
  constructor(
    private ipcService: IpcService
  ) { }
  title = 'angular 4 with jquery'
  ngOnInit() {
    var title = 'angular 4 with jquery';
    $('.title').slideToggle(); //

    // var $j = $.noConflict();
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip({ 'placement': 'top' });
    console.log(this)
  }
  toggleTitle() {
    $('.title').slideToggle(); //test only
  }

  onOpenModal() {
    console.log('onScanLibrary');
    this.ipcService.fileExplorer()
  }
  /**
   * Scans library folders for new movies
   */
  onScanLibrary() {
    console.log('onScanLibrary');
    this.ipcService.scanLibrary()
  }
  onUpdateTorrentDump() {
    console.log('onUpdateTorrentDump');
    this.ipcService.sendMessage('update-torrent-dump')
  }
  /**
   * Updates imdb files
   */
  onUpdateOfflineMetadata() {
    this.ipcService.sendMessage('update-torrent-dump')
    console.log('onUpdateOfflineMetadata');
  }

  /**
   * saves config file
   */
  onSave() {
    this.ipcService.sendMessage('save-preferences')
    console.log('onSave');
  }

  /**
   * Resets config fiile
   */
  onReset() {
    this.ipcService.sendMessage('reset-preferences')
    console.log('onReset');
  }

  onAddFolder(folderName: string) {
    console.log('onAddFolder');
    this.ipcService.openFolder('');
    // console.log(__dirname);
    // this.ipcService.openFolder(__dirname)
    // this.unsavedPreferences.libraryFolders.push(folderName)
  }
  onEditFolder(folder) {
    console.log('onEditFolder');
  }
  onDeleteFolder(folder) {
    console.log('onDeleteFolder');
    // this.unsavedPreferences.libraryFolders = this.unsavedPreferences.libraryFolders.filter(h => h !== folder)
  }

  /** Search query */
  onSearch(data) {
    this.ipcService.searchQuery(data)
  }
}
