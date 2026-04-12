import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type FeatureName = 'newSearch' | 'betaFeatures' | 'springMode' | 'torrent_flag' | 'direct_tmdb' | 'trailer' | 'played_status' | 'sessionWarning';

interface IFeature {
  description: string;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FeatureToggleService {
  private features: Partial<Record<FeatureName, IFeature>> = {};

  constructor(private http: HttpClient) { }

  loadConfig(): Promise<void> {
    return firstValueFrom(this.http.get<Record<FeatureName, IFeature>>('assets/config/feature-toggles.json'))
      .then(config => {
        this.features = config;
      })
      .catch(err => {
        console.error('Could not load feature toggles', err);
        this.features = {};
      });
  }

  isEnabled(featureName: FeatureName): boolean {
    return this.features[featureName]?.enabled === true;
  }
}
