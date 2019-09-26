import { Component, OnInit, ChangeDetectorRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs'
import { IpcService } from '../../services/ipc.service';
declare var $: any;
@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferencesComponent implements OnInit {
  @Input() data: Observable<any>

  title = 'angular 4 with jquery'
  libraryFolders = []
  libraryMovies = []
  preferencesObject = {
    libraryFolders: [],
    isDarkMode: false,
    isDirty: false,
    isEnableCache: false
  }
  constructor(
    private ipcService: IpcService,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit() {
    $('.title').slideToggle(); //
    // var $j = $.noConflict();
    this.onGetLibraryFolders()
    this.onGetLibraryMovies()
    this.ipcService.libraryFolders.subscribe((value) => {
      this.libraryFolders = value
      this.cdr.detectChanges()
    })
    this.ipcService.libraryMovies.subscribe((value) => {
      this.libraryMovies = value
      this.cdr.detectChanges()
    })
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip({ placement: 'top' });
  }

  toggleTitle() {
    $('.title').slideToggle(); // test only
  }

  onGetLibraryMovies() {
    this.ipcService.getMoviesFromLibrary()
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
   * Scans library folders for new movies
   */
  onScanLibrary() {
    console.log('onScanLibrary');
    this.ipcService.scanLibrary()
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
    this.preferencesObject.libraryFolders = this.libraryFolders
    this.ipcService.savePreferences(this.preferencesObject)
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
    console.log('onDeleteFolder', folder);
    this.libraryFolders = this.libraryFolders.filter(h => h !== folder)
    console.log(this.libraryFolders)
    this.cdr.detectChanges()
  }
  /**
   * Opens folder
   * @param folder folder directory to open
   */
  onOpenFolder(folder: string) {
    console.log(folder);
    this.ipcService.openFolder(folder)
  }

  /** Search query */
  onSearch(data) {
    this.ipcService.searchQuery(data)
  }

  // modal file explorer
  // goes back to the previous folder
  onGoToPreviousFolder() {

  }
  // goes back to the parent folder
  onGoToParentFolder() {

  }
}
