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
  { path: 'preferences', loadChildren: () => import('../components/preferences/preferences.module').then(m => m.PreferencesModule) },
  { path: 'preferences/bulk-download', component: BulkDownloadComponent },

  { path: 'person-details/:id', component: PersonDetailsComponent },
  { path: 'person-details', component: PersonDetailsComponent },
  { path: 'preview', component: PreviewComponent },

  { path: 'bookmarks', loadChildren: () => import('../components/bookmarks/bookmarks.module').then(m => m.BookmarksModule), canLoad: [MdbGuardGuard] },
  { path: 'watched', loadChildren: () => import('../components/watched/watched.module').then(m => m.WatchedModule) },
  { path: 'dashboard', loadChildren: () => import('../components/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'discover', loadChildren: () => import('../components/discover/discover.module').then(m => m.DiscoverModule) },
  { path: 'library', loadChildren: () => import('../components/library/library.module').then(m => m.LibraryModule) },

  { path: 'results', loadChildren: () => import('../components/results/results.module').then(m => m.ResultsModule) },
  { path: 'details/:id', loadChildren: () => import('../components/details/details.module').then(m => m.DetailsModule) },
  { path: 'user', loadChildren: () => import('../components/user/user.module').then(m => m.UserModule) },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }, // not found
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{enableTracing:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
