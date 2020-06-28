// import { PreviewComponent } from './../components/preview/preview/preview.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkDownloadComponent } from '../components/bulk-download/bulk-download.component';
import { BrowseComponent } from '../components/browse/browse.component';
import { PersonDetailsComponent } from '../components/person-details/person-details.component';
import { PreferencesComponent } from '../components/preferences/preferences.component';
import { PreviewComponent } from '../components/preview/preview/preview.component';
import { MdbGuardGuard } from '../mdb-guard.guard';

const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // homepage
  // { path: '', redirectTo: '/results', pathMatch: 'full' },
  { path: '', redirectTo: '/preferences', pathMatch: 'full' }, // for fast boot?
  // { path: '', redirectTo: '/preview', pathMatch: 'full' }, // for fast boot?
  { path: 'browse', component: BrowseComponent },
  { path: 'preferences', loadChildren: '../components/preferences/preferences.module#PreferencesModule' },
  { path: 'preferences/bulk-download', component: BulkDownloadComponent },

  { path: 'person-details/:id', component: PersonDetailsComponent },
  { path: 'person-details', component: PersonDetailsComponent },
  { path: 'preview', component: PreviewComponent },

  { path: 'bookmarks', loadChildren: '../components/bookmarks/bookmarks.module#BookmarksModule', canLoad: [MdbGuardGuard] },
  { path: 'watched', loadChildren: '../components/watched/watched.module#WatchedModule' },
  { path: 'dashboard', loadChildren: '../components/dashboard/dashboard.module#DashboardModule' },
  { path: 'discover', loadChildren: '../components/discover/discover.module#DiscoverModule' },
  { path: 'library', loadChildren: '../components/library/library.module#LibraryModule' },

  { path: 'results', loadChildren: '../components/results/results.module#ResultsModule' },
  { path: 'details/:id', loadChildren: '../components/details/details.module#DetailsModule' },
  { path: 'user', loadChildren: '../components/user/user.module#UserModule' },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }, // not found
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{enableTracing:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
