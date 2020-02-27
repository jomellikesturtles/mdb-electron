import { UserDataService } from './../../../services/user-data.service';
/**
 * Displays movies Watched by user
 */
import { IWatched } from './../../../services/watched.service';
import { WatchedService } from './../../../services/watched.service';
import { Component, OnInit } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { Subscription } from 'rxjs'
import { TMDB_SEARCH_RESULTS } from '../../../mock-data';
import { Select } from '@ngxs/store';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-watched',
  templateUrl: './watched.component.html',
  styleUrls: ['./watched.component.scss']
})
export class WatchedComponent implements OnInit {

  @Select(state => state.moviesList) moviesList$

  procSync = false
  listType = 'watched'
  moviesDisplayList = []
  watchedList
  hasResults = false
  hasMoreResults = false
  lastVal = 0 // last value in the
  cardWidth = '130px'
  orderBy = 'tmdbId'

  constructor(
    private watchedService: WatchedService,
    private movieService: MovieService,
    private userDataService: UserDataService,
  ) { }

  ngOnInit() {
    this.getWatchedMovies()
  }

  /**
   * Gets all watched movies by user.
   */
  async getWatchedMovies() {
    if (environment.runConfig.useTestData) {
      this.moviesDisplayList = TMDB_SEARCH_RESULTS.results
    } else {
      // commented for TEST

      const res = await this.userDataService.getUserDataFirstPage(this.listType)
      console.log(res)
      if (res.length) {
        this.moviesDisplayList = res
        this.lastVal = res[res.length - 1][this.listType][this.orderBy]
        this.hasResults = true
        if (res.length === 20) {
          this.hasMoreResults = true
        }
      }

    }
  }

  async getMoreResults() {
    if (environment.runConfig.useTestData) {
      this.moviesDisplayList = TMDB_SEARCH_RESULTS.results
    } else {
      // commented for TEST
      const res = await this.userDataService.getUserDataPagination(this.listType, this.lastVal)
      console.log(res)
      if (res.length) {
        this.moviesDisplayList.push.apply(this.moviesDisplayList, res)
        this.lastVal = res[res.length - 1][this.listType][this.orderBy]
        if (res.length < 20) {
          this.hasMoreResults = false
        }
      }
    }
  }
}