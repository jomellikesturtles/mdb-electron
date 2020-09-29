import { IVideo, LibraryService } from './library.service';
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
    private libraryService: LibraryService,
    private utilsService: UtilsService
  ) { }

  async toggleBookmark(movie) {
    let bmDoc
    if (!movie.bookmark || !movie.bookmark.id) {
      bmDoc = await this.saveUserData('bookmark', movie)
      movie.bookmark = bmDoc
    } else {
      bmDoc = await this.bookmarkService.removeBookmark(movie.bookmark.id)
      movie.bookmark.id = ''
    }
    return bmDoc
  }

  async toggleWatched(movie) {
    let wDocId
    if (!movie.watched || !movie.watched.id) {
      wDocId = await this.saveUserData('watched', movie)
      movie.watched = wDocId
    } else {
      wDocId = await this.watchedService.removeWatched(movie.watched.id)
      movie.watched.id = ''
    }
    console.log('WATCHEDADD/remove:', wDocId)
    // const root = this
    // setTimeout(() => {
    //   root.isWatched = !root.isWatched
    //   root.procWatched = false
    //   root.watchedProgress = '100%'
    //   root.movie.isWatched = true
    // }, 2000);
  }

  async saveUserData(dataType: string, movie: any): Promise<any> {
    const rDate = movie.release_date ? movie.release_date : movie.releaseDate
    const releaseYear = parseInt(this.utilsService.getYear(rDate), 10)
    const tmdbId = movie.id ? movie.id : movie.tmdbId
    const title = movie.title
    const year = releaseYear ? releaseYear : 0
    const uid = localStorage.getItem('uid')
    const userData = {
      tmdbId,
      title,
      year,
      user: uid
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
        const videoList = await this.libraryService.getVideoPaginatedFirstPage()
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
        dataList = await this.libraryService.getVideoPaginated(lastValue)
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

  /**
   * TODO: include libraryFile/libaryObj to the list even if not identified.
   */
  private getMovieListDetails(dataType: string, dataDocList: any[]): Observable<any> | any {
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
        dataDoc = (typeof dataDoc.data === "function") ? dataDoc.data() : dataDoc // firebaseData or offlineData
        index++
        if (dataDoc.tmdbId > 0) {
          this.movieService.getTmdbMovieDetails(dataDoc.tmdbId, [], '').pipe().subscribe(movie => {
            const userData = this.setDataObject(dataType, dataDoc)
            movie[dataType] = userData
            moviesDisplayList.push(movie)
            if (len === index) {
              resolve(moviesDisplayList)
              // return moviesDisplayList
            }
          })
        }
      })
    })
  }

  /**
   * Sets the user data object to the
   * @param dataType the data types: bookmark, watched, video, etc.
   * @param dataDoc
   */
  private setDataObject(dataType: string, dataDoc) {
    let userData = null
    // const docData = dataDoc.data()
    const docData = (typeof dataDoc.data === "function") ? dataDoc.data() : dataDoc // firebaseData or offlineData
    const docDataId = dataDoc.id ? dataDoc.id : dataDoc._id;
    switch (dataType) {
      case 'bookmark':
        const bm: IBookmark = {
          id: docDataId,
          title: docData.title,
          year: docData.year,
          tmdbId: docData.tmdbId,
        }
        userData = bm
        break;
      case 'watched':
        const w: IWatched = {
          id: docDataId,
          title: docData.title,
          year: docData.year,
          tmdbId: docData.tmdbId,
          percentage: docData.percentage ? dataDoc.data().percentage : '100%',
        }
        userData = w
        break;
      case 'video':
        const v = {
          id: docDataId,
          title: docData.title,
          year: docData.year,
          tmdbId: docData.tmdbId,
          // videoUrl: docData.videoUrl
        }
        // const v: IVideo = {
        //   id: docDataId,
        //   title: docData.title,
        //   year: docData.year,
        //   tmdbId: docData.tmdbId,
        //   videoUrl: docData.videoUrl
        // }
        userData = v
        break;
    }
    return userData
  }
}
