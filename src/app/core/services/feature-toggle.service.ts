import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureToggleService {
  private features: { [key: string]: boolean } = {};

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return firstValueFrom(this.http.get<{ [key: string]: boolean }>('assets/config/feature-toggles.json'))
      .then(config => {
        this.features = config;
      })
      .catch(err => {
        console.error('Could not load feature toggles', err);
        this.features = {};
      });
  }

  isEnabled(featureName: string): boolean {
    return this.features[featureName] === true;
  }
}
