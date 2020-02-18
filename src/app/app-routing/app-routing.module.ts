import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkDownloadComponent } from '../components/bulk-download/bulk-download.component';
import { BrowseComponent } from '../components/browse/browse.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { PersonDetailsComponent } from '../components/person-details/person-details.component';
import { PreferencesComponent } from '../components/preferences/preferences.component';
import { ProfileComponent } from '../components/profile/profile.component';

const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // homepage
  { path: '', redirectTo: '/results', pathMatch: 'full' },
  { path: 'bulk-download', component: BulkDownloadComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'navigation', component: NavigationComponent },
  { path: 'preferences', component: PreferencesComponent },
  { path: 'person-details/:id', component: PersonDetailsComponent },
  { path: 'person-details', component: PersonDetailsComponent },
  { path: 'profile', component: ProfileComponent },

  { path: 'bookmarks', loadChildren: '../components/bookmarks/bookmarks.module#BookmarksModule' },
  { path: 'dashboard', loadChildren: '../components/dashboard/dashboard.module#DashboardModule' },
  { path: 'discover', loadChildren: '../components/discover/discover.module#DiscoverModule' },
  { path: 'library', loadChildren: '../components/library/library.module#LibraryModule' },

  { path: 'results', loadChildren: '../components/results/results.module#ResultsModule' },
  { path: 'details/:id', loadChildren: '../components/details/details.module#DetailsModule' },
  { path: 'signin', loadChildren: '../components/signin/signin.module#SignInModule' },
  // { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }, // not found
  // { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }, // not found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
