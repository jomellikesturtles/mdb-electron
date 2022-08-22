import { SearchComponent } from '@components/search/search.component';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { BulkDownloadComponent } from 'app/modules/admin/bulk-download/bulk-download.component';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TopNavigationComponent } from '@core/components/top-navigation/top-navigation.component';
import { BrowseComponent } from '@modules/user/browse/browse.component';
import { PersonDetailsComponent } from 'app/modules/person/person-details/person-details.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '@environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NotificationComponent } from 'app/modules/events/notification/notification.component';
import { PreviewComponent } from '@shared/components/preview/preview.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MdbGuardGuard } from './mdb-guard.guard';
import { backendProvider } from './services/http-interceptor.service';
import { RouterModule } from '@angular/router';
import { FloatingPlayerComponent } from '@shared/components/floating-player/floating-player.component';
import { SharedModule } from '@shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AdvancedFindComponent } from '@components/advanced-find/advanced-find.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { ImagePreviewComponent } from '@shared/components/image-preview/image-preview.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { KeyboardShortcutsComponent } from '@modules/settings/keyboard-shortcuts/keyboard-shortcuts.component';
import { VideoPlayerModule } from '@modules/watch/video-player.module';
import { YoutubePlayerComponent } from '@shared/components/youtube-player/youtube-player.component';
import { MdbButtonComponent } from './core/elements/mdb-button/mdb-button.component';
import { CoreEnvironmentService } from '@services/core-environment.service';

@NgModule({
  declarations: [
    AppComponent,
    BulkDownloadComponent,
    NavigationComponent,
    TopNavigationComponent,
    BrowseComponent,
    PersonDetailsComponent,
    SearchComponent,
    NotificationComponent,
    PreviewComponent,
    FloatingPlayerComponent,
    AdvancedFindComponent,
    ImagePreviewComponent,
    KeyboardShortcutsComponent,
    YoutubePlayerComponent,
    MdbButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    RouterModule.forRoot([]),
    SharedModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTabsModule,
    MatDialogModule,
    MatAutocompleteModule,
    VideoPlayerModule
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  entryComponents: [ImagePreviewComponent],
  providers: [MdbGuardGuard, backendProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializerFactory,
      deps: [
        CoreEnvironmentService
      ],
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function AppInitializerFactory(coreEnvironmentService: CoreEnvironmentService) {
  return async function init() {
    return Promise.all([
      await coreEnvironmentService.init(window['environment'])
    ]);
  };
}
