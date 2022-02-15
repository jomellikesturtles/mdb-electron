import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details.component';
import { CreditsComponent } from '../credits/credits.component';

const routes: Routes = [
  { path: '', component: DetailsComponent },
  { path: 'credits', component: CreditsComponent },
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
