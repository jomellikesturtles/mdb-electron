import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseProfileService } from './base-profile.service';
import { IUserProfile } from '@models/user.model';
import { ENDPOINT } from '@shared/endpoint.const';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseProfileService {

  getProfile(refresh = false): Observable<IUserProfile> {

    return this.dataService.getHandle(

      this.httpBaseService.get(this.httpUrlProvider.getBffAPI(ENDPOINT.PROFILE)), this.ipcService.getProfile());

  }



  updateProfile(data: Partial<IUserProfile>): Observable<any> {

    return this.httpBaseService.post(this.httpUrlProvider.getBffAPI(ENDPOINT.PROFILE), data);

  }

}


