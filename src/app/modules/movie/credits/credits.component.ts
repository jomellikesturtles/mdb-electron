import { Component, OnInit, OnDestroy } from '@angular/core';
import { TMDB_FULL_MOVIE_DETAILS } from '../../../mock-data-movie-details';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit, OnDestroy {

  castList = TMDB_FULL_MOVIE_DETAILS.credits.cast
  crewList = TMDB_FULL_MOVIE_DETAILS.credits.crew

  constructor() { }

  ngOnInit() {
  }
  ngOnDestroy() {

  }
  goToPerson(id) {
    console.log(id);
  }
}