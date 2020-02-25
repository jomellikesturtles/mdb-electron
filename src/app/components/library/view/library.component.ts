/**
 * Gets available movies.
 */
import { UserDataService } from './../../../services/user-data.service';
import { environment } from './../../../../environments/environment';
import { Component, OnInit, Input } from '@angular/core';
import { TMDB_SEARCH_RESULTS } from '../../../mock-data'
import { STRING_REGEX_IMAGE_SIZE } from '../../../constants';
import { IpcService, IpcCommand } from '../../../services/ipc.service';
import { Observable } from 'rxjs'
import { Select } from '@ngxs/store'

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryComponent implements OnInit {

  @Input() data: Observable<any>
  @Select(state => state.moviesList) moviesList$

  constructor(
    private ipcService: IpcService,
    private userDataService: UserDataService,
  ) { }

  moviesDisplayList = []
  hasSearchResults = false
  cardWidth = '130px'
  isFetchingData = false
  orderBy = 'tmdbId'
  listType = 'video'
  lastVal = 0
  hasResults = false
  hasMoreResults = false

  ngOnInit() {
    console.log('ngOnInit');
    this.getMoviesFromLibrary()
  }

  /**
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

  onScanLibrary() {
    this.ipcService.call(IpcCommand.ScanLibrary)
  }
}
