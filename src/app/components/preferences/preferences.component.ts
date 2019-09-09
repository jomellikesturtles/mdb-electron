import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IpcService } from '../../services/ipc.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  // userPreferences = USERPREFERENCES;
  // unsavedPreferences: Preferences;
  constructor(
    private ipcService: IpcService
  ) {
  }
  title = 'angular 4 with jquery'
  ngOnInit() {
    $('.title').slideToggle(); //

    // var $j = $.noConflict();
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip({ 'placement': 'top' });
    // console.log(this)
    this.onGetLibraryFolders()
    // this.ipcService.libraryFolders.subscribe((value) => {
    //   console.log('libraryFolders', value);
    // })
  }
  toggleTitle() {
    $('.title').slideToggle(); // test only
  }

  /**
   * Get list of library folders
   */
  onGetLibraryFolders() {
    this.ipcService.getLibraryFolders()
  }
  /**
   * Opens file explorer modal
   */
  onOpenModal() {
    console.log('onOpenModal');
    this.ipcService.modalFileExplorer()
  }

  /**
   * Opens the folder
   */
  onOpenFileExplorer() {
    console.log('onOpenFileExplorer');
    this.ipcService.fileExplorer()
  }
  /**
   * Scans library folders for new movies
   */
  onScanLibrary() {
    console.log('onScanLibrary');
    this.ipcService.scanLibrary()
  }
  onGoToPreviousFolder() {

  }
  onGoToParentFolder() {

  }
  /**
   * Updates thepiratebay torrent dump
   */
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

  /**
   * Deletes folder from library
   * @param folder folder directory to delete
   */
  onDeleteFolder(folder) {
    console.log('onDeleteFolder');
    // this.unsavedPreferences.libraryFolders = this.unsavedPreferences.libraryFolders.filter(h => h !== folder)
  }

  /** Search query */
  onSearch(data) {
    this.ipcService.searchQuery(data)
  }
}
