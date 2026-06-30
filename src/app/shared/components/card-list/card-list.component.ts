import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { IProfileData, MDBMovie } from '@models';
import ObjectUtil from '@utils/object.utils';
import { MediaUserDataService } from '@services/media/media-user-data.service';
import { IMediaUserData } from '@core/dev/services/mock-user-data.service';
import { AuthenticationService, LibraryService } from '@services';
import { MovieService } from '@services/movie/movie.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit, OnChanges {

  @Input() cardWidth: string;
  @Input() disableHover = false;
  @Input() displayMode: string = 'card-list-horizontal';
  @Input() listType: string;
  @Input() loading: boolean = false;
  _movieList: MDBMovie[];
  @Input()
  set movieList(inputMessage: any[]) {
    this.movieAndUserDataList = [];
    if (inputMessage) {
      inputMessage.forEach(inputMovie => {
        inputMovie = new MDBMovie(inputMovie);
        this.movieAndUserDataList.push({ movie: inputMovie, userData: null });
      });
    }
    this._movieList = inputMessage;
    this.checkAvailability();
  }
  get movieList(): any[] {
    return this._movieList;
  }

  movieAndUserDataList: IMovieAndUserData[] = [];

  constructor(
    private mediaUserDataService: MediaUserDataService,
    private authenticationService: AuthenticationService,
    private libraryService: LibraryService,
    private movieService: MovieService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getMoviesUserData();
    this.checkAvailability();
  }

  checkAvailability() {
    const ids = this.collectIds().map(id => parseInt(id));
    if (ids.length === 0) return;

    Promise.all([
      this.libraryService.getMoviesFromLibraryInList(ids),
      firstValueFrom(this.movieService.getStreamsByIdList(ids.map(id => id.toString())))
    ]).then(([localMovies, streamMovies]) => {
      const localIds = new Set(localMovies.map((m: any) => m.tmdbId));
      const streamIds = new Set(streamMovies.map((m: any) => m.tmdbId));

      this.movieAndUserDataList.forEach(item => {
        const id = parseInt(item.movie.tmdbId);
        if (localIds.has(id) || streamIds.has(id)) {
          const updatedMovie = new MDBMovie(item.movie);
          updatedMovie.isAvailable = true;
          item.movie = updatedMovie;
        }
      });
      this.cdr.detectChanges();
    }).catch(err => {
      console.error('Error resolving availability:', err);
    });
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
      }
    }
  }

  collectIds() {
    const idList = [];
    this.movieList.forEach(e => {
      idList.push(e.tmdbId ?? e.id);
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
