import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkDownloadComponent } from 'app/modules/admin/bulk-download/bulk-download.component';
import { PersonDetailsComponent } from 'app/modules/person/person-details/person-details.component';
import { PreviewComponent } from '@shared/components/preview/preview.component';
import { MdbGuardGuard } from '../mdb-guard.guard';
import { AdvancedFindComponent } from '@components/advanced-find/advanced-find.component';
import { SigninComponent } from '@modules/user/signin/signin.component';

const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // homepage
  // { path: '', redirectTo: '/results', pathMatch: 'full' },
  { path: 'video', loadChildren: () => import('@modules/watch/video-player.module').then(m => m.VideoPlayerModule) },
  { path: 'browse', loadChildren: () => import('@modules/user/browse/browse.module').then(m => m.BrowseModule) },
  { path: 'preferences', loadChildren: () => import('@modules/settings/preferences/preferences.module').then(m => m.PreferencesModule), canActivate: [MdbGuardGuard] },
  { path: 'preferences/bulk-download', component: BulkDownloadComponent, canActivate: [MdbGuardGuard] },

  { path: 'person-details/:id', component: PersonDetailsComponent, canActivate: [MdbGuardGuard] },
  { path: 'person-details', component: PersonDetailsComponent, canActivate: [MdbGuardGuard] },
  { path: 'preview', component: PreviewComponent },

  { path: 'bookmarks', loadChildren: () => import('@modules/user/bookmarks/bookmarks.module').then(m => m.BookmarksModule), canLoad: [MdbGuardGuard], canActivate: [MdbGuardGuard] },
  { path: 'watched', loadChildren: () => import('@modules/user/watched/watched.module').then(m => m.WatchedModule), canActivate: [MdbGuardGuard] },
  { path: 'dashboard', loadChildren: () => import('@components/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [MdbGuardGuard] },
  { path: 'discover', loadChildren: () => import('@modules/movie/discover/discover.module').then(m => m.DiscoverModule), canActivate: [MdbGuardGuard] },
  { path: 'library', loadChildren: () => import('@modules/person/library/library.module').then(m => m.LibraryModule), canActivate: [MdbGuardGuard] },

  { path: 'search', loadChildren: () => import('@components/results/results.module').then(m => m.ResultsModule), canActivate: [MdbGuardGuard] },
  { path: 'details', loadChildren: () => import('@modules/movie/details/details.module').then(m => m.DetailsModule), canActivate: [MdbGuardGuard] },
  { path: 'user', loadChildren: () => import('@modules/user/user.module').then(m => m.UserModule) },
  { path: 'advanced-find', component: AdvancedFindComponent, canActivate: [MdbGuardGuard] },
  { path: 'login', component: SigninComponent },
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
  // imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
