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
    const uri = this.getURI(API_TYPE.BFF);
    const bffUrl = this.coreEnvironment.environment[API_TYPE.BFF].url;
    
    let baseUrl = uri;
    if (!baseUrl && bffUrl) {
      baseUrl = bffUrl;
    }

    const finalUrl = baseUrl ? `${baseUrl}/${endpoint}` : endpoint;
    console.log(`BFF API URL: ${finalUrl}`);
    return finalUrl;
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
    if (configPath && configPath.includes('http')) {
      return configPath;
    } else {
      return '';
    }
  }
}

export enum API_TYPE {
  FRONTDOOR = 'frontdoor',
  BFF = 'bff'
}
