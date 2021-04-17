import { LibraryService } from './library.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBookmark, BookmarkService } from './bookmark.service';
import { MovieService } from './movie.service';
import { WatchedService, IWatched } from './watched.service';
import { IpcService, IUserDataPaginated } from './ipc.service';
import { environment } from 'environments/environment';
import { CollectionName, FirebaseService } from './firebase.service';
import { MdbApiService } from './mdb-api.service';
import GeneralUtil from '@utils/general.util';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(
    private bookmarkService: BookmarkService,
    private firebaseService: FirebaseService,
    private movieService: MovieService,
    private watchedService: WatchedService,
    private libraryService: LibraryService,
    private ipcService: IpcService,
    private mdbApiService: MdbApiService
  ) { }

  /**
   * Adds or remove bookmark to the movie.
   * @param movie
   */
  async toggleBookmark(movie) {
    let bmDoc
    if (!movie.bookmark || !movie.bookmark.id) {
      bmDoc = await this.saveUserData('bookmark', movie)
      movie.bookmark = bmDoc
    } else {
      if (movie.bookmark && movie.bookmark.id)
        bmDoc = await this.bookmarkService.removeBookmark('id', movie.bookmark.id)
      else
        bmDoc = await this.bookmarkService.removeBookmark('tmdbId', movie.tmdbId)
      movie.bookmark.id = ''
    }
    return bmDoc
  }


  /**
   * @param dataType `bookmark`/`watched`
   * @param movie
   */
  async saveUserData(dataType: string, movie: any): Promise<any> {
    const rDate = movie.release_date ? movie.release_date : movie.releaseDate
    const releaseYear = parseInt(GeneralUtil.getYear(rDate), 10)
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
      // case 'watched': // use watchedService
      //   userData['percentage'] = userData['percentage'] ? userData['percentage'] : '100%'
      //   docId = await this.watchedService.saveWatched(userData)
      //   break;
      case 'library':
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

  /**
   * Gets watched, bookmark, library
   *
   */
  getMovieUserData(tmdbId: number) {
    const myFunction = environment.runConfig.springMode ?
      this.mdbApiService.getProfileDataByTmdbId(tmdbId).toPromise() :
      this.ipcService.getMovieUserData(tmdbId)
    // const myFunction = environment.runConfig.firebaseMode ?
    //   this.firebaseService.getMovieUserData(tmdbId) :
    //   this.ipcService.getMovieUserData(tmdbId)

    return myFunction
  }

  /**
   * Gets watched, bookmark, library in list
   * TODO: remove Promise.resolve(null) and add firebase implementation
   */
  getMovieUserDataInList(idList: any[]): Promise<any> {

    // const myFunction = environment.runConfig.firebaseMode ?
    //   this.firebaseService.getUserDataMultiple(idList) :
    const myFunction = environment.runConfig.springMode ?
      this.mdbApiService.getProfileDataByTmdbIdList(idList).toPromise() :
      this.ipcService.getMovieUserDataInList(idList)

      return myFunction
  }

  getUserDataMultiple(dataType: 'library' | 'bookmark' | 'watched', data: object) {
    switch (dataType) {
      case 'library':
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

    let data: IUserDataPaginated | any = []
    switch (dataType) {
      case 'bookmark':
        const bookmarksList = await this.bookmarkService.getBookmarksPaginatedFirstPage()
        data = bookmarksList
        break;
      case 'watched':
        const watchedList = await this.watchedService.getWatchedPaginatedFirstPage()
        data = watchedList
        break;
      case 'library':
        const videoList = await this.libraryService.getLibraryPaginatedFirstPage()
        data = videoList
        break;
      default:
        break;
    }
    return new Promise(async (resolve, reject) => {
      const moviesList = await this.getMovieListDetails(dataType, data)
      console.log('moviesList paginated:', moviesList)
      let data2: IUserDataPaginated = data
      data2.results = moviesList
      resolve(data2)
    })
  }

  async getUserDataPagination(dataType: CollectionName, lastValue: any): Promise<any> {
    console.log('get firstpage: ', dataType);
    let dataList = []
    switch (dataType) {
      case 'bookmark':
        dataList = await this.bookmarkService.getBookmarksPaginated(lastValue)
        break;
      case 'watched':
        dataList = await this.watchedService.getWatchedPaginated(lastValue)
        break;
      case 'library':
        dataList = await this.libraryService.getLibraryPaginated(lastValue)
        break;
      default:
        break;
    }
    return new Promise(async (resolve, reject) => {
      const e = await this.getMovieListDetails(dataType, dataList)
      console.log('e:', e)
      // IUserDataPaginated {
      //   totalPages: number,
      //     totalResults: number,
      //       page: number,
      //         results: any[]
      // }

      resolve(e)
    })
  }

  /**
   * TODO: include libraryFile/libaryObj to the list even if not identified.
   */
  private getMovieListDetails(dataType: string, data: IUserDataPaginated | any): Observable<any> | any {
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
      const isFirebase = data.results ? false : true
      const dataDocList = isFirebase ? data : data.results
      const len = dataDocList.length
      let index = 0
      dataDocList.forEach(dataDoc => {
        dataDoc = isFirebase ? dataDoc.data() : dataDoc // firebaseData or offlineData
        index++
        if (dataDoc.tmdbId > 0) {
          this.movieService.getTmdbMovieDetails(dataDoc.tmdbId, 'videos,images,credits,similar,external_ids,recommendations').pipe().subscribe(movie => {
            const userData = this.setDataObject(dataType, dataDoc)
            movie[dataType] = userData
            moviesDisplayList.push(movie)
            if (len === index) {
              resolve(moviesDisplayList)
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
    const isFirebaseData = (typeof dataDoc.data === "function")
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
        }
        w.percentage = isFirebaseData && docData.percentage ? dataDoc.data().percentage : 100
        w.percentage = !isFirebaseData && docData.percentage ? docData.percentage : 100
        userData = w
        break;
      case 'library':
        const v = {
          id: docDataId,
          title: docData.title,
          year: docData.year,
          tmdbId: docData.tmdbId,
        }
        userData = v
        break;
    }
    return userData
  }
}

