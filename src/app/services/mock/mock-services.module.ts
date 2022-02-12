


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MovieService } from '@services/movie/movie.service';
import { MockMovieService } from './services/mock-movie.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    {
      provide: MovieService,
      useExisting: MockMovieService
    }
  ],
})
export class MockServicesModule { } // or MockCoreServicesModule
