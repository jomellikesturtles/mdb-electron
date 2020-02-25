import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchedComponent } from './view/watched.component';

const routes: Routes = [
  { path: '', component: WatchedComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class WatchedRoutingModule { }
