import { UserDataService } from '@services/user-data/user-data.service';
import { PreferencesService } from '@services/preferences.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '@services/data.service';
import { MovieService } from '@services/movie/movie.service';
import { TorrentService } from '@services/torrent/torrent.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MDBMovie } from '@models/mdb-movie.model';
import { IProfileData } from '@models/profile-data.model';
import ObjectUtil from '@utils/object.utils';
import GeneralUtil from '@utils/general.util';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  _movie: MDBMovie
  @Input()
  set movie(inputMessage: MDBMovie) {
    this._movie = inputMessage

    if (this.preferencesService.isGetTorrentFromMovieCard) {
      // UNCOMMENT BELOW to get external_id and torrent one by one
      this.movieService.getExternalId(this._movie.tmdbId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(externalId => {
        if (externalId && externalId.imdb_id) {
          this.torrentService.getTorrentsOnline(externalId.imdb_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
            if (e.status === 'ok' && e.data.movie_count > 0) {
              const firstTorrent = e.data.movies[0].torrents[0]
              // this._movie.library = firstTorrent
              // this._movie.library.id = firstTorrent.hash
            }
          })
        }
      })
    }
  }
  get movie(): MDBMovie {
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

  _library: any
  @Input()
  set library(inputVideo: any) {
    this._library = inputVideo
  }
  get library(): any {
    return this._library;
  }

  _userData: IProfileData
  @Input()
  set userData(inputData: IProfileData) {
    console.log("USERDATA", inputData)
    this._userData = inputData
    if (!ObjectUtil.isEmpty(inputData)) {
      if (inputData.watched) {
        this.watchedPercentage = inputData.watched.percentage + '%'
      }
    }
  }
  get userData(): IProfileData {
    return this._userData;
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
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
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
    // this._movie.isHighlighted = !this._movie.isHighlighted
    // if (this._movie.isHighlighted) {
    //   this.store.dispatch(new AddMovie(this._movie))
    // } else {
    //   this.store.dispatch(new RemoveMovie(this._movie))
    // }
    this.procHighlight = false
  }

  /**
   * Opens the movie's details page.
   */
  onOpenMovie(): void {
    const highlightedId = this._movie.tmdbId;
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
    setTimeout(() => {
      this.isBookmarked = !this.isBookmarked
      this.procBookmark = false
    }, 500);
    // this.procBookmark = true
    // let bmDoc: any
    // bmDoc = await this.userDataService.toggleBookmark(this._movie)
    // this.isBookmarked = !this.isBookmarked
    // console.log('BOOKMARKADD/remove:', bmDoc)
    // this.procBookmark = false
  }

  async onToggleWatched() {
    this.procWatched = true
    setTimeout(() => {
      this.isWatched = !this.isWatched
      // this.userData.watched.percentage = 100
      // this.watchedPercentage = 100 + '%'
      this.procWatched = false
    }, 500);
    // this.procWatched = true
    // let wDocId: any
    // wDocId = await this.watchedService.toggleWatched(this._movie)
    // this.isWatched = !this.isWatched
    // this.procWatched = false
  }

  toggleFavorites(): void {
    this.isSingleClick = false
  }
  /**
   * Gets the year.
   * @param releaseDate release date with format YYYY-MM-DD
   */
  getYear(releaseDate: string): string {
    return GeneralUtil.getYear(releaseDate)
  }

  /**
   * Gets poster. CURRENTLY UNUSED
   * @param poster poster url
   * TODO: Fetch from offline or generate canvass.
   */
  getPoster(poster: string): string {
    return ''
  }

  goToYear(year: string): void {
    this.dataService.updateDiscoverQuery({ type: 'year', value: year, name: null })
    this.router.navigate([`/discover`], {
      relativeTo: this.activatedRoute, queryParams: { type: 'year', year: year }
    });
  }
}
