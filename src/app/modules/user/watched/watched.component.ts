import { UserDataService } from '@services/user-data/user-data.service';
/**
 * Displays movies Watched by user
 */
import { PlayedService } from '@services/media/played.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { CollectionName } from '@services/firebase.service';

@Component({
  selector: 'app-watched',
  templateUrl: './watched.component.html',
  styleUrls: ['./watched.component.scss']
})
export class WatchedComponent implements OnInit {


  procSync = false;
  readonly listType = CollectionName.Watched;
  moviesDisplayList = [];
  watchedList;
  hasResults = false;
  hasMoreResults = false;
  lastVal = 0; // last value in the
  cardWidth = '130px';
  orderBy = 'tmdbId';

  constructor(
    private playedService: PlayedService,
    private userDataService: UserDataService,
  ) { }

  ngOnInit() {
    this.getWatchedMovies();
  }

  /**
   * Gets all watched movies by user.
   */
  async getWatchedMovies() {
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
    const res = await this.userDataService.getUserDataPagination(this.listType, this.lastVal);
    if (res.length) {
      this.moviesDisplayList.push.apply(this.moviesDisplayList, res);
      this.lastVal = res[res.length - 1][this.listType][this.orderBy];
      if (res.length < 20) {
        this.hasMoreResults = false;
      }
    }
  }

  async nextPage() {

  }
}
