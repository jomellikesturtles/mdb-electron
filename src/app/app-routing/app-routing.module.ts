import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkDownloadComponent } from '../components/bulk-download/bulk-download.component';
import { BrowseComponent } from '../components/browse/browse.component';
import { CreditsComponent } from '../components/details/credits/credits.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { DetailsComponent } from '../components/details/details.component';
import { DiscoverComponent } from '../components/discover/discover.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { ResultsComponent } from '../components/results/results.component';
import { LibraryComponent } from '../components/library/library.component';
import { PersonDetailsComponent } from '../components/person-details/person-details.component';
import { PreferencesComponent } from '../components/preferences/preferences.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { SigninComponent } from '../components/signin/signin.component';

const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // homepage
  { path: '', redirectTo: '/results', pathMatch: 'full' },
  { path: 'bulk-download', component: BulkDownloadComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'credits/', component: CreditsComponent },
  { path: 'credits/:id', component: CreditsComponent },
  { path: 'details/:id', component: DetailsComponent },
  { path: 'details', component: DetailsComponent }, // test only
  { path: 'discover', component: DiscoverComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'navigation', component: NavigationComponent },
  { path: 'preferences', component: PreferencesComponent },
  { path: 'person-details/:id', component: PersonDetailsComponent },
  { path: 'person-details', component: PersonDetailsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'signin', component: SigninComponent },
  // { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }, // not found
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }, // not found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
