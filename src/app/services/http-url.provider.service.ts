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
    return `${this.coreEnvironment[API_TYPE.FRONTDOOR].url}/${endpoint}`;
  }
  getBffAPI(endpoint: string, ...params: any[]) {
    endpoint = this.replaceParams(endpoint, API_TYPE.BFF, params);
    console.log('${this.getURI(API_TYPE.BFF)}/${endpoint}:', `${this.getURI(API_TYPE.BFF)} / ${endpoint}`);
    return `${this.getURI(API_TYPE.BFF)}/${endpoint}`;
    // return endpoint;
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
  getURI(api: API_TYPE): string {
    const configPath = this.coreEnvironment.environment[api].uri;
    const origin = window.location.origin;
    if (configPath.includes('http')) {
      return configPath;
    } else {
      // file:

    }
  }
}

export enum API_TYPE {
  FRONTDOOR = 'frontdoor',
  BFF = 'bff'
}
