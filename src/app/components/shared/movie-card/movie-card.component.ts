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
  // @Input() isBookmarked
  // @Input() isWatched
  @Output() previewMovieId = new EventEmitter<any>();

  isBookmarked = false
  isWatched = false
  isAvailable = false
  // bookmarkDocId = ''
  watchedDocId = ''
  procBookmark = false
  procWatched = false
  watchedProgress = '0%'
  // watched: IWatched = null

  constructor(
    private bookmarkService: BookmarkService,
    private dataService: DataService,
    private ipcService: IpcService,
    private movieService: MovieService,
    private utilsService: UtilsService,
    private watchedService: WatchedService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // this.getData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bookmark && changes.bookmark.firstChange === false) {
      this.isBookmarked = this.bookmark.bookmarkDocId ? true : false
    }
    if (changes.video && changes.video.firstChange === false) {
      this.isAvailable = this.video.videoDocId ? true : false
    }
    if (changes.watched && changes.watched.firstChange === false) {
      this.isWatched = this.watched.watchedDocId ? true : false
    }
  }

  /**
   * Gets bookmark and watched status individually...To be removed, since bulk fetch will be used.
   */
  getData(): void {

    this.bookmarkService.getBookmark(this.movie.id).then(e => {
      if (e) {
        this.isBookmarked = true
        this.bookmark.bookmarkDocId = e.toString()
      }
    })
    this.watchedService.getWatched(this.movie.id).then(e => {
      if (e) {
        this.isWatched = true
        this.watchedDocId = e.toString()
        this.watched.percentage = '100%'
        this.watched.tmdbId = this.movie.id
        this.watched.id = e.toString()
      }
    })
    // this.ipcService.call(IpcCommand.)
    // this.watched.id
    // get availability
    // get watched
  }

  /**
   * Adds movie object to the selected movies list
   * @param movie current selected movie
   */
  onHighlight(): void {
    this.movie.isHighlighted = !this.movie.isHighlighted
    if (this.movie.isHighlighted) {
      this.store.dispatch(new AddMovie(this.movie))
    } else {
      this.store.dispatch(new RemoveMovie(this.movie))
    }
  }

  /**
   * Opens the movie's details page.
   */
  onOpenMovie(): void {
    const highlightedId = this.movie.id;
    this.dataService.updateHighlightedMovie(highlightedId);
    // this.navigationService.goToPage()
    // this.router.navigate([`/details`], { relativeTo: this.activatedRoute });
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
    console.log('togglingBookmark')
    // this.procBookmark = true
    // const root = this
    // setTimeout(() => {
    //   root.isBookmarked = !root.isBookmarked
    //   root.procBookmark = false
    // }, 2000);
    // -----------
    this.procBookmark = true
    const releaseYear = parseInt(this.getYear(this.movie.release_date), 10)
    const movieObject = {
      tmdbId: this.movie.id,
      title: this.movie.title,
      year: releaseYear ? releaseYear : 0,
    }
    console.log('object to toggle :', movieObject);
    let bmDocId
    if (this.isBookmarked) {
      bmDocId = await this.bookmarkService.removeBookmark(this.bookmark.bookmarkDocId)
      this.bookmark.bookmarkDocId = ''
    } else {
      bmDocId = await this.bookmarkService.saveBookmark(movieObject)
      this.bookmark = {
        tmdbId: this.movie.id,
        title: this.movie.title,
        year: releaseYear ? releaseYear : 0,
        bookmarkDocId: bmDocId
      }
      // this.bookmark.bookmarkDocId = bmDocId
    }
    this.isBookmarked = (this.bookmark.bookmarkDocId) ? true : false
    console.log('BOOKMARKADD/remove:', bmDocId)
    this.procBookmark = false
    this.cdr.detectChanges()
  }

  onToggleWatched(): void {
    // this.watched = {
    //   percentage: '100%',
    //   tmdbId: this.movie.id,
    //   cre8Ts: new Date().getTime(),
    //   id: '',
    //   imdbId: '',
    //   timestamp: 0
    // }
    // this.isWatched = true
    // this.watchedProgress = '100%'
    // this.movie.isWatched = true

    this.procWatched = true
    const root = this
    setTimeout(() => {
      root.isWatched = !root.isWatched
      root.procWatched = false
      root.watchedProgress = '100%'
      root.movie.isWatched = true
    }, 2000);
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
    console.log(this.movieService.getMoviePoster(poster))
    // return poster;
    return ''
  }

  goToYear(year: string): void {
    console.log('year', year)
    this.dataService.updateDiscoverQuery(['year', year])
    this.router.navigate([`/discover`], { relativeTo: this.activatedRoute });
  }
}
