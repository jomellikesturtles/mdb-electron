import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { BookmarkService, IBookmark } from '@services/bookmark.service';
import { WatchedService, IWatched } from '@services/watched.service';
import { LibraryService } from '@services/library.service';
import { environment } from '@environments/environment';
import { UserDataService } from '@services/user-data/user-data.service';
import { IProfileData } from '@models/profile-data.model';
import { MDBMovie } from '@models/mdb-movie.model';
import ObjectUtil from '@utils/object.utils';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit, OnChanges {

  @Input() cardWidth: string
  @Input() displayMode: string = 'd-inline-flex'
  @Input() listType: string
  _movieList: MDBMovie[]
  @Input()
  set movieList(inputMessage: any[]) {
    inputMessage.forEach(inputMovie => {
      this.movieAndUserDataList.push({ movie: inputMovie, userData: null })
    })
    this._movieList = inputMessage
  }
  get movieList(): any[] {
    return this._movieList;
  }


  movieAndUserDataList: IMovieAndUserData[] = []

  constructor(
    private bookmarkService: BookmarkService,
    private watchedService: WatchedService,
    private libraryService: LibraryService,
    private userDataService: UserDataService
  ) { }

  ngOnInit() {
    this.renderHighlight()
    this.getMoviesUserData()
  }

  ngOnChanges(changes: any): void {
    console.log('changes',changes)
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }
  /**
   * Gets the user data like: bookmark, watched, video.
   */
  getMoviesUserData() {
    const idList = this.collectIds()
    const listLength = idList.length
    const arr2 = this.createDividedList(idList, listLength)

    // const arr2 = thisidList, listLength)
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < arr2.length; index++) {
      const queryList = arr2[index];

      if (this.listType === 'none') { // all types of user data.
        this.userDataService.getMovieUserDataInList(queryList).then((docsList: IProfileData[]) => {
          // if (docs.isFirebaseData && docs.isFirebaseData === true) {
          //   const localDocs: Array<QueryDocumentSnapshot<any>>[] = docs.data
          //   if (localDocs[0].length > 0) {
          //     localDocs[0].forEach(element => {
          //       const movie = this.movieList.find(e => e.id === element.data().tmdbId)
          //       movie['bookmark'] = element.data()
          //       movie['bookmark'].id = element.id
          //     })
          //   }
          //   if (localDocs[1].length > 0) {
          //     localDocs[1].forEach(element => {
          //       const movie = this.movieList.find(e => e.id === element.data().tmdbId)
          //       movie['watched'] = element.data()
          //       movie['watched'].id = element.id
          //     })
          //   }
          // }

          if (!ObjectUtil.isEmpty(docsList)) {
            if (environment.runConfig.springMode) {
              this.movieAndUserDataList.forEach((movieAndUserData: IMovieAndUserData) => {
                const doc = docsList.find((doc: IProfileData) => movieAndUserData.movie.tmdbId === doc.tmdbId)
                movieAndUserData.userData = doc
              })
            } else {
              docsList.forEach(data => {

                // validate if works with IPC
                this.movieAndUserDataList.forEach((movieAndUserData: IMovieAndUserData) => {
                  const doc = docsList.find((doc: IProfileData) => movieAndUserData.movie.tmdbId === doc.tmdbId)
                  movieAndUserData.userData = doc
                })
              });
            }
          }
        })
      } else {
        if (this.listType !== 'bookmark') {
          this.bookmarkService.getBookmarksInList(queryList).then(docs => {
            const dataType = 'bookmark'
            this.curateUserData(dataType, docs)
          })
        }
        if (this.listType !== 'watched') {
          this.watchedService.getWatchedInList(queryList).then(docs => {
            const dataType = 'watched'
            this.curateUserData(dataType, docs)
          })
        }
        if (this.listType !== 'library') {
          this.libraryService.getMoviesFromLibraryInList(queryList).then(docs => {
            const dataType = 'library'
            this.curateUserData(dataType, docs)
          })
        }
      }
    }
  }

  /**
   * Organizes user data and binds them into movie cards.
   */
  curateUserData(dataType: string, docs: firebase.firestore.QuerySnapshot | IProfileData[]): void {
    const dataList = []

    docs.forEach(doc => {
      const docData = environment.runConfig.firebaseMode ? doc.data() : doc
      const dTmdbId = docData.tmdbId
      const dTitle = docData.title
      const dYear = docData.year
      let myData
      switch (dataType) {
        case 'bookmark':
          const bm: IBookmark = {
            id: doc.id ? doc.id : '',
            tmdbId: dTmdbId ? dTmdbId : 0,
            title: dTitle ? dTitle : '',
            year: dYear ? dYear : 0
          }
          myData = bm
          break;
        case 'watched':
          const wtchd: IWatched = {
            id: doc.id ? doc.id : '',
            tmdbId: dTmdbId ? dTmdbId : 0,
            title: dTitle ? dTitle : '',
            year: dYear ? parseInt(dYear, 10) : 0,
            percentage: docData.percentage ? docData.percentage : 100
          }
          myData = wtchd
          break;
        case 'video':
          // const vid: IVideo = {
          //   id: doc.id ? doc.id : '',
          //   tmdbId: dTmdbId ? dTmdbId : 0,
          //   title: dTitle ? dTitle : '',
          //   year: dYear ? dYear : 0,
          //   videoUrl: docData.videoUrl ? docData.videoUrl : ''
          // }
          const vid = {
            id: doc.id,
            tmdbId: docData.tmdbId,
            videoUrl: docData.fullFilePath
          }
          myData = vid
          break;
        case 'none':
          break;
        default:
          break;
      }
      dataList.push(myData)
    })
    this.movieList.forEach(movie => {
      dataList.forEach(data => {
        if (data.tmdbId === movie.id) {
          movie[dataType] = data
        }
      });
    })
  }

  renderHighlight() {
    // this.moviesList$.subscribe(moviesResult => {
    //   console.log('moviesresult: ', moviesResult)

    //   if (moviesResult.change === 'add') {
    //     this.movieList.forEach(element => {
    //       if (moviesResult.idChanged === element.id) {
    //         element.isHighlighted = true
    //       }
    //     })
    //   } else if (moviesResult.change === 'remove') {
    //     this.movieList.forEach(element => {
    //       if (moviesResult.idChanged === element.id) {
    //         element.isHighlighted = false
    //       }
    //     })
    //   } else if (moviesResult.change === 'clear') {
    //     this.movieList.forEach(element => {
    //       element.isHighlighted = false
    //     })
    //   } else if (moviesResult.change === 'watched') {
    //     this.movieList.forEach(element => {
    //       moviesResult.idChanged.forEach(mrId => {
    //         if (mrId === element.id) {
    //           // element.isWatched = true
    //           // element.watchedProgress = "100%"
    //           // this.cdr.detectChanges()
    //         }
    //       });
    //     })
    //   }
    // });
  }

  collectIds() {
    const idList = []
    this.movieList.forEach(e => {
      idList.push(e.id)
    }); // lodash is not faster than this.
    return idList
  }

  /**
   * Divides a list of Ids
   * @param idList
   * @param listLength
   * @returns list of split list `[[],[]]`
   */
  createDividedList(idList: number[], listLength: number) {
    const toReturn = []
    let temparray
    // const chunk = 10; // Firebase's max length in IN query.
    const chunk = environment.runConfig.firebaseMode ? 10 : 20
    let a = 0
    for (let i = 0; i < listLength; i += chunk) {
      temparray = idList.slice(i, i + chunk);
      toReturn[a] = temparray
      a++
    }
    return toReturn
  }

}

interface IMovieAndUserData {
  movie: MDBMovie;
  userData?: IProfileData
}
