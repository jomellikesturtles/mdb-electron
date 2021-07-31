import {
  CommaSpacePipe, ReleaseYearPipe,
} from './mdb-pipes.pipe';
import { SimplifySizePipe, MagnetPipe } from './services/torrent.service';
import { SearchComponent } from '@components/search/search.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { BulkDownloadComponent } from '@components/bulk-download/bulk-download.component';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { TopNavigationComponent } from '@components/top-navigation/top-navigation.component';
import { BrowseComponent } from '@components/browse/browse.component';
import { PersonDetailsComponent } from '@components/person-details/person-details.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '.@enviroments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NgxsModule } from '@ngxs/store';
import { CountState } from './app.state';
import { AppRunState } from './states/app-run.state';
import { SelectedMoviesState } from './movie.state';
import { NotificationComponent } from '@components/notification/notification.component';
import { PreviewComponent, GenrePipe } from '@components/preview/preview.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MdbGuardGuard } from './mdb-guard.guard';
import { backendProvider } from './services/http-interceptor.service';
import { RouterModule } from '@angular/router';
import { FloatingPlayerComponent } from '@components/floating-player/floating-player.component';
import { SharedModule } from '@components/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AdvancedFindComponent } from '@components/advanced-find/advanced-find.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { KeyboardShortcutsComponent } from './components/keyboard-shortcuts/keyboard-shortcuts.component';
import { VideoPlayerModule } from '@components/video-player/video-player.module';
import { YoutubePlayerComponent } from './components/youtube-player/youtube-player.component';

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
    SimplifySizePipe,
    MagnetPipe,
    CommaSpacePipe,
    PreviewComponent,
    FloatingPlayerComponent,
    GenrePipe,
    AdvancedFindComponent,
    ImagePreviewComponent,
    KeyboardShortcutsComponent,
    YoutubePlayerComponent,
    // ReleaseYearPipe/
    // UsernameExistValidatorDirective
    // RuntimeDisplayPipe
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
    NgxsModule.forRoot([CountState, SelectedMoviesState, AppRunState]),
    SharedModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTabsModule,
    MatDialogModule,
    MatAutocompleteModule,
    VideoPlayerModule
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  entryComponents:[ImagePreviewComponent],
  providers: [MdbGuardGuard, backendProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
