/**
 * Bookmarked by user
 */
import { UserDataService } from './../../../services/user-data.service';
import { IBookmark } from './../../../services/bookmark.service';
import { environment } from './../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { TMDB_SEARCH_RESULTS } from '../../../mock-data';
import { Select } from '@ngxs/store';
import { CollectionName } from '@services/firebase.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

  @Select(state => state.moviesList) moviesList$
  procSync = false

  bookmarksList
  moviesDisplayList = []
  hasResults = false
  cardWidth = '130px'
  bookmarksSubscription
  lastVal = 0
  hasMoreResults = false
  orderBy = 'tmdbId'
  listType = CollectionName.Bookmark

  constructor(
    private userDataService: UserDataService,
  ) { }

  ngOnInit() {
    this.getBookmarkedMovies()
  }

  onSync() {
    // this.firebaseService.synchronizeBookmarks()
    // this.bookmarksList.forEach(element => {
    //   this.movieService.getFindMovie(element.imdbId)
    // });
  }

  /**
   * Gets all bookmarked movies by user.
   */
  async getBookmarkedMovies() {
    if (environment.runConfig.useTestData) {
      this.moviesDisplayList = TMDB_SEARCH_RESULTS.results
    } else {
      // commented for TEST
      const res = await this.userDataService.getUserDataFirstPage(this.listType)
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
