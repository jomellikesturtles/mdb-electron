import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkDownloadComponent } from 'app/modules/admin/bulk-download/bulk-download.component';
import { BrowseComponent } from '@components/browse/browse.component';
import { PersonDetailsComponent } from 'app/modules/person/person-details/person-details.component';
import { PreviewComponent } from '@shared/components/preview/preview.component';
import { MdbGuardGuard } from '../mdb-guard.guard';
import { AdvancedFindComponent } from '@components/advanced-find/advanced-find.component';

const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // homepage
  // { path: '', redirectTo: '/results', pathMatch: 'full' },
  { path: 'video', loadChildren: () => import('@components/video-player/video-player.module').then(m => m.VideoPlayerModule) },
  { path: '', redirectTo: '/preferences', pathMatch: 'full' }, // for fast boot?
  { path: 'browse', component: BrowseComponent },
  { path: 'preferences', loadChildren: () => import('app/modules/settings/preferences/preferences.module').then(m => m.PreferencesModule) },
  { path: 'preferences/bulk-download', component: BulkDownloadComponent },

  { path: 'person-details/:id', component: PersonDetailsComponent },
  { path: 'person-details', component: PersonDetailsComponent },
  { path: 'preview', component: PreviewComponent },

  { path: 'bookmarks', loadChildren: () => import('@components/bookmarks/bookmarks.module').then(m => m.BookmarksModule), canLoad: [MdbGuardGuard] },
  { path: 'watched', loadChildren: () => import('@components/watched/watched.module').then(m => m.WatchedModule) },
  { path: 'dashboard', loadChildren: () => import('@components/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'discover', loadChildren: () => import('@components/discover/discover.module').then(m => m.DiscoverModule) },
  { path: 'library', loadChildren: () => import('@components/library/library.module').then(m => m.LibraryModule) },

  { path: 'results', loadChildren: () => import('@components/results/results.module').then(m => m.ResultsModule) },
  { path: 'details/:id', loadChildren: () => import('@components/details/details.module').then(m => m.DetailsModule) },
  { path: 'user', loadChildren: () => import('@components/user/user.module').then(m => m.UserModule) },
  { path: 'advanced-find', component: AdvancedFindComponent },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }, // not found

  // new structure:
  // { path: 'home', loadChildren: () => import('@components/user/user.module').then(m => m.UserModule) },
  // { path: 'movie', loadChildren: () => import('@components/user/user.module').then(m => m.MovieModule) },
  // { path: 'user', loadChildren: () => import('@components/user/user.module').then(m => m.UserModule) },
  // { path: 'person', loadChildren: () => import('@components/user/user.module').then(m => m.PersonModule) },
  // { path: 'search', loadChildren: () => import('@components/user/user.module').then(m => m.SearchModule) },
  // { path: 'watch', loadChildren: () => import('@components/user/user.module').then(m => m.WatchModule) },
  // { path: 'settings', loadChildren: () => import('@components/user/user.module').then(m => m.SettingsModule) },
  // { path: 'events', loadChildren: () => import('@components/user/user.module').then(m => m.EventsModule) },
  // { path: 'login', loadChildren: () => import('@components/user/user.module').then(m => m.LoginModule) },
  // { path: 'register', loadChildren: () => import('@components/user/user.module').then(m => m.RegisterModule) },
  // { path: 'reset-password', loadChildren: () => import('@components/user/user.module').then(m => m.ResetPasswordModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
