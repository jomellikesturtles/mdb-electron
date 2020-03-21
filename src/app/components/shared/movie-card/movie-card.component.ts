import { UserDataService } from './../../../services/user-data.service';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { AddMovie, RemoveMovie } from '../../../movie.actions';
import { BookmarkService, IBookmark } from '../../../services/bookmark.service';
import { DataService } from '../../../services/data.service';
import { UtilsService } from '../../../services/utils.service';
import { MovieService } from '../../../services/movie.service';
import { IpcCommand, IpcService } from '../../../services/ipc.service';
import { WatchedService, IWatched } from '../../../services/watched.service';
declare var $: any

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit, OnChanges {

  @Input() movie // TODO: add an interface.
  @Input() cardWidth
  @Input() bookmark
  @Input() watched
  @Input() video
  @Output() previewMovieId = new EventEmitter<any>();

  isBookmarked = false
  isWatched = false
  isAvailable = false
  procBookmark = false
  procWatched = false
  procHighlight = false
  watchedProgress = '0%'

  constructor(
    private bookmarkService: BookmarkService,
    private dataService: DataService,
    private ipcService: IpcService,
    private movieService: MovieService,
    private utilsService: UtilsService,
    private watchedService: WatchedService,
    private userDataService: UserDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    $('[data-toggle="popover"]').popover()
    $('[data-toggle="tooltip"]').tooltip({ placement: 'top' })
    // this.getData()
    // console.log('MOVIECARD:', this.movie)
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.bookmark && changes.bookmark.firstChange === false) {
    //   this.isBookmarked = this.bookmark.id ? true : false
    // }
    // if (changes.video && changes.video.firstChange === false) {
    //   this.isAvailable = this.video.id ? true : false
    // }
    // if (changes.watched && changes.watched.firstChange === false) {
    //   this.isWatched = this.watched.id ? true : false
    // }
  }

  /**
   * Gets bookmark and watched status individually...To be removed, since bulk fetch will be used.
   */
  getData(): void {

    this.bookmarkService.getBookmark(this.movie.id).then(e => {
      if (e) {
        this.isBookmarked = true
        this.bookmark.id = e.toString()
      }
    })
    this.watchedService.getWatched(this.movie.id).then(e => {
      // if (e) {
      //   this.isWatched = true
      //   this.watchedDocId = e.toString()
      //   this.watched.percentage = '100%'
      //   this.watched.tmdbId = this.movie.id
      //   this.watched.id = e.toString()
      // }
    })
    // this.watched.id
    // get availability
    // get watched
  }

  /**
   * Adds movie object to the selected movies list
   * @param movie current selected movie
   */
  onHighlight(): void {
    this.procHighlight = true
    this.movie.isHighlighted = !this.movie.isHighlighted
    if (this.movie.isHighlighted) {
      this.store.dispatch(new AddMovie(this.movie))
    } else {
      this.store.dispatch(new RemoveMovie(this.movie))
    }
    this.procHighlight = false
  }

  /**
   * Opens the movie's details page.
   */
  onOpenMovie(): void {
    const highlightedId = this.movie.id;
    this.dataService.updateHighlightedMovie(highlightedId);
    // this.navigationService.goToPage()
    this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });

    // below is for imdb id, but we will settle for tmdb id for now
    // this.movieService.getExternalId(movie.id).subscribe(data => {
    //   const highlightedId = data.imdb_id;
    //   localStorage.setItem('imdb_id', highlightedId)
    //   this.dataService.updateHighlightedMovie(highlightedId);
    //   this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });
    // })
  }

  onPreview(): void {
    this.previewMovieId.emit(this.movie)
  }

  async onToggleBookmark(): Promise<any> {
    // const root = this
    // setTimeout(() => {
    //   root.isBookmarked = !root.isBookmarked
    //   root.procBookmark = false
    // }, 2000);
    // -----------
    this.procBookmark = true
    let bmDoc
    if (!this.movie.bookmark || !this.movie.bookmark.id) {
      bmDoc = await this.userDataService.saveUserData('bookmark', this.movie)
      this.movie.bookmark = bmDoc
    } else {
      bmDoc = await this.bookmarkService.removeBookmark(this.movie.bookmark.id)
      this.movie.bookmark.id = ''
    }
    console.log('BOOKMARKADD/remove:', bmDoc)
    this.procBookmark = false
    this.cdr.detectChanges()
  }

  async onToggleWatched() {
    this.procWatched = true
    let wDocId
    if (!this.movie.watched || !this.movie.watched.id) {
      wDocId = await this.userDataService.saveUserData('watched', this.movie)
      this.movie.watched = wDocId
    } else {
      wDocId = await this.watchedService.removeWatched(this.movie.watched.id)
      this.movie.watched.id = ''
    }
    console.log('WATCHEDADD/remove:', wDocId)
    this.procWatched = false
    this.cdr.detectChanges()

    // const root = this
    // setTimeout(() => {
    //   root.isWatched = !root.isWatched
    //   root.procWatched = false
    //   root.watchedProgress = '100%'
    //   root.movie.isWatched = true
    // }, 2000);
  }

  /**
   * Gets the year.
   * @param releaseDate release date with format YYYY-MM-DD
   */
  getYear(releaseDate: string): string {
    return this.utilsService.getYear(releaseDate)
  }

  /**
   * Gets poster. CURRENTLY UNUSED
   * @param poster poster url
   * TODO: Fetch from offline or generate canvass.
   */
  getPoster(poster: string): string {
    // return poster;
    return ''
  }

  goToYear(year: string): void {
    this.dataService.updateDiscoverQuery(['year', year])
    this.router.navigate([`/discover`], { relativeTo: this.activatedRoute });
  }
}
