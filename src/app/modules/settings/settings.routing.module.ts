import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvancedFindComponent } from '@components/advanced-find/advanced-find.component';
// import { DiscoverComponent } from '@modules//discover/discover.component';

const routes: Routes = [

  // { path: 'preferences', component: DiscoverComponent },
  // { path: 'keyboard-shortcuts', component: DiscoverComponent },
  // { path: 'account', component: DiscoverComponent },
  // { path: 'profile', component: DiscoverComponent },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }, // not found

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
