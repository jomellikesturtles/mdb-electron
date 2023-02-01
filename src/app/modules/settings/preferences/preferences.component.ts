import {
  Component, OnInit,
  // ChangeDetectorRef,
  // ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { IpcService } from '@services/ipc.service';
import { COLOR_LIST, DEFAULT_PREFERENCES, FONT_SIZE_LIST, FREQUENCY_LIST, LANGUAGE_LIST, MODE_LIST, QUALITY_LIST, STRING_REGEX_PREFIX } from '@shared/constants';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IPreferences } from '@models/preferences.model';
import { PreferencesService } from '@services/preferences.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferencesComponent implements OnInit, OnDestroy {

  initialFolder = 'C:\\';
  testFoldersList = ['folder1', 'folder2'];
  testLibraryFolders = ['C:\\Users\\', 'D:\\Movies'];
  testCurrentFolder = 'D:\'';
  title = 'angular 4 with jquery';
  libraryMovies = [];
  libraryFolders = this.testLibraryFolders;
  foldersList = this.testFoldersList;
  currentFolder = this.initialFolder;
  previousFolder = '';
  isDirty;
  preferencesObject: IPreferences;

  DEFAULT_LANGUAGE = 'en';
  languagesOptions = LANGUAGE_LIST;
  frequencyOptions = FREQUENCY_LIST;
  fontSizeOptions = FONT_SIZE_LIST;
  colorOptions = COLOR_LIST;
  qualityOptions = QUALITY_LIST;
  modeOptions = MODE_LIST;
  preferencesForm: FormGroup;
  private ngUnsubscribe = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private ipcService: IpcService,
    private preferencesService: PreferencesService
    // private cdr: ChangeDetectorRef
  ) {
    console.log('preferences constructor');
  }

  ngOnInit() {
    console.log('preferences oninit');
    this.preferencesForm = this.formBuilder.group({
      autoScan: [true, []],
      darkMode: [true, []],
      enableCache: [false, []],
      language: ['en', []],
      username: [true, []],
      scanFreqValue: [1, []],
      scanFreqUnit: ['min', []],

      fontColor: ['min', []],
      fontSize: ['min', []],
      fontOpacity: ['min', []],
      fontFamily: ['min', []],
      backgroundColor: ['min', []],


    }, {});

    this.preferencesForm.valueChanges.subscribe(e => {
      console.log(e);
    });
    // this.preferencesForm.controls[''].
    // this.onGetLibraryFolders()
    // this.onGetLibraryMovies()

    // this.ipcService.libraryMovies.subscribe((value) => {
    //   this.libraryMovies = value
    //   this.cdr.detectChanges()
    // })
    this.ipcService.getFiles().then(value => {
      console.log('getFiles', value);
    }).catch(e => {
      console.log(e);
    });
    this.ipcService.getSystemDrives().then(value => {
      console.log('gotsystemdrives', value);
    }).catch(e => {
      console.log(e);
    });

    this.preferencesObject = this.preferencesService.getPreferences();
    this.ipcService.getPreferences().pipe(takeUntil(this.ngUnsubscribe)).subscribe((e: IPreferences) => {
      console.log('this.ipcService.preferences ', e);
      this.preferencesObject = e;
    });

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
    this.onGoToFolder(this.initialFolder);
    this.ipcService.getSystemDrives();
  }

  /**
   * Closes file explorer modal
   */
  onCloseModal() {
    this.previousFolder = '';
  }

  /**
   * Scans library folders for new movies
   */
  onScanLibrary() {
    this.ipcService.startScanLibrary();
  }

  /**
   * Scans library folders for new movies
   */
  onStopScanLibrary() {
    console.log('onStopScanLibrary');
    this.ipcService.stopScanLibrary();
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
    this.preferencesService.savePreferences(this.preferencesObject);
    // this.preferencesObject.isDirty = false;
  }

  /**
   * Resets preferences.
   */
  onReset() {
    this.preferencesObject = DEFAULT_PREFERENCES;
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
    this.libraryFolders = this.libraryFolders.filter(h => h !== folder);
    // this.cdr.detectChanges()
  }

  /**
   * Opens folder with system file explorer.
   * @param folder folder directory to open
   */
  onOpenFolder(folder: string) {
    let folderToOpen = '';
    const REGEX_PREFIX = new RegExp(STRING_REGEX_PREFIX, `gi`);
    if (folder.match(REGEX_PREFIX) == null) { // not match
      folderToOpen = this.currentFolder + folder;
    } else {
      folderToOpen = folder;
    }
    // this.ipcService.call(this.ipcService.IPCCommand.OpenInFileExplorer, folderToOpen)
  }

  // modal file explorer
  // goes back to the previous folder
  onGoToPreviousFolder(folder: string) {
    if (this.previousFolder) {
      this.ipcService.openFolder(folder);
      this.currentFolder = this.previousFolder;
    }
  }

  // goes back to the parent folder
  onGoToParentFolder() {
    if ((this.currentFolder.lastIndexOf('\\')) <= 2) {
    } else {
      this.previousFolder = this.currentFolder;
    }
    // this.ipcService.call(this.ipcService.IPCCommand.GoToFolder, [this.ipcService.IPCCommand.Up, this.currentFolder])
  }

  onGoToFolder(folder: string) {
    this.previousFolder = this.currentFolder;
    this.currentFolder = folder;
    this.ipcService.openFolder(folder);
  }

  onValChange(e) {
    console.log('pref e ', e);
  }
}
