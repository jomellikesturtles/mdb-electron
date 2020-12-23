import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs'
import { IpcService } from '../../services/ipc.service';
import { DEFAULT_PREFERENCES } from '../../mock-data'
import { IPreferences } from '../../interfaces'
import { STRING_REGEX_PREFIX } from '../../constants';
import { takeUntil } from 'rxjs/operators';
import { Subtitle } from 'src/app/models/subtitle.model';
import { MovieService } from 'src/app/services/movie.service';
import SubtitlesUtil from 'src/app/utils/subtitles.utils';
import chardet from "chardet";
import jschardet from "jschardet";
// declare var $: any;
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
  language = 'en'
  HOTKEYS = HOTKEYS
  private ngUnsubscribe = new Subject();
  constructor(
    private ipcService: IpcService,
    private movieService: MovieService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // $('.title').slideToggle();
    //// var $j = $.noConflict();

    // this.onGetLibraryFolders()
    // this.onGetLibraryMovies()

    this.ipcService.libraryMovies.subscribe((value) => {
      this.libraryMovies = value
      this.cdr.detectChanges()
    })
    // $('[data-toggle="popover"]').popover();
    // $('[data-toggle="tooltip"]').tooltip({ placement: 'top' });
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  toggleTitle() {
    // $('.title').slideToggle(); // test only
  }

  setFoldersList() {

  }

  /**
   * Get list of library folders
   */
  onGetLibraryFolders() {
    this.ipcService.call(this.ipcService.IPCCommand.RetrieveLibraryFolders)
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
    this.ipcService.call(this.ipcService.IPCCommand.UpdateTorrentDump)
  }
  /**
   * Updates imdb files
   */
  onUpdateOfflineMetadata() {
    this.ipcService.call(this.ipcService.IPCCommand.UpdateTorrentDump)
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
    this.ipcService.call(this.ipcService.IPCCommand.OpenInFileExplorer, folderToOpen)
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
    this.ipcService.call(this.ipcService.IPCCommand.GoToFolder, [this.ipcService.IPCCommand.Up, this.currentFolder])
  }

  onGoToFolder(folder: string) {
    this.previousFolder = this.currentFolder
    this.currentFolder = folder
    this.ipcService.openFolder(folder)
  }

  resetHotkeys() { }
  saveHotkeys() { }
  subtitleMap = new Map<number, Subtitle>();

  // test only
  async changeCc() {


    let filePath = ''

    filePath = await this.ipcService.changeSubtitle()
    filePath = 'tmp/' + filePath
    console.log('filePath', filePath)

    const fileStr = await this.movieService.getSubtitleFileString(filePath).toPromise()
    const encodingAlt = chardet.analyse(fileStr)
    const encoding = jschardet.detect(fileStr, { minimumThreshold: 0 }).encoding

    const file = await this.movieService.getSubtitleFile(filePath).toPromise()

    let resultFileStr
    const fileReader = new FileReader()

    fileReader.readAsText(file, encoding);
    const root = this
    fileReader.onloadend = function (x) {
      resultFileStr = fileReader.result
      console.log(resultFileStr)
      resultFileStr = resultFileStr.replace(/[\r]+/g, '')
      root.subtitleMap = SubtitlesUtil.mapSubtitle(resultFileStr)
      console.log("subtitleMap!", root.subtitleMap)
    };

  }
}

// @Pipe({ name: 'dataDisplay' })
// export class DataDisplayPipe implements PipeTransform {
//   transform(value: any): string {
//     if (value === null || value === undefined || value === '')
//       return 'noData'
//   }
// }

const HOTKEYS = {
  // ToggleFULL
  mute: 'm',
  fullscreen: 'f'
}
