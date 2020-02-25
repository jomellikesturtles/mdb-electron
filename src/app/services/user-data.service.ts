import { IVideo, VideoService } from './video.service';
import { Injectable } from '@angular/core';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { IBookmark, BookmarkService } from './bookmark.service';
import { MovieService } from './movie.service';
import { WatchedService, IWatched } from './watched.service';
import { map, mapTo, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(
    private bookmarkService: BookmarkService,
    private movieService: MovieService,
    private watchedService: WatchedService,
    private videoService: VideoService
  ) { }

  addUserData(dataType: string, data: object) {

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
