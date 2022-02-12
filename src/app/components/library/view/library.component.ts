/**
 * Gets available movies.
 */
import { UserDataService } from '@services/user-data/user-data.service';
import { environment } from '@environments/environment';
import { Component, OnInit, Input } from '@angular/core';
import { TMDB_SEARCH_RESULTS } from '../../../mock-data'
import { STRING_REGEX_IMAGE_SIZE } from '@shared/constants';
import { IpcService, IUserDataPaginated } from '@services/ipc.service';
import { Observable } from 'rxjs'
import { CollectionName } from '@services/firebase.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {

  @Input() data: Observable<any>

  constructor(
    private ipcService: IpcService,
    private userDataService: UserDataService,
  ) { }

  moviesDisplayList = []
  hasSearchResults = false
  cardWidth = '130px'
  isFetchingData = false
  orderBy = 'tmdbId'
  lastVal = 0
  hasResults = false
  hasMoreResults = false
  readonly LIST_TYPE = CollectionName.Library

  ngOnInit() {
    console.log('ngOnInit');
    this.getMoviesFromLibrary()
  }

  /**
   * !UNUSED
   * Minimizes size of poster to download
   * @param poster old poster
   * @returns newPoster new Poster
   */
  minimizeMoviePoster(poster) {
    const REGEX_IMAGE_SIZE = new RegExp(STRING_REGEX_IMAGE_SIZE, `gi`)
    const newPoster = poster.replace(REGEX_IMAGE_SIZE, 'SX150.jpg')
    return newPoster
  }

  /**
   * Gets movies from library db
   */
  async getMoviesFromLibrary() {
    if (environment.runConfig.useTestData === true) {
      this.moviesDisplayList = TMDB_SEARCH_RESULTS.results
    } else {
      const libraryData:IUserDataPaginated = await this.userDataService.getUserDataFirstPage(this.LIST_TYPE)
      console.log(libraryData)
      const libraryMovies = libraryData.results
      if (libraryMovies.length) {
        this.moviesDisplayList = libraryMovies
        this.lastVal = libraryMovies[libraryMovies.length - 1][this.LIST_TYPE][this.orderBy]
        this.hasResults = true
        if (libraryMovies.length === 20) {
          this.hasMoreResults = true
        }
      }
    }
  }

  async getMoreResults() {
    if (environment.runConfig.useTestData) {
      this.moviesDisplayList = TMDB_SEARCH_RESULTS.results
    } else {
      const res = await this.userDataService.getUserDataPagination(this.LIST_TYPE, this.lastVal)
      console.log(res)
      if (res.length) {
        this.moviesDisplayList.push.apply(this.moviesDisplayList, res)
        this.lastVal = res[res.length - 1][this.LIST_TYPE][this.orderBy]
        if (res.length < 20) {
          this.hasMoreResults = false
        }
      }
    }
  }

  onScanLibrary() {
    this.ipcService.startScanLibrary()
  }
}
