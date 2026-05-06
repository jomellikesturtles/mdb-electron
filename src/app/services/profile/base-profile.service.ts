import { Observable } from 'rxjs';
import { MDBApiService } from '@services/mdb-api.service';
import { IUserProfile } from '@models/user.model';
import { DataService } from '@services/data.service';
import { IpcService } from '@services/ipc.service';
import { HttpUrlProviderService } from '@services/http-url.provider.service';
import { Injectable } from '@angular/core';
import { HttpBaseService } from '@services/http-base.service';


@Injectable({
  providedIn: 'root'
})
export abstract class BaseProfileService {

  constructor(
    protected bffService: MDBApiService,
    protected dataService: DataService,
    protected ipcService: IpcService,
    protected httpBaseService: HttpBaseService,
    protected httpUrlProvider: HttpUrlProviderService
  ) { }

  protected abstract getProfile(refresh: boolean): Observable<IUserProfile>;

}
