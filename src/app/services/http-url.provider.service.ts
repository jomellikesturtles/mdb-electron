import { Injectable } from '@angular/core';
import { REPLACE_PARAMETER } from '@shared/endpoint.const';
import { CoreEnvironmentService } from './core-environment.service';

@Injectable({
  providedIn: 'root'
})
export class HttpUrlProviderService {

  constructor(
    private coreEnvironment: CoreEnvironmentService
  ) { }

  getFrontdoorApi(endpoint: string, ...params: any[]) {
    endpoint = this.replaceParams(endpoint, API_TYPE.FRONTDOOR, params);
    return `${this.coreEnvironment[API_TYPE.FRONTDOOR].uri}/${endpoint}`;
  }
  getBffAPI(endpoint: string, ...params: any[]) {
    endpoint = this.replaceParams(endpoint, API_TYPE.BFF, params);
    return `${this.coreEnvironment[API_TYPE.BFF].uri}/${endpoint}`;
  }

  private replaceParams(endpoint: string, apiType: API_TYPE, ...params: any[]): string {
    endpoint = endpoint.replace('cws_version', '1');
    if (params) {
      params.forEach((item) => {
        item.forEach((innerItem: string, index: number) => {
          endpoint = endpoint.replace((REPLACE_PARAMETER + '_' + (index + 1)), innerItem);
        });
      });
    }
    return endpoint;
  }
}

export enum API_TYPE {
  FRONTDOOR = 'frontdoorApi',
  BFF = 'bffApi'
}
