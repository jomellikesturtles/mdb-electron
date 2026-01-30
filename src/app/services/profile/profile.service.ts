import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseProfileService } from './base-profile.service';
import { IUserProfile } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseProfileService {

  getProfile(refresh = false): Observable<IUserProfile> {
    return this.dataService.getHandle(
      this.http.get<any>(this.httpUrlProvider.getBffAPI('/profile')), this.ipcService.getProfile());
  }

  updateProfile(data: Partial<IUserProfile>): Observable<any> {
    return this.http.put(this.httpUrlProvider.getBffAPI('/profile'), data);
  }

}
