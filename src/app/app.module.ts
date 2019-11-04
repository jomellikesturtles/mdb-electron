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
import { FormsModule } from '@angular/forms'
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './components/search/search.component';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';
import { ResultsComponent } from './components/results/results.component';
import { LibraryComponent } from './components/library/library.component';
import { BrowseComponent } from './components/browse/browse.component';
import { } from './components/details/details.component';
import { CommaSpacePipe, MdbPipesPipe, ReleaseYearPipe, RuntimeDisplayPipe } from './mdb-pipes.pipe';

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
    RuntimeDisplayPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
