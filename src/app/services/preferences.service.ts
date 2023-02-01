import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { IPreferences } from '@models/preferences.model';
import { DEFAULT_PREFERENCES } from '@shared/constants';
import { IpcService } from './ipc.service';
import { takeUntil, tap } from 'rxjs/operators';
import { LoggerService } from '@core/logger.service';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  constructor(
    private ipcService: IpcService,
    private loggerService: LoggerService) {
    this.getPreferencesFromDb().pipe(takeUntil(this.ngUnsubscribe)).subscribe((e: IPreferences) => {
      this.loggerService.info(`this.ipcService.preferences  ${JSON.stringify(e)}`);
      this.preferencesV2.next(e);
    });
  }
  isGetTorrentFromMovieCard = false;
  preferences: IPreferences;
  preferencesV2 = new BehaviorSubject<IPreferences>(DEFAULT_PREFERENCES);
  private ngUnsubscribe = new Subject();
  /**
   * Pull preferences from file or online source.
   */
  pullPreferences() { }

  getPreferences() {
    if (!this.preferencesV2) this.preferencesV2.next(DEFAULT_PREFERENCES);
    return this.preferencesV2.value;
  }

  private getPreferencesFromDb() {
    return this.ipcService.getPreferences();
  }

  savePreferences(prefrences: IPreferences) {
    return this.ipcService.savePreferences(prefrences).pipe(tap((e: IPreferences) => {
      this.preferencesV2.next(e);
    }));
  }

  resetPreferences() {
    return this.ipcService.savePreferences(DEFAULT_PREFERENCES).pipe(tap((e: IPreferences) => {
      this.preferencesV2.next(e);
    }));
  }
}
