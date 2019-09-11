import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BulkDownloadComponent } from './components/bulk-download/bulk-download.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { DetailsComponent } from './components/details/details.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { SearchAndResultsComponent } from './components/search-and-results/search-and-results.component';
import { MagnetPipe, SimplifySizePipe } from './services/torrent.service';
import { FormsModule } from '@angular/forms'
@NgModule({
  declarations: [
    AppComponent,
    BulkDownloadComponent,
    DashboardComponent,
    PreferencesComponent,
    DetailsComponent,
    NavigationComponent,
    SearchAndResultsComponent,
    MagnetPipe,
    SimplifySizePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
