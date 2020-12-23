import { UserDataService } from './../../../services/user-data.service';
import { PreferencesService } from './../../../services/preferences.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { AddMovie, RemoveMovie } from '../../../movie.actions';
import { BookmarkService, IBookmark } from '../../../services/bookmark.service';
import { DataService } from '../../../services/data.service';
import { UtilsService } from '../../../services/utils.service';
import { WatchedService, IWatched } from '../../../services/watched.service';
import { MovieService } from 'src/app/services/movie.service';
import { TorrentService } from 'src/app/services/torrent.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
declare var $: any

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  _movie: any
  @Input()  // TODO: add an interface.
  set movie(inputMessage: any) {
    this._movie = inputMessage
    if (this.preferencesService.isGetTorrentFromMovieCard) {
      // UNCOMMENT BELOW to get external_id and torrent one by one
      this.movieService.getExternalId(this._movie.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(externalId => {
        if (externalId && externalId.imdb_id) {
          this.torrentService.getTorrentsOnline(externalId.imdb_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
            if (e.status === 'ok' && e.data.movie_count > 0) {
              const firstTorrent = e.data.movies[0].torrents[0]
              this._movie.library = firstTorrent
              this._movie.library.id = firstTorrent.hash
            }
          })
        }
      })
    }
  }
  get movie(): any {
    return this._movie;
  }

  _cardWidth = '130px'
  @Input()
  set cardWidth(inputMessage: any) {
    this._cardWidth = inputMessage
  }
  get cardWidth(): any {
    return this._cardWidth;
  }

  _bookmark: any
  @Input()
  set bookmark(inputBookmark: any) {
    if (inputBookmark) {
      this._bookmark = inputBookmark
      this.isBookmarked = true
    }
  }
  get bookmark(): any {
    return this._cardWidth;
  }

  _watched: { percentage: string; }
  @Input()
  set watched(inputWatched: any) {
    if (inputWatched) {
      this._watched = inputWatched
      this.watchedPercentage = this._watched.percentage + '%'
      this.isWatched = true
    }
  }
  get watched(): any {
    return this._watched;
  }

  _favorite: any
  @Input()
  set favorite(favorite: any) {
    if (favorite) {
      this._favorite = favorite
    }
  }
  get favorite(): any {
    return this._favorite;
  }

  _library: any
  @Input()
  set library(inputVideo: any) {
    this._library = inputVideo
  }
  get library(): any {
    return this._library;
  }
  isAdminMode = false
  procFavorite = false
  procBookmark = false
  procWatched = false
  procHighlight = false
  isWatched = false
  isBookmarked = false
  isAvailable = false
  watchedPercentage = '0%'
  isSingleClick: any
  private ngUnsubscribe = new Subject();

  constructor(
    private dataService: DataService,
    private movieService: MovieService,
    private preferencesService: PreferencesService,
    private torrentService: TorrentService,
    private userDataService: UserDataService,
    private utilsService: UtilsService,
    private watchedService: WatchedService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store,
  ) { }

  ngOnInit(): void {
    $('[data-toggle="popover"]').popover()
    $('[data-toggle="tooltip"]').tooltip({ placement: 'top' })
    // console.log('MOVIECARD:', this.movie)
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  /**
   * Adds movie object to the selected movies list
   * @param movie current selected movie
   */
  onHighlight(): void {
    this.procHighlight = true
    this._movie.isHighlighted = !this._movie.isHighlighted
    if (this._movie.isHighlighted) {
      this.store.dispatch(new AddMovie(this._movie))
    } else {
      this.store.dispatch(new RemoveMovie(this._movie))
    }
    this.procHighlight = false
  }

  /**
   * Opens the movie's details page.
   */
  onOpenMovie(): void {
    const highlightedId = this._movie.id;
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
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        this.dataService.updatePreviewMovie(this._movie)
      }
    }, 300)
  }

  async onToggleBookmark(): Promise<any> {
    this.procBookmark = true
    let bmDoc: any
    bmDoc = await this.userDataService.toggleBookmark(this._movie)
    this.isWatched = !this.isWatched
    console.log('BOOKMARKADD/remove:', bmDoc)
    this.procBookmark = false
  }

  async onToggleWatched() {
    this.procWatched = true
    let wDocId: any
    wDocId = await this.watchedService.toggleWatched(this._movie)
    this.isWatched = !this.isWatched
    this.procWatched = false
  }

  toggleFavorites(): void {
    this.isSingleClick = false
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
    this.dataService.updateDiscoverQuery({ type: 'year', value: year, name: null })
    this.router.navigate([`/discover`], {
      relativeTo: this.activatedRoute, queryParams: { type: 'year', year: year }
    });
  }
}
