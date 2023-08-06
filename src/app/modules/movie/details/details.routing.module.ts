import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details.component';
import { CreditsComponent } from '../credits/credits.component';
import { MovieDetailsGuard } from './details.guard';

const routes: Routes = [
  // { path: '', component: DetailsComponent },
  {
    path: ':id', component: DetailsComponent, canActivate: [MovieDetailsGuard], resolve: {},
    children: [
      { path: 'credits', component: CreditsComponent },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class DetailsRoutingModule { }
