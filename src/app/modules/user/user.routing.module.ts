import { MdbGuardGuard } from '../../mdb-guard.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { ProfileComponent } from './profile/profile.component'

const routes: Routes = [

  {
    path: '', redirectTo: 'signin', pathMatch: 'full'
    // path: '', component: SigninComponent, pathMatch: 'full'
  },
  {
    path: 'signin', component: SigninComponent
  },
  {
    path: 'profile', component: ProfileComponent,
    // path: 'profile', component: ProfileComponent, canActivate: [MdbGuardGuard]
  },

  // {
  // path: '',
  // children: [
  // { path: 'profile', component: ProfileComponent }
  // ]
  // }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class UserRoutingModule { }
