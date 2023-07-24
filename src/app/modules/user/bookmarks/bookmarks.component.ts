/**
 * Bookmarked by user
 */
import { UserDataService } from '@services/user-data/user-data.service';
import { Component, OnInit } from '@angular/core';
import { CollectionName } from '@services/firebase.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

  procSync = false;

  bookmarksList;
  moviesDisplayList = [];
  hasResults = false;
  cardWidth = '130px';
  bookmarksSubscription;
  lastVal = 0;
  hasMoreResults = false;
  orderBy = 'tmdbId';
  listType = CollectionName.Bookmark;

  constructor(
    private userDataService: UserDataService,
  ) { }

  ngOnInit() {
    this.getBookmarkedMovies();
  }

  onSync() {
  }

  /**
   * Gets all bookmarked movies by user.
   */
  async getBookmarkedMovies() {
    // commented for TEST
    const res = await this.userDataService.getUserDataFirstPage(this.listType);
    if (res.length) {
      this.moviesDisplayList = res;
      this.lastVal = res[res.length - 1][this.listType][this.orderBy];
      this.hasResults = true;
      if (res.length === 20) {
        this.hasMoreResults = true;
      }
    }
  }

  async getMoreResults() {
    // commented for TEST
    const res = await this.userDataService.getUserDataPagination(this.listType, this.lastVal);
    if (res.length) {
      this.moviesDisplayList.push.apply(this.moviesDisplayList, res);
      this.lastVal = res[res.length - 1][this.listType][this.orderBy];
      if (res.length < 20) {
        this.hasMoreResults = false;
      }
    }
  }

}
