import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoreEnvironmentService {

  constructor() { }

  private _environment: any = null;


  init(environment: any): Promise<void> {
    this._environment = environment;
    return Promise.resolve();
  }
  get environment(): any {
    return this._environment;
  }
  get apiKey() {
    return this._environment.apiKey;
  }
}
