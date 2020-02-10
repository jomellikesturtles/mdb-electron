import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { BulkDownloadComponent } from './components/bulk-download/bulk-download.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { DetailsComponent } from './components/details/details.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MagnetPipe, SimplifySizePipe } from './services/torrent.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './components/search/search.component';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';
import { ResultsComponent } from './components/results/results.component';
import { LibraryComponent } from './components/library/library.component';
import { BrowseComponent } from './components/browse/browse.component';
import { CommaSpacePipe, MdbPipesPipe, ReleaseYearPipe, RuntimeDisplayPipe } from './mdb-pipes.pipe';
import { PersonDetailsComponent } from './components/person-details/person-details.component';
import { CreditsComponent } from './components/details/credits/credits.component';
import { VideoComponent } from './components/details/video/video.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SigninComponent } from './components/signin/signin.component';
import { DiscoverComponent } from './components/discover/discover.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { RepeatPasswordValidatorDirective } from './directives/repeat-password.directive';
// import { repeatPasswordValidator } from './directives/repeat-password.directive';
import { RepeatPasswordValidatorDirective } from './directives/repeat-password.directive';
import { CredentialsDirective } from './directives/credentials.directive';
import { NgxsModule } from '@ngxs/store';
import { CountState } from './app.state';
import { AppRunState } from './states/app-run.state';
import { SelectedListComponent } from './components/selected-list/selected-list/selected-list.component';
import { SelectedMoviesState } from './movie.state';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { NotificationComponent } from './components/notification/notification.component';
@NgModule({
  declarations: [
    AppComponent,
    BulkDownloadComponent,
    DashboardComponent,
    PreferencesComponent,
    DetailsComponent,
    NavigationComponent,
    MagnetPipe,
    SimplifySizePipe,
    SearchComponent,
    TopNavigationComponent,
    ResultsComponent,
    LibraryComponent,
    BrowseComponent,
    CommaSpacePipe,
    MdbPipesPipe,
    ReleaseYearPipe,
    RuntimeDisplayPipe,
    PersonDetailsComponent,
    CreditsComponent,
    VideoComponent,
    BookmarksComponent,
    ProfileComponent,
    SigninComponent,
    DiscoverComponent,
    RepeatPasswordValidatorDirective,
    CredentialsDirective,
    SelectedListComponent,
    MovieCardComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgxsModule.forRoot([CountState, SelectedMoviesState, AppRunState]),
    // HttpParams
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
