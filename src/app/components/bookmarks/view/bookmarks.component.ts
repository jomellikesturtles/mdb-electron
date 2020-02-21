/**
 * Bookmarked by user
 */
import { Component, OnInit } from '@angular/core';
import { catchError, map } from 'rxjs/operators'
import { pipe } from 'rxjs'
import { AngularFirestore } from '@angular/fire/firestore'
import * as firebase from 'firebase';
import { IpcService, BookmarkChanges } from '../../../services/ipc.service';
import { FirebaseService } from '../../../services/firebase.service';
import { MovieService } from '../../../services/movie.service';
import { BookmarkService } from '../../../services/bookmark.service';
import { TMDB_SEARCH_RESULTS } from '../../../mock-data';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

  @Select(state => state.moviesList) moviesList$
  procSync = false
  // bookmarksList: IBookmark[] = [
  //   { tmdbId: 0, imdbId: 'tt0910970', userId: '', },
  //   { tmdbId: 0, imdbId: 'tt0114709', userId: '', },
  //   { tmdbId: 0, imdbId: 'tt0266543', userId: '', },
  //   { tmdbId: 0, imdbId: 'tt0435761', userId: '', },
  //   { tmdbId: 0, imdbId: 'tt2096673', userId: '', },
  //   { tmdbId: 0, imdbId: 'tt0198781', userId: '', },
  //   { tmdbId: 0, imdbId: 'tt0068646', userId: '', },
  //   { tmdbId: 0, imdbId: 'tt0468569', userId: '', }, ]

  bookmarksList
  moviesDisplayList = []
  hasBookmarks = true
  cardWidth = '130px'

  constructor(
    private db: AngularFirestore,
    private firebaseService: FirebaseService,
    private bookmarkService: BookmarkService,
    private ipcService: IpcService,
    private movieService: MovieService,
  ) { }

  ngOnInit() {
    // this.bookmarksList.forEach(element => {
    //   this.movieService.getFindMovie(element.imdbId).subscribe(e => {
    //     // console.log(e);
    //     this.moviesDisplayList.push(e.movie_results[0])
    //   })
    // });
    // this.movieService.getFindMovie('tt0266543').subscribe(e => {
    //   console.log(e);
    //   this.moviesDisplayList.push(e.movie_results[0])
    // })
    this.getData()
    this.getBookmarkedMovies()
  }

  onSync() {
    // this.firebaseService.synchronizeBookmarks()
    // this.bookmarksList.forEach(element => {
    //   this.movieService.getFindMovie(element.imdbId)
    // });
  }

  /**
   * Subscribes to list of highlighted movies.
   */
  getData() {

  }

  getMoreResults() {

  }

  /**
   * Gets bookmarks by ajax.
   */
  async getBookmarkedMovies() {
    this.moviesDisplayList = TMDB_SEARCH_RESULTS.results
    // commented for TEST
    // this.bookmarksList = await this.bookmarkService.getBookmarksMultiple()
    // console.log('getBookmarkedMovies: ', this.bookmarksList);
    // this.bookmarksList.forEach(element => {
    //   // this.movieService.getTmdbMovieDetails().subscribe
    //   this.movieService.getTmdbMovieDetails(element.tmdbId).subscribe(e => {
    //     // this.movieService.getFindMovie(element.imdbId).subscribe(e => {
    //     this.moviesDisplayList.push(e)
    //   })
    // });
  }
}
export interface IBookmark {
  tmdbId: number,
  imdbId: string,
  userId?: string,
  createTs?: number,
  updateTs?: Date,
  change?: 'add' | 'delete' | 'update',
}
