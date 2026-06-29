/**
 * Gets available movies.
 */
import { UserDataService } from '@services/user-data/user-data.service';
import { environment } from '@environments/environment';
import { Component, OnInit, Input } from '@angular/core';
import { CollectionName } from '@shared/constants';
import { IpcService, IUserDataPaginated } from '@services/ipc.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {

  @Input() data: Observable<any>;

  constructor(
    private ipcService: IpcService,
  ) { }

  moviesDisplayList = [];
  hasSearchResults = false;
  cardWidth = '130px';
  isFetchingData = false;
  orderBy = 'tmdbId';
  lastVal = 0;
  hasResults = false;
  hasMoreResults = false;
  readonly LIST_TYPE = CollectionName.Library;

  ngOnInit() {
    console.log('ngOnInit');
    this.getMoviesFromLibrary();
  }

  /**
   * Gets movies from library db
   */
  async getMoviesFromLibrary() {

  }

  async getMoreResults() {
    // const res = await this.userDataService.getUserDataPagination(this.LIST_TYPE, this.lastVal);
    // console.log(res);
    // if (res.length) {
    //   this.moviesDisplayList.push.apply(this.moviesDisplayList, res);
    //   this.lastVal = res[res.length - 1][this.LIST_TYPE][this.orderBy];
    //   if (res.length < 20) {
    //     this.hasMoreResults = false;
    //   }
    // }
  }

  onScanLibrary() {
    this.ipcService.startScanLibrary();
  }
}
