import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core'
import { IPreferences } from '@models/preferences.model';
import { DEFAULT_PREFERENCES } from '@shared/constants';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  isGetTorrentFromMovieCard = false

  preferences: IPreferences
  constructor() { }

  /**
   * Pull preferences from file or online source.
   */
  pullPreferences() { }

  getPreferences() {
    if (!this.preferences) this.preferences = DEFAULT_PREFERENCES
    return this.preferences
  }

  savePreferences(prefrences: IPreferences) {
    // this.ipcService.savePreferences(DEFAULT_PREFERENCES)
    // this.ipcService.preferences.subscribe(e => {
    //   console.log('this.ipcService.preferences ', e)
    //   this.preferencesObject = e
    // })
    // this.preferencesObject.libraryFolders = this.libraryFolders
    // this.ipcService.call(this.ipcService.IPCCommand.PREFERENCES_SET, this.preferencesObject)
  }

  resetPreferences() {
    this.preferences = DEFAULT_PREFERENCES
  }
}
