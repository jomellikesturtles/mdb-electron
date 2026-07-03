import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseProfileService } from './base-profile.service';
import { IUserProfile } from '@models/user.model';
import { ENDPOINT } from '@shared/endpoint.const';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseProfileService {

  getProfile(username: string, refresh = false): Observable<IUserProfile> {

    return this.dataService.getHandle(

      this.httpBaseService.get(this.httpUrlProvider.getBffAPI(ENDPOINT.PROFILE, username)), this.ipcService.getProfile());

  }

  getProfiles(): Observable<IUserProfile[]> {
    return this.httpBaseService.get(this.httpUrlProvider.getBffAPI(ENDPOINT.PROFILES));
  }

  switchProfile(profileId: string): void {
    localStorage.setItem('active_profile_id', profileId);
    window.location.reload();
  }



  updateProfile(data: Partial<IUserProfile>): Observable<any> {
    return this.httpBaseService.post(this.httpUrlProvider.getBffAPI(ENDPOINT.PROFILE), data);
  }

  uploadAvatar(username: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpBaseService.post(this.httpUrlProvider.getBffAPI(ENDPOINT.PROFILE_AVATAR, username), formData);
  }
}


