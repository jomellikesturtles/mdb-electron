import { Injectable } from '@angular/core';
import { LoggerService } from '@core/logger.service';
import { ENDPOINT } from '@shared/endpoint.const';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { MDBApiService } from './mdb-api.service';
import { HttpUrlProviderService } from './http-url.provider.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(
    private httpBaseService: HttpBaseService,
    private httpUrlProvider: HttpUrlProviderService,
    private logger: LoggerService
  ) { }
  getConfiguration(): Observable<any> {
    // const url = `${BFF_URL}/config`;
    // const url = `${BFF_URL}/config/versions`;
    return this.httpBaseService.get(ENDPOINT.ACTUATOR_HEALTH);
  }
}
