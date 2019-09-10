import { Component, OnInit, ChangeDetectorRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs'
import { IpcService } from '../../services/ipc.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferencesComponent implements OnInit {
  @Input() data: Observable<any>
  // userPreferences = USERPREFERENCES;
  // unsavedPreferences: Preferences;
  title = 'angular 4 with jquery'
  libraryFolders = []
  sampleFolders = ['f1', 'f2']
  constructor(
    private ipcService: IpcService,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit() {
    $('.title').slideToggle(); //
    // var $j = $.noConflict();
    this.onGetLibraryFolders()
    this.ipcService.libraryFolders.subscribe((value) => {
      console.log('libraryFolders: ', value);
      console.log('libraryFolders[0]: ', value[0]);
      const temp = this.libraryFolders
      this.libraryFolders = value
      console.log('this.libraryFolders: ', this.libraryFolders);
      this.cdr.detectChanges()
    })
    // this.ipcService.libraryFolders.subscribe((value) => {
    //   console.log('libraryFolders: ', value);
    //   console.log('libraryFolders[0]: ', value[0]);
    //   const temp = this.libraryFolders
    //   this.libraryFolders = [...temp, ...value]
    //   console.log('this.libraryFolders: ', this.libraryFolders);
    //   // this.cdr.markForCheck();
    // })
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip({ placement: 'top' });
  }

  toggleTitle() {
    $('.title').slideToggle(); // test only
  }

  getLibraryFoldersList() {
    return this.libraryFolders
  }
  /**
   * Get list of library folders
   */
  onGetLibraryFolders() {
    console.log('onGetLibraryFolders');
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
