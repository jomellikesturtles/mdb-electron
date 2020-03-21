import { CommaSpacePipe, MdbPipesPipe, ReleaseYearPipe } from './mdb-pipes.pipe';
import { SimplifySizePipe, MagnetPipe } from './services/torrent.service';
import { SearchComponent } from './components/search/search.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { BulkDownloadComponent } from './components/bulk-download/bulk-download.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';
import { BrowseComponent } from './components/browse/browse.component';
import { PersonDetailsComponent } from './components/person-details/person-details.component';
// import { ProfileComponent } from './components/user/profile/profile.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NgxsModule } from '@ngxs/store';
import { CountState } from './app.state';
import { AppRunState } from './states/app-run.state';
import { SelectedMoviesState } from './movie.state';
import { NotificationComponent } from './components/notification/notification.component';
import { PreviewComponent } from './components/preview/preview/preview.component';
// import { UsernameExistValidatorDirective } from './directives/username-exist.directive'
@NgModule({
  declarations: [
    AppComponent,
    BulkDownloadComponent,
    PreferencesComponent,
    NavigationComponent,
    TopNavigationComponent,
    BrowseComponent,
    PersonDetailsComponent,
    SearchComponent,
    NotificationComponent,
    SimplifySizePipe,
    MagnetPipe,
    CommaSpacePipe,
    MdbPipesPipe,
    PreviewComponent,
    // ReleaseYearPipe
    // UsernameExistValidatorDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgxsModule.forRoot([CountState, SelectedMoviesState, AppRunState]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
