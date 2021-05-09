import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs'
import { IpcService } from '@services/ipc.service';
import { DEFAULT_PREFERENCES } from '../../mock-data'
import { IPreferences } from '../../interfaces'
import { STRING_REGEX_PREFIX } from '@shared/constants';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferencesComponent implements OnInit, OnDestroy {

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
  isDirty
  preferencesObject: IPreferences = DEFAULT_PREFERENCES
  DEFAULT_LANGUAGE = 'en'
  languagesOptions = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
    { value: 'es', label: 'Spanish' },
  ]
  private ngUnsubscribe = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private ipcService: IpcService,
    private cdr: ChangeDetectorRef
  ) { }

  preferencesForm: FormGroup
  ngOnInit() {


    this.preferencesForm = this.formBuilder.group({
      language: ['en', []],
      autoScan: [true, []],
      username: [true, []],
    }, {})

    this.preferencesForm.valueChanges.subscribe(e=>{
      console.log(e);
    })
    // this.preferencesForm.controls[''].
    // this.onGetLibraryFolders()
    // this.onGetLibraryMovies()

    this.ipcService.libraryMovies.subscribe((value) => {
      this.libraryMovies = value
      this.cdr.detectChanges()
    })
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

    this.ipcService.getPreferences()
    this.ipcService.preferences.pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
      console.log('this.ipcService.preferences ', e)
      this.preferencesObject = e
    })

  }

  getValue() {
    const language = this.preferencesForm.get('language').value
    const autoScan = this.preferencesForm.get('autoScan').value
    console.log('language: ', language)
    console.log('autoScan: ', autoScan)
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  toggleTitle() {
  }

  setFoldersList() {

  }

  /**
   * Get list of library folders
   */
  onGetLibraryFolders() {
  }

  /**
   * Opens file explorer modal
   */
  onOpenModal() {
    this.onGoToFolder(this.initialFolder)
    this.ipcService.getSystemDrives()
  }

  /**
   * Closes file explorer modal
   */
  onCloseModal() {
    this.previousFolder = ''
  }

  /**
   * Scans library folders for new movies
   */
  onScanLibrary() {
    this.ipcService.startScanLibrary()
  }

  /**
   * Scans library folders for new movies
   */
  onStopScanLibrary() {
    console.log('onStopScanLibrary');
    this.ipcService.stopScanLibrary()
  }

  /**
   * Updates thepiratebay torrent dump
   */
  onUpdateTorrentDump() {
  }
  /**
   * Updates imdb files
   */
  onUpdateOfflineMetadata() {
  }

  onSyncUserData() {

  }

  /**
   * saves config file
   */
  onSave() {
    this.ipcService.savePreferences(DEFAULT_PREFERENCES)
    // this.ipcService.preferences.subscribe(e => {
    //   console.log('this.ipcService.preferences ', e)
    //   this.preferencesObject = e
    // })
    // this.preferencesObject.libraryFolders = this.libraryFolders
    // this.ipcService.call(this.ipcService.IPCCommand.PREFERENCES_SET, this.preferencesObject)
    // this.preferencesObject.isDirty = false;
  }

  /**
   * Resets preferences.
   */
  onReset() {
    this.preferencesObject = DEFAULT_PREFERENCES
    this.isDirty = false;
  }

  onAddFolder(folderName: string) {
    this.ipcService.openFolder('');
    // this.ipcService.openFolder(__dirname)
    // this.unsavedPreferences.libraryFolders.push(folderName)
  }
  onEditFolder(folder) {
  }

  /**
   * Deletes folder from library
   * @param folder folder directory to delete
   */
  onDeleteFolder(folder) {
    this.libraryFolders = this.libraryFolders.filter(h => h !== folder)
    this.cdr.detectChanges()
  }

  /**
   * Opens folder with system file explorer.
   * @param folder folder directory to open
   */
  onOpenFolder(folder: string) {
    let folderToOpen = ''
    const REGEX_PREFIX = new RegExp(STRING_REGEX_PREFIX, `gi`)
    if (folder.match(REGEX_PREFIX) == null) { // not match
      folderToOpen = this.currentFolder + folder;
    } else {
      folderToOpen = folder
    }
    // this.ipcService.call(this.ipcService.IPCCommand.OpenInFileExplorer, folderToOpen)
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
    } else {
      this.previousFolder = this.currentFolder
    }
    // this.ipcService.call(this.ipcService.IPCCommand.GoToFolder, [this.ipcService.IPCCommand.Up, this.currentFolder])
  }

  onGoToFolder(folder: string) {
    this.previousFolder = this.currentFolder
    this.currentFolder = folder
    this.ipcService.openFolder(folder)
  }

  onValChange(e) {
    console.log('pref e ', e)
  }
}
