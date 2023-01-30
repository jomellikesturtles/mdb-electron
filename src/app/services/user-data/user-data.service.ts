import { LibraryService } from '../library.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBookmark, BookmarkService } from '../media/bookmark.service';
import { MovieService } from '../movie/movie.service';
import { PlayedService, IWatched } from '../media/played.service';
import { IpcOperations, IpcService, IUserDataPaginated, SubChannel } from '../ipc.service';
import { CollectionName } from '../firebase.service';
import { BffService } from '../mdb-api.service';
import { DataService } from '@services/data.service';
import { MediaUserDataService } from '@services/media/media-user-data.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(
    private bookmarkService: BookmarkService,
    private bffService: BffService,
    private dataService: DataService,
    private movieService: MovieService,
    private watchedService: PlayedService,
    private libraryService: LibraryService,
    private mediaUserData: MediaUserDataService,
    private ipcService: IpcService,
  ) { }

  toggleBookmark(id) {

  }
  /**
   * Gets watched, bookmark, library
   *
   */
  getMovieUserData(tmdbId: number) {
    return this.dataService.getHandle(this.bffService.getMediaUserData(tmdbId), this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.FIND_ONE },
      null, tmdbId));
  }

  /**
   * Gets watched, bookmark, library in list
   * TODO: remove Promise.resolve(null) and add firebase implementation
   */
  getMovieUserDataInList(idList: any[]): Observable<any> {
    return this.dataService.getHandle(this.bffService.getMediaUserDataInList(idList), this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.FIND_IN_LIST },
      null, idList));
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

    let data: IUserDataPaginated | any = [];
    switch (dataType) {
      case 'bookmark':
        const bookmarksList = await this.mediaUserData.getMediaDataPaginated('');
        data = bookmarksList;
        break;
      case 'watched':
        const watchedList = await this.watchedService.getWatchedPaginatedFirstPage();
        data = watchedList;
        break;
      case 'library':
        const videoList = await this.libraryService.getLibraryPaginatedFirstPage();
        data = videoList;
        break;
      default:
        break;
    }
    return new Promise(async (resolve, reject) => {
      const moviesList = await this.getMovieListDetails(dataType, data);
      console.log('moviesList paginated:', moviesList);
      let data2: IUserDataPaginated = data;
      data2.results = moviesList;
      resolve(data2);
    });
  }

  async getUserDataPagination(dataType: CollectionName, lastValue: any): Promise<any> {
    console.log('get firstpage: ', dataType);
    let dataList = [];
    switch (dataType) {
      case 'bookmark':
        dataList = await this.bookmarkService.getBookmarksPaginated(lastValue);
        break;
      case 'watched':
        dataList = await this.watchedService.getWatchedPaginated(lastValue);
        break;
      case 'library':
        dataList = await this.libraryService.getLibraryPaginated(lastValue);
        break;
      default:
        break;
    }
    return new Promise(async (resolve, reject) => {
      const e = await this.getMovieListDetails(dataType, dataList);
      console.log('e:', e);
      // IUserDataPaginated {
      //   totalPages: number,
      //     totalResults: number,
      //       page: number,
      //         results: any[]
      // }

      resolve(e);
    });
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
      const moviesDisplayList = [];
      const isFirebase = data.results ? false : true;
      const dataDocList = isFirebase ? data : data.results;
      const len = dataDocList.length;
      let index = 0;
      dataDocList.forEach(dataDoc => {
        dataDoc = isFirebase ? dataDoc.data() : dataDoc; // firebaseData or offlineData
        index++;
        if (dataDoc.tmdbId > 0) {
          this.movieService.getMovieDetails(dataDoc.tmdbId, 'videos,images,credits,similar,external_ids,recommendations').pipe().subscribe(movie => {
            const userData = this.setDataObject(dataType, dataDoc);
            movie[dataType] = userData;
            moviesDisplayList.push(movie);
            if (len === index) {
              resolve(moviesDisplayList);
            }
          });
        }
      });
    });
  }

  /**
   * Sets the user data object to the
   * @param dataType the data types: bookmark, watched, video, etc.
   * @param dataDoc
   */
  private setDataObject(dataType: string, dataDoc) {
    let userData = null;
    const isFirebaseData = (typeof dataDoc.data === "function");
    const docData = (typeof dataDoc.data === "function") ? dataDoc.data() : dataDoc; // firebaseData or offlineData
    const docDataId = dataDoc.id ? dataDoc.id : dataDoc._id;
    switch (dataType) {
      case 'bookmark':
        const bm: IBookmark = {
          id: docDataId,
          title: docData.title,
          year: docData.year,
          tmdbId: docData.tmdbId,
        };
        userData = bm;
        break;
      case 'watched':
        const w: IWatched = {
          id: docDataId,
          title: docData.title,
          year: docData.year,
          tmdbId: docData.tmdbId,
        };
        w.percentage = isFirebaseData && docData.percentage ? dataDoc.data().percentage : 100;
        w.percentage = !isFirebaseData && docData.percentage ? docData.percentage : 100;
        userData = w;
        break;
      case 'library':
        const v = {
          id: docDataId,
          title: docData.title,
          year: docData.year,
          tmdbId: docData.tmdbId,
        };
        userData = v;
        break;
    }
    return userData;
  }
}

