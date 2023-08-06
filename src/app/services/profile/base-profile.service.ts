import { IUserSavedData } from '@models/interfaces';
import { IMediaProgress } from '@models/media-progress';
import { Observable } from 'rxjs';
import { MDBApiService } from '@services/mdb-api.service';
import { IProfile } from '@modules/user/profile/profile.component';
import { DataService } from '@services/data.service';
import { IpcService } from '@services/ipc.service';
import { HttpClient } from '@angular/common/http';
import { HttpUrlProviderService } from '@services/http-url.provider.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export abstract class BaseProfileService {

  constructor(
    protected bffService: MDBApiService,
    protected dataService: DataService,
    protected ipcService: IpcService,
    protected http: HttpClient,
    protected httpUrlProvider: HttpUrlProviderService
  ) { }

  protected abstract getProfile(refresh: boolean): Observable<IProfile>;

}
