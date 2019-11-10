import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkDownloadComponent } from '../components/bulk-download/bulk-download.component';
import { BrowseComponent } from '../components/browse/browse.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { DetailsComponent } from '../components/details/details.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { ResultsComponent } from '../components/results/results.component';
import { LibraryComponent } from '../components/library/library.component';
import { PersonDetailsComponent } from '../components/person-details/person-details.component';
import { PreferencesComponent } from '../components/preferences/preferences.component';

const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // homepage
  { path: '', redirectTo: '/results', pathMatch: 'full' },
  { path: 'bulk-download', component: BulkDownloadComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'details/:id', component: DetailsComponent },
  { path: 'details', component: DetailsComponent }, // test only
  { path: 'library', component: LibraryComponent },
  { path: 'navigation', component: NavigationComponent },
  { path: 'preferences', component: PreferencesComponent },
  { path: 'person-details/:id', component: PersonDetailsComponent },
  { path: 'results', component: ResultsComponent },
  // { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }, // not found
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }, // not found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
