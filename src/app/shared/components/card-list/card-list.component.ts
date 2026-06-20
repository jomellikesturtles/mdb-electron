import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PlayedService, IPlayed } from '@services/media/played.service';
import { IProfileData } from '@models/profile-data.model';
import { MDBMovie } from '@models/mdb-movie.model';
import ObjectUtil from '@utils/object.utils';
import { MediaUserDataService } from '@services/media/media-user-data.service';
import { FeatureToggleService } from '@core/services/feature-toggle.service';
import { IBookmark } from '@services/media';
import { IMediaUserData } from '@core/dev/services/mock-user-data.service';
import { AuthenticationService } from '@services';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit, OnChanges {

  @Input() cardWidth: string;
  @Input() displayMode: string = 'card-list-horizontal';
  @Input() listType: string;
  @Input() loading: boolean = false;
  _movieList: MDBMovie[];
  @Input()
  set movieList(inputMessage: any[]) {
    this.movieAndUserDataList = [];
    if (inputMessage) {
      inputMessage.forEach(inputMovie => {
        this.movieAndUserDataList.push({ movie: inputMovie, userData: null });
      });
    }
    this._movieList = inputMessage;
  }
  get movieList(): any[] {
    return this._movieList;
  }


  movieAndUserDataList: IMovieAndUserData[] = [];

  constructor(
    private mediaUserDataService: MediaUserDataService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.renderHighlight();
    this.getMoviesUserData();
  }

  ngOnChanges(changes: any): void {
    console.log('changes', changes);
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }

  /**
   * Gets the user data like: bookmark, watched, video.
   */
  getMoviesUserData() {
    if (!this.authenticationService.isAuthenticated()) return;
    const idList = this.collectIds();
    const listLength = idList.length;
    const arr2 = this.createDividedList(idList, listLength);

    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < arr2.length; index++) {
      const queryList = arr2[index];

      if (this.listType === 'none') { // all types of user data.
        this.mediaUserDataService.getMediaUserDataMultiple(queryList).subscribe((docsList: IProfileData[]) => {

          if (!ObjectUtil.isEmpty(docsList)) {
            this.movieAndUserDataList.forEach((movieAndUserData: IMovieAndUserData) => {
              const doc = docsList.find((doc: IMediaUserData) => movieAndUserData.movie.tmdbId.toString() === doc.mediaId);
              movieAndUserData.userData = doc;
            });
          }
        });
      } else {
        if (this.listType !== 'bookmark') {
          this.mediaUserDataService.getMediaDataPaginated(queryList).subscribe(docs => {
            const dataType = 'bookmark';
            this.curateUserData(dataType, docs);
          });
        }
        if (this.listType !== 'watched') {
          this.mediaUserDataService.getMediaDataPaginated(queryList).subscribe(docs => {
            const dataType = 'watched';
            this.curateUserData(dataType, docs);
          });
        }
        if (this.listType !== 'library') {
          this.mediaUserDataService.getMediaDataPaginated(queryList).then(docs => {
            const dataType = 'library';
            this.curateUserData(dataType, docs);
          });
        }
      }
    }
  }

  /**
   * Organizes user data and binds them into movie cards.
   */
  curateUserData(dataType: string, docs: IProfileData[] | any): void {
    const dataList = [];

    docs.forEach(doc => {
      const docData = doc;
      const dTmdbId = docData.tmdbId;
      const dTitle = docData.title;
      const dYear = docData.year;
      let myData;
      switch (dataType) {
        case 'bookmark':
          const bm: IBookmark = {
            id: doc.id ? doc.id : '',
            tmdbId: dTmdbId ? dTmdbId : 0,
            title: dTitle ? dTitle : '',
            year: dYear ? dYear : 0
          };
          myData = bm;
          break;
        case 'watched':
          const wtchd: IPlayed = {
            id: doc.id ? doc.id : '',
            tmdbId: dTmdbId ? dTmdbId : 0,
            title: dTitle ? dTitle : '',
            year: dYear ? parseInt(dYear, 10) : 0,
            percentage: docData.percentage ? docData.percentage : 100
          };
          myData = wtchd;
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
          };
          myData = vid;
          break;
        case 'none':
          break;
        default:
          break;
      }
      dataList.push(myData);
    });
    this.movieList.forEach(movie => {
      dataList.forEach(data => {
        if (data.tmdbId === movie.id) {
          movie[dataType] = data;
        }
      });
    });
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
    const idList = [];
    this.movieList.forEach(e => {
      idList.push(e.tmdbId);
      // idList.push(e.id);
    }); // lodash is not faster than this.
    return idList;
  }

  /**
   * Divides a list of Ids
   * @param idList
   * @param listLength
   * @returns list of split list `[[],[]]`
   */
  createDividedList(idList: number[], listLength: number) {
    const toReturn = [];
    let temparray;
    // const chunk = 10; // Firebase's max length in IN query.
    const chunk = 20;
    let a = 0;
    for (let i = 0; i < listLength; i += chunk) {
      temparray = idList.slice(i, i + chunk);
      toReturn[a] = temparray;
      a++;
    }
    return toReturn;
  }

}

interface IMovieAndUserData {
  movie: MDBMovie;
  userData?: IProfileData;
}
