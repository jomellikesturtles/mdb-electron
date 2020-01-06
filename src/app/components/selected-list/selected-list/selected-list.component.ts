import { Component, OnInit, OnDestroy } from '@angular/core';
import { ITmdbResult, TmdbParameters, TmdbSearchMovieParameters } from '../../../interfaces';
import { Router, ActivatedRoute } from '@angular/router'
import { DataService } from '../../../services/data.service'
import { FirebaseService } from '../../../services/firebase.service';
import { IpcService, IpcCommand } from '../../../services/ipc.service'
import { MovieService } from '../../../services/movie.service'
import { NavigationService } from '../../../services/navigation.service'
import { UtilsService } from '../../../services/utils.service'
import { ISearchQuery } from '../../top-navigation/top-navigation.component';
import { Select, Store } from '@ngxs/store';
import { ClearList } from '../../../movie.actions'
import { RemoveMovie } from '../../../movie.actions';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { MovieList } from '../../../movie.state';
declare var $: any

@Component({
  selector: 'app-selected-list',
  templateUrl: './selected-list.component.html',
  styleUrls: ['./selected-list.component.scss']
})
export class SelectedListComponent implements OnInit, OnDestroy {

  @Select(state => state.moviesList) movies$: Observable<any>
  display = false
  movieIdList = []
  moviesListSubscription: Subscription
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private firebaseService: FirebaseService,
    private ipcService: IpcService,
    private utilsService: UtilsService,
    private store: Store) { }

  ngOnInit() {
    this.movies$.subscribe((e: any) => {
      this.movieIdList = []
      if (e.movies.length > 0) {
        this.display = true
      } else {
        this.display = false
      }
      e.movies.forEach((movie: MovieList) => {
        this.movieIdList.push(movie.id)
      })
    })
  }

  ngOnDestroy(): void {
    console.log('ondestroy');
    if (this.moviesListSubscription !== undefined) {
      this.moviesListSubscription.unsubscribe()
    }
  }

  /**
   * Downloads movie in the list.
   */
  download() {
    // this.movies$.toPromise().then(moviesList => {
    //   console.log('moviesList: ', moviesList.movies);
    //   this.dataService.updateSelectedMovies(moviesList.movies)
    //   this.router.navigate([`/bulk-download`], {
    //     relativeTo: this.activatedRoute
    //   })
    // })
    // this.moviesListSubscription
    console.log(this.movieIdList)
    this.moviesListSubscription = this.movies$.subscribe(moviesList => {
      console.log('moviesList: ', moviesList.movies);
      this.dataService.updateSelectedMovies(moviesList.movies)
      this.router.navigate([`/bulk-download`], {
        relativeTo: this.activatedRoute
      })
    })
    console.log(this.moviesListSubscription);

    // d.unsubscribe()
  }

  /**
   * Adds bookmarks to all items in the list.
   */
  addBookmark() {
    this.ipcService.call(IpcCommand.Bookmark, [IpcCommand.BookmarkAdd, this.movieIdList])
    const root = this
    // this.displayMessage = 'Added to watchlist'
    // this.displaySnackbar = true
    this.utilsService.hideSnackbar(root)
  }

  markAsWatched() {
    this.ipcService.call(IpcCommand.Watched, [IpcCommand.Add, this.movieIdList])
    // const root = this
    // this.ipcService.call(IpcCommand.Watched, [IpcCommand.Add, this.movieIdList])
    // this.displayMessage = 'Marked as watched'
    // this.displaySnackbar = true
    // this.utilsService.hideSnackbar(root)
  }

  /**
   * Removes a movie off the list.
   * @param movie movie to remove
   */
  removeMovie(movie) {
    this.store.dispatch(new RemoveMovie(movie))
  }

  /**
   * Clears the selected movies list.
   */
  clearList() {
    this.store.dispatch(new ClearList())
  }
}
