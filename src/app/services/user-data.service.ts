import { IVideo, VideoService } from './video.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBookmark, BookmarkService } from './bookmark.service';
import { MovieService } from './movie.service';
import { WatchedService, IWatched } from './watched.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(
    private bookmarkService: BookmarkService,
    private movieService: MovieService,
    private watchedService: WatchedService,
    private videoService: VideoService,
    private utilsService: UtilsService
  ) { }

  async saveUserData(dataType: string, movie: any): Promise<any> {
    const releaseYear = parseInt(this.utilsService.getYear(movie.release_date), 10)
    const tmdbId = movie.id
    const title = movie.title
    const year = releaseYear ? releaseYear : 0
    const userData = {
      tmdbId,
      title,
      year
    }
    let docId = ''
    console.log('object to toggle :', userData);
    switch (dataType) {
      case 'bookmark':
        docId = await this.bookmarkService.saveBookmark(userData)
        break;
      case 'watched':
        userData['percentage'] = userData['percentage'] ? userData['percentage'] : '100%'
        docId = await this.watchedService.saveWatched(userData)
        break;
      case 'video':
        // ! video may only be saved from the backend.(for now)
        break;
      default:
        break;
    }
    return new Promise((resolve, reject) => {
      userData['id'] = docId
      resolve(userData)
    })
  }

  removeUserData(dataType: string, id: string) {

  }

  getUserData() {

  }

  getUserDataMultiple(dataType: 'video' | 'bookmark' | 'watched', data: object) {
    switch (dataType) {
      case 'video':
        break;
      case 'bookmark':
        break;
      case 'watched':
        break;

      default:
        break;
    }
  }

  async getUserDataFirstPage(dataType: string): Promise<any> {
    console.log('get firstpage: ', dataType);

    let dataList = []
    switch (dataType) {
      case 'bookmark':
        const bookmarksList = await this.bookmarkService.getBookmarksPaginatedFirstPage()
        dataList = bookmarksList
        break;
      case 'watched':
        const watchedList = await this.watchedService.getWatchedPaginatedFirstPage()
        dataList = watchedList
        break;
      case 'video':
        const videoList = await this.videoService.getVideoPaginatedFirstPage()
        dataList = videoList
        break;
      default:
        break;
    }
    return new Promise(async (resolve, reject) => {
      const e = await this.getMovieListDetails(dataType, dataList)
      console.log('e:', e)
      resolve(e)
    })
  }

  async getUserDataPagination(dataType: string, lastValue: any): Promise<any> {
    console.log('get firstpage: ', dataType);
    let dataList = []
    switch (dataType) {
      case 'bookmark':
        dataList = await this.bookmarkService.getBookmarksPaginated(lastValue)
        break;
      case 'watched':
        dataList = await this.watchedService.getWatchedPaginated(lastValue)
        break;
      case 'video':
        dataList = await this.videoService.getVideoPaginated(lastValue)
        break;
      default:
        break;
    }
    return new Promise(async (resolve, reject) => {
      const e = await this.getMovieListDetails(dataType, dataList)
      console.log('e:', e)
      resolve(e)
    })
  }

  getMovieListDetails(dataType: string, dataDocList: any[]): Observable<any> | any {
    // ----------------------------
    // const fj = forkJoin(obsList)
    // fj.pipe().subscribe(
    //   val => {
    //     console.log('FJ:', val)
    //     // map(e => { e.bookmark })
    //     // dataList.forEach(data => {
    //     map(e => { })
    //     // });
    //   },
    // )
    // ----------------------------
    return new Promise(resolve => {
      const moviesDisplayList = []
      const len = dataDocList.length
      let index = 0
      dataDocList.forEach(dataDoc => {
        this.movieService.getTmdbMovieDetails(dataDoc.data().tmdbId, [], '').pipe().subscribe(movie => {
          const userData = this.setDataObject(dataType, dataDoc)
          movie[dataType] = userData
          moviesDisplayList.push(movie)
          index++
          if (len === index) {
            resolve(moviesDisplayList)
            // return moviesDisplayList
          }
        })
      })
    })
  }

  setDataObject(dataType: string, dataDoc) {
    let userData = null
    const docData = dataDoc.data()
    switch (dataType) {
      case 'bookmark':
        const bm: IBookmark = {
          id: dataDoc.id,
          title: docData.title,
          year: docData.year,
          tmdbId: docData.tmdbId,
        }
        userData = bm
        break;
      case 'watched':
        const w: IWatched = {
          id: dataDoc.id,
          title: docData.title,
          year: docData.year,
          tmdbId: docData.tmdbId,
          percentage: docData.percentage ? dataDoc.data().percentage : '100%',
        }
        userData = w
        break;
      case 'video':
        const v: IVideo = {
          id: dataDoc.id,
          title: docData.title,
          year: docData.year,
          tmdbId: docData.tmdbId,
          videoUrl: docData.videoUrl
        }
        userData = v
        break;
    }
    return userData
  }
}
