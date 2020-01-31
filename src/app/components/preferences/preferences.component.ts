import { Component, OnInit, ChangeDetectorRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs'
import { IpcService, IpcCommand } from '../../services/ipc.service';
import { DEFAULT_PREFERENCES } from '../../mock-data'
import { IPreferences } from '../../interfaces'
import { REGEX_PREFIX } from '../../constants';
declare var $: any;
@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferencesComponent implements OnInit {
  @Input() data: Observable<any>

  currentDrive = 'C:\\'
  initialFolder = 'C:\\'
  testFoldersList = ['folder1', 'folder2']
  testLibraryFolders = ['C:\\Users\\', 'D:\\Movies']
  testCurrentFolder = 'D:\''
  title = 'angular 4 with jquery'
  libraryMovies = []
  libraryFolders = this.testLibraryFolders
  foldersList = this.testFoldersList
  currentFolder = this.initialFolder
  previousFolder = ''
  preferencesObject: IPreferences = {
    isDarkMode: false,
    isDirty: false,
    isEnableCache: false,
    frequencyValue: 3,
    frequencyUnit: 'day',
    libraryFolders: this.libraryFolders
  }
  constructor(
    private ipcService: IpcService,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit() {
    $('.title').slideToggle();
    //// var $j = $.noConflict();

    // this.onGetLibraryFolders()
    // this.onGetLibraryMovies()
    let libraryFoldersSubscription = this.ipcService.libraryFolders.subscribe((value) => {
      this.libraryFolders = value
      console.log('libraryfolders: ', value);
      // value.
      this.cdr.detectChanges()
    })
    console.log(typeof libraryFoldersSubscription);

    this.ipcService.libraryMovies.subscribe((value) => {
      this.libraryMovies = value
      this.cdr.detectChanges()
    })
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip({ placement: 'top' });
    this.ipcService.getFiles().then(value => {
      console.log('getFiles', value);
    }).catch(e => {
      console.log(e);
    })
    this.ipcService.getSystemDrives().then(value => {
      console.log('gotsystemdrives', value);
    }).catch(e => {
      console.log(e);
    })
  }

  toggleTitle() {
    $('.title').slideToggle(); // test only
  }

  setFoldersList() {

  }

  onGetLibraryMovies() {
    this.ipcService.getMoviesFromLibrary()
  }

  /**
   * Get list of library folders
   */
  onGetLibraryFolders() {
    this.ipcService.call(IpcCommand.RetrieveLibraryFolders)
  }

  /**
   * Opens file explorer modal
   */
  onOpenModal() {
    console.log('onOpenModal');
    this.onGoToFolder(this.initialFolder)
    this.ipcService.getSystemDrives()
  }

  /**
   * Closes file explorer modal
   */
  onCloseModal() {
    console.log('onClose');
    this.previousFolder = ''
  }

  /**
   * Scans library folders for new movies
   */
  onScanLibrary() {
    console.log('onScanLibrary');
    this.ipcService.call(IpcCommand.ScanLibrary)
  }
  /**
   * Updates thepiratebay torrent dump
   */
  onUpdateTorrentDump() {
    this.ipcService.call(IpcCommand.UpdateTorrentDump)
  }
  /**
   * Updates imdb files
   */
  onUpdateOfflineMetadata() {
    this.ipcService.call(IpcCommand.UpdateTorrentDump)
  }

  /**
   * saves config file
   */
  onSave() {
    this.preferencesObject.libraryFolders = this.libraryFolders
    this.ipcService.call(IpcCommand.SavePreferences, this.preferencesObject)
    console.log('onSave');
  }

  /**
   * Resets preferences.
   */
  onReset() {
    console.log('onReset');
    this.preferencesObject = DEFAULT_PREFERENCES
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
    this.cdr.detectChanges()
  }

  /**
   * Opens folder with system file explorer.
   * @param folder folder directory to open
   */
  onOpenFolder(folder: string) {
    let folderToOpen = ''
    if (folder.match(REGEX_PREFIX) == null) { // not match
      folderToOpen = this.currentFolder + folder;
    } else {
      folderToOpen = folder
    }
    this.ipcService.call(IpcCommand.OpenInFileExplorer, folderToOpen)
  }

  // modal file explorer
  // goes back to the previous folder
  onGoToPreviousFolder(folder: string) {
    if (this.previousFolder) {
      this.ipcService.openFolder(folder)
      this.currentFolder = this.previousFolder
    }
  }

  // goes back to the parent folder
  onGoToParentFolder() {

    if ((this.currentFolder.lastIndexOf('\\')) <= 2) {
      console.log('isparent');
    } else {
      this.previousFolder = this.currentFolder
    }
    this.ipcService.call(IpcCommand.GoToFolder, [IpcCommand.Up, this.currentFolder])
  }

  onGoToFolder(folder: string) {
    this.previousFolder = this.currentFolder
    this.currentFolder = folder
    this.ipcService.openFolder(folder)
  }
}
