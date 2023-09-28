import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@environments/environment';
import { akitaConfig, persistState } from '@datorama/akita';

akitaConfig({ resettable: true });
const storage = persistState({ storage: sessionStorage });
const providers = [{ provide: 'persistStorage', useValue: storage }];
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));
