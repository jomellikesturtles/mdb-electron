import { Observable, Subject } from 'rxjs';
/**
 * Data sharing service.
 */
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  isGetTorrentFromMovieCard = false
  constructor() { }

}
