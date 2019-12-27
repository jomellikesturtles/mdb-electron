/**
 * Bookmarked by user
 */
import { Component, OnInit } from '@angular/core';
import { catchError, map } from 'rxjs/operators'
import { pipe } from 'rxjs'
import { AngularFirestore } from '@angular/fire/firestore'
import * as firebase from 'firebase';
import { IpcService, BookmarkChanges } from '../../services/ipc.service';
import { FirebaseService } from '../../services/firebase.service';
import { MovieService } from '../../services/movie.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

  procSync = false
  bookmarksList: IBookmark[] = [
    { tmdbId: 0, imdbId: 'tt0910970', userId: '', },
    { tmdbId: 0, imdbId: 'tt0114709', userId: '', },
    { tmdbId: 0, imdbId: 'tt0266543', userId: '', },
    { tmdbId: 0, imdbId: 'tt0435761', userId: '', },
    { tmdbId: 0, imdbId: 'tt2096673', userId: '', },
    { tmdbId: 0, imdbId: 'tt0198781', userId: '', },
    { tmdbId: 0, imdbId: 'tt0068646', userId: '', },
    { tmdbId: 0, imdbId: 'tt0468569', userId: '', },
    { tmdbId: 0, imdbId: 'tt0050083', userId: '', },
    { tmdbId: 0, imdbId: 'tt0108052', userId: '', },
    { tmdbId: 0, imdbId: 'tt0167260', userId: '', },
    { tmdbId: 0, imdbId: 'tt0110912', userId: '', },
    { tmdbId: 0, imdbId: 'tt0060196', userId: '', },
    { tmdbId: 0, imdbId: 'tt0137523', userId: '', },
    { tmdbId: 0, imdbId: 'tt0120737', userId: '', },
    { tmdbId: 0, imdbId: 'tt0109830', userId: '', },
    { tmdbId: 0, imdbId: 'tt1375666', userId: '', },
    { tmdbId: 0, imdbId: 'tt0080684', userId: '', },
    { tmdbId: 0, imdbId: 'tt0167261', userId: '', },
    { tmdbId: 0, imdbId: 'tt0133093', userId: '', },
    { tmdbId: 0, imdbId: 'tt0073486', userId: '', },
    { tmdbId: 0, imdbId: 'tt0099685', userId: '', },
    { tmdbId: 0, imdbId: 'tt0047478', userId: '', },
    { tmdbId: 0, imdbId: 'tt1375666', userId: '', },
    { tmdbId: 0, imdbId: 'tt1375666', userId: '', },
  ]
  moviesDisplayList = []
  hasBookmarks = true
  cardWidth = '130px'

  constructor(
    private db: AngularFirestore,
    private firebaseService: FirebaseService,
    private ipcService: IpcService,
    private movieService: MovieService,
    private utilsService: UtilsService) { }

  ngOnInit() {
    this.bookmarksList.forEach(element => {
      this.movieService.getFindMovie(element.imdbId).subscribe(e => {
        // console.log(e);
        this.moviesDisplayList.push(e.movie_results[0])
      })
    });
    // this.movieService.getFindMovie('tt0266543').subscribe(e => {
    //   console.log(e);
    //   this.moviesDisplayList.push(e.movie_results[0])
    // })
  }

  onSync() {
    // this.firebaseService.synchronizeBookmarks()
    // this.bookmarksList.forEach(element => {
    //   this.movieService.getFindMovie(element.imdbId)
    // });
  }

  onHighlight(movie) {

  }

  onSelect(movie) {

  }

  getYear(val) {
    return this.utilsService.getYear(val)
  }

  getMoreResults() {

  }

  /**
   * Gets bookmarks by ajax.
   */
  getBookmarks() {

  }
}
export interface IBookmark {
  tmdbId: number,
  imdbId: string,
  userId: string,
  createTs?: Date,
  updateTs?: Date,
  change?: 'add' | 'delete' | 'update',
}
