import { Injectable } from '@angular/core';
import { IUserSavedData } from '@models/interfaces';
import { Observable } from 'rxjs';
import { BaseProfileService } from './base-profile.service';
import { IProfile } from '@modules/user/profile/profile.component';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseProfileService {

  getProfile(refresh = false): Observable<IProfile> {
    return this.dataService.getHandle(
      this.http.get<any>(this.httpUrlProvider.getBffAPI('/profile')), this.ipcService.getProfile());
  }

}
