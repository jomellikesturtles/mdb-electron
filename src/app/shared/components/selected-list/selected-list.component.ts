import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router'
import { DataService } from '@services/data.service';
// import { RemoveMovie } from '../../../movie.actions';
import { Observable, Subscription } from 'rxjs';
// import { MovieList } from '../../../movie.state';

@Component({
  selector: 'app-selected-list',
  templateUrl: './selected-list.component.html',
  styleUrls: ['./selected-list.component.scss']
})
export class SelectedListComponent implements OnInit, OnDestroy {

  // @Select(state => state.moviesList) movies$: Observable<any>
  movies$: Observable<any>;
  display = false;
  movieIdList = [];
  moviesListSubscription: Subscription;
  constructor(
    // private activatedRoute: ActivatedRoute,
    // private router: Router,
    // private dataService: DataService,
    // private store: Store
  ) { }

  ngOnInit() {
    // this.movies$.subscribe((e: any) => {
    //   this.movieIdList = []
    //   if (e.movies.length > 0) {
    //     this.display = true
    //   } else {
    //     this.display = false
    //   }
    //   e.movies.forEach((movie: MovieList) => {
    //     this.movieIdList.push(movie.id)
    //   })
    // })
  }

  ngOnDestroy(): void {
    console.log('ondestroy');
    if (this.moviesListSubscription !== undefined) {
      this.moviesListSubscription.unsubscribe();
    }
  }

  /**
   * Downloads movie in the list.
   */
  download() {
    // this.moviesListSubscription = this.movies$.subscribe(moviesList => {
    //   console.log('moviesList: ', moviesList.movies);
    //   this.dataService.updateSelectedMovies(moviesList.movies)
    //   this.router.navigate([`/bulk-download`], {
    //     relativeTo: this.activatedRoute
    //   })
    // })

    // d.unsubscribe()
  }

  /**
   * Adds bookmarks to all items in the list.
   */
  addBookmark() {
    // this.store.dispatch(new AddBookmark())
  }

  markAsWatched() {
    // this.ipcService.call(IPCCommand.Watched, [IPCCommand.Add, this.movieIdList])
    // // const root = this
    // // this.ipcService.call(IPCCommand.Watched, [IPCCommand.Add, this.movieIdList])
    // // this.displayMessage = 'Marked as watched'
    // // this.displaySnackbar = true
    // // this.utilsService.hideSnackbar(root)
    // this.watchedService.saveWatchedMulti(this.movieIdList)

    // this.store.dispatch(new AddWatched())
  }

  /**
   * Removes a movie off the list.
   * @param movie movie to remove
   */
  removeMovie(movie) {
    // this.store.dispatch(new RemoveMovie(movie))
  }

  /**
   * Clears the selected movies list.
   */
  clearList() {
    // this.store.dispatch(new ClearList())
  }
}
