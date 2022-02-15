import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvancedFindComponent } from '@components/advanced-find/advanced-find.component';
import { DiscoverComponent } from './discover/discover.component';

const routes: Routes = [

  { path: ':id', loadChildren: () => import('@modules/movie/details/details.module').then(m => m.DetailsModule) },
  // { path: ':id/credits', loadChildren: () => import('@modules/user/user.module').then(m => m.UserModule) },
  // { path: ':id/similar', component: AdvancedFindComponent },
  // { path: ':id/reviews', component: AdvancedFindComponent },
  { path: 'discover', component: DiscoverComponent },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }, // not found

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class MovieRoutingModule { }
