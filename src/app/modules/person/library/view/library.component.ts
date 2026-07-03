import { UserDataService } from '@services/user-data/user-data.service';
import { environment } from '@environments/environment';
import { Component, OnInit, Input } from '@angular/core';
import { CollectionName } from '@shared/constants';
import { IpcService, IUserDataPaginated } from '@services/ipc.service';
import { LibraryService } from '@services/library.service';
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
    private libraryService: LibraryService,
  ) { }

  moviesDisplayList = [];
  hasSearchResults = false;
  cardWidth = '130px';
  isFetchingData = false;
  orderBy = 'tmdbId';
  lastVal = 1;
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
    this.isFetchingData = true;
    try {
      this.lastVal = 1;
      const res = await this.libraryService.getLibraryPaginated(this.lastVal);
      console.log('getMoviesFromLibrary res:', res);
      if (res && res.results) {
        this.moviesDisplayList = res.results.map((e: any) => ({
          ...e,
          id: e._id || e.id
        }));
        this.hasResults = this.moviesDisplayList.length > 0;
        this.hasMoreResults = res.page < res.totalPages;
        this.lastVal = res.page + 1;
      } else {
        this.moviesDisplayList = [];
        this.hasResults = false;
        this.hasMoreResults = false;
      }
    } catch (e) {
      console.error(e);
      this.moviesDisplayList = [];
      this.hasResults = false;
      this.hasMoreResults = false;
    } finally {
      this.isFetchingData = false;
    }
  }

  async getMoreResults() {
    if (this.isFetchingData) return;
    this.isFetchingData = true;
    try {
      const res = await this.libraryService.getLibraryPaginated(this.lastVal);
      console.log('getMoreResults res:', res);
      if (res && res.results && res.results.length > 0) {
        const mapped = res.results.map((e: any) => ({
          ...e,
          id: e._id || e.id
        }));
        this.moviesDisplayList.push(...mapped);
        this.hasMoreResults = res.page < res.totalPages;
        this.lastVal = res.page + 1;
      } else {
        this.hasMoreResults = false;
      }
    } catch (e) {
      console.error(e);
      this.hasMoreResults = false;
    } finally {
      this.isFetchingData = false;
    }
  }

  onScanLibrary() {
    this.ipcService.startScanLibrary();
  }
}
