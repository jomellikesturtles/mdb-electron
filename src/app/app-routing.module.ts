import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkDownloadComponent } from './components/bulk-download/bulk-download.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DetailsComponent } from './components/details/details.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { SearchAndResultsComponent } from './components/search-and-results/search-and-results.component';
// import { SearchPanelComponent } from './search-panel/search-panel.component';
// import { ResultsPanelComponent } from './results-panel/results-panel.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'bulk-download', component: BulkDownloadComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'details/:imdbId', component: DetailsComponent },
  { path: 'navigation', component: NavigationComponent },
  { path: 'search-and-results', component: SearchAndResultsComponent },
  // { path: 'search', component: SearchPanelComponent },
  // { path: 'results', component: ResultsPanelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }