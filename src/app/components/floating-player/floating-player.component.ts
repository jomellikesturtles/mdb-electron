import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImagePreviewComponent } from '@components/image-preview/image-preview.component';
import { TMDB_FULL_MOVIE_DETAILS } from 'app/mock-data-movie-details';
import { MDBMovie } from 'app/models/mdb-movie.model';
import GeneralUtil from '../../utils/general.util'

@Component({
  selector: 'app-floating-player',
  templateUrl: './floating-player.component.html',
  styleUrls: ['./floating-player.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FloatingPlayerComponent implements OnInit {

  movieDetails: MDBMovie = null
  posterWidth = 300
  movieDetailsWriters
  movieDetailsDirectors
  movieDetailsProducers
  movieDetailsCast
  playLinks = [{ type: '', name: '', quality: '' }]
  hasContinueWatching
  movieTrailer = true
  constructor(public dialog: MatDialog) {

    this.movieDetails = new MDBMovie(TMDB_FULL_MOVIE_DETAILS)
  }
  ngOnInit() {
    this.movieDetailsDirectors = this.getDirectors()
    this.movieDetailsWriters = this.getWriters()
    this.movieDetailsProducers = this.getProducers()
    this.movieDetailsCast = this.getCast()
  }

  goToDiscover() { }
  getYear(val) {
    return GeneralUtil.getYear(val)
  }

  getDirectors() {
    const toReturn = []
    this.movieDetails.credits.crew.forEach(crew => {
      if (crew.job === 'Director') { toReturn.push(crew) }
    });
    return toReturn
  }

  getWriters() {
    const toReturn = []
    this.movieDetails.credits.crew.forEach(crew => {
      if (crew.job === 'Writer' || crew.job === 'Screenplay') { toReturn.push(crew) }
    });
    return toReturn
  }

  getProducers() {
    const toReturn = []
    this.movieDetails.credits.crew.forEach(crew => {
      if (crew.job.toLowerCase().includes('producer')) { toReturn.push(crew) }
    });
    return toReturn
  }

  getCast() {
    const toReturn = []
    this.movieDetails.credits.cast.forEach(crew => {
      toReturn.push(crew)
    });
    return toReturn
  }

  previewImage() {
    this.dialog.open(ImagePreviewComponent, { data: { imagePath: this.movieDetails.posterPath } });
  }

  isDisplayShowMore() { }
  playBestPlayLink() { }
  playMovie() { }
  continueWatching() { }
  playTrailer() { }
}
