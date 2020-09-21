import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Select } from '@ngxs/store';
import { BookmarkService, IBookmark } from '../../../services/bookmark.service';
import { WatchedService, IWatched } from '../../../services/watched.service';
import { VideoService, IVideo } from '../../../services/video.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {
  @Select(state => state.moviesList) moviesList$

  @Input() movieList: any[]
  @Input() cardWidth: string
  @Input() displayMode: string
  @Input() listType: string

  constructor(
    private bookmarkService: BookmarkService,
    private watchedService: WatchedService,
    private videoService: VideoService,
  ) { }

  ngOnInit() {
    this.getData()
    this.getMoviesUserData()
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
      if (this.listType !== 'bookmark') {
        this.bookmarkService.getBookmarksMultiple(queryList).then(docs => {
          const dataType = 'bookmark'
          this.curateUserData(dataType, docs)
        })
      }
      if (this.listType !== 'watched') {
        this.watchedService.getWatchedMultiple(queryList).then(docs => {
          const dataType = 'watched'
          this.curateUserData(dataType, docs)
        })
      }
      if (this.listType !== 'video') {
        this.videoService.getVideosMultiple(queryList).then(docs => {
          const dataType = 'video'
          this.curateUserData(dataType, docs)
        })
      }
    }
  }

  /**
   * Organizes user data and binds them into movie cards.
   */
  curateUserData(dataType: string, docs: any): void {
    const dataList = []

    docs.forEach(doc => {
      // console.log(doc)
      const docData = doc
      // const docData = doc.data() ? doc.data() : {}
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
            percentage: docData.percentage ? docData.percentage : '100%'
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
            tmdbId: doc.tmdbId,
            videoUrl: doc.fullFilePath
          }
          myData = vid
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

  getData() {
    this.moviesList$.subscribe(moviesResult => {
      console.log('moviesresult: ', moviesResult)

      if (moviesResult.change === 'add') {
        this.movieList.forEach(element => {
          if (moviesResult.idChanged === element.id) {
            element.isHighlighted = true
          }
        })
      } else if (moviesResult.change === 'remove') {
        this.movieList.forEach(element => {
          if (moviesResult.idChanged === element.id) {
            element.isHighlighted = false
          }
        })
      } else if (moviesResult.change === 'clear') {
        this.movieList.forEach(element => {
          element.isHighlighted = false
        })
      } else if (moviesResult.change === 'watched') {
        this.movieList.forEach(element => {
          moviesResult.idChanged.forEach(mrId => {
            if (mrId === element.id) {
              // element.isWatched = true
              // element.watchedProgress = "100%"
              // this.cdr.detectChanges()
            }
          });
        })
      }
    });
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
    const chunk = environment.runConfig.firebaseMode ? 10 : 20
    // const chunk = 10; // Firebase's max length in IN query.
    let a = 0
    for (let i = 0; i < listLength; i += chunk) {
      temparray = idList.slice(i, i + chunk);
      toReturn[a] = temparray
      a++
    }
    return toReturn
  }

}
