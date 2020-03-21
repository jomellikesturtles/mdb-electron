import { environment } from './../../../../environments/environment';
import {
  AfterViewInit, Component, OnInit, ChangeDetectorRef, ElementRef, Input, ChangeDetectionStrategy, ViewChild, OnDestroy
} from '@angular/core'
import { Observable } from 'rxjs'
import { MovieService } from '../../../services/movie.service'
import { DataService } from '../../../services/data.service'
import { IpcService } from '../../../services/ipc.service'
import { UtilsService } from '../../../services/utils.service'
import { Router, ActivatedRoute } from '@angular/router'
import { ITmdbResult, ILibraryInfo, TmdbParameters, GenreCodes } from '../../../interfaces'
import { TMDB_SEARCH_RESULTS } from '../../../mock-data'
import { GENRES } from '../../../constants'
import { Select, Store } from '@ngxs/store'
import { DomSanitizer } from '@angular/platform-browser'
import { BookmarkService, IBookmark } from '../../../services/bookmark.service'

declare var $: any

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  [x: string]: any

  constructor(
    private bookmarkService: BookmarkService,
    private dataService: DataService,
    private movieService: MovieService,
    private ipcService: IpcService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
  ) { }

  isYTReady: boolean
  hasAlreadySelected: any

  @Select(state => state.moviesList) moviesList$
  @ViewChild('player') thePlayer: ElementRef;

  browserConnection = navigator.onLine
  theLink = ''
  nameString = 'name'
  dataString = 'data'
  selectedMovies = []
  sampleListMovies: ITmdbResult[] = []
  topMoviesFromYear = []
  dashboardLists = []
  selectedMovie: ITmdbResult = {
    popularity: 0,
    id: -1,
    video: false,
    vote_count: 0,
    vote_average: -1,
    title: '',
    release_date: '',
    original_language: '',
    original_title: '',
    genre_ids: [],
    backdrop_path: '',
    adult: false,
    overview: '',
    poster_path: '',
    isAvailable: false
  }
  selectedMovieBookmarkStatus = false
  isHighlighted = false
  cardWidth = '130px'
  clipSrc = null
  youtubeUrl = ''
  tag
  player;
  done = false;
  globalPlayerApiScript

  ngOnInit() {
    if (environment.runConfig.useTestData === true) {
      this.sampleListMovies[this.dataString] = TMDB_SEARCH_RESULTS.results
      this.sampleListMovies[this.nameString] = `Sample Data`
      this.dashboardLists.push(this.sampleListMovies)
    } else {
      this.getNowShowingMovies()
      this.getTopMoviesFromYear()
      this.getTopGenreMovie()
    }
    this.ipcService.libraryFolders.subscribe(value => {
      console.log('dashboard libraryFolders', value)
      this.cdr.detectChanges()
    })

    // $('[data-toggle="popover"]').popover()
    // $('[data-toggle="tooltip"]').tooltip({ placement: 'top' })
    // this.frameready()
  }

  setVideo(videoId: string) {
    this.player.loadVideoById(videoId);
  }

  frameready() {
    (window as any).onYouTubeIframeAPIReady = () => {
      console.log('INFRAMEREADY')
      this.player = new (window as any).YT.Player('player', {
        height: '100%',
        width: '100%',
        events: {
          onReady: (event) => this.onPlayerReady(event),
          onStateChange: (event) => this.onPlayerStateChange(event)
        },
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 1,
          showInfo: 0,
          disablekb: 1
        }
      });
    }
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.removeYoutube()
  }

  generateYoutube(): void {
    const doc = (window as any).document;
    const playerApiScript = doc.createElement('script');
    playerApiScript.type = 'text/javascript';
    playerApiScript.src = 'https://www.youtube.com/iframe_api';
    this.globalPlayerApiScript = playerApiScript
    doc.body.appendChild(this.globalPlayerApiScript);
  }

  removeYoutube() {
    const doc = (window as any).document;
    if (this.globalPlayerApiScript) {
      doc.body.removeChild(this.globalPlayerApiScript)
      this.globalPlayerApiScript = null
    }
  }

  // The API calls this function when the player's state changes.
  onPlayerStateChange(event) {
    /**
     * -1 (unstarted)
     * 0 (ended)
     * 1 (playing)
     * 2 (paused)
     * 3 (buffering)
     * 5 (video cued).
     * YT.PlayerState.ENDED
     * YT.PlayerState.PLAYING
     * YT.PlayerState.PAUSED
     * YT.PlayerState.BUFFERING
     * YT.PlayerState.CUED
     */
    console.log('onPlayerStateChange: ', event.data);
    if (event.data === 1) {
      this.isYTReady = true
    }
    if (event.data === -1 || event.data === 0) {
      this.isYTReady = false
    }
    this.cdr.detectChanges()
  }

  // The API will call this function when the video player is ready
  onPlayerReady(event) {
    console.log('ONPLAYERREADY');
    event.target.cueVideoById({
      videoId: this.youtubeUrl
    });
    event.target.playVideo();
  }

  /**
   * Gets the availability of movies in the dashboard.
   */
  async getAvailability() {
    for (const element of this.sampleListMovies) {
      const result = await this.ipcService.getMovieFromLibrary(element.id)
      if (result) {
        element.isAvailable = true
      }
    }
    this.cdr.detectChanges()
  }

  /**
   * Gets movies showing in theaters in current date
   */
  getNowShowingMovies() {
    const sDate = new Date()
    const today = sDate.getFullYear() + '-' + ('0' + (sDate.getMonth() + 1)).slice(-2) + '-' + ('0' + sDate.getDate()).slice(-2)
    sDate.setDate(sDate.getDate() - 21)
    const threeWeeksAgo = sDate.getFullYear() + '-' + ('0' + (sDate.getMonth() + 1)).slice(-2) +
      '-' + ('0' + sDate.getDate()).slice(-2)
    const params = [
      [TmdbParameters.PrimaryReleaseDateGreater, threeWeeksAgo],
      [TmdbParameters.PrimaryReleaseDateLess, today]
    ]
    this.sendToMovieService(params, `New Releases`)
  }

  /**
   * Gets top-rated movies from year
   */
  getTopMoviesFromYear() {
    const sDate = new Date()
    const minimumYear = 1940
    const randYear = Math.round(
      Math.random() * ((sDate.getFullYear() - 1) - minimumYear) + minimumYear
    )
    const params = [[TmdbParameters.PrimaryReleaseYear, randYear]]
    this.sendToMovieService(params, `Top movies of ${randYear}`)
  }

  /**
   * Gets top-rated movies by genre.
   */
  getTopGenreMovie() {
    const TMDB_GENRE_LENGTH = 19 // up to index 19 is valid tmdb genre
    const GENRE_INDEX = Math.floor(Math.random() * (TMDB_GENRE_LENGTH))
    const CHOSEN_GENRE = GENRES[GENRE_INDEX]
    const params = [
      [TmdbParameters.WithGenres, CHOSEN_GENRE.id]
    ]
    this.sendToMovieService(params, `Top ${CHOSEN_GENRE.name}`)
  }

  /**
   * Sends parameter to the API.
   * @param params parameters to pass to the API
   * @param title the title of the list
   */
  async sendToMovieService(params: any, title: string) {
    const data = await this.movieService.getMoviesDiscover(params).toPromise()
    // innerList[this.nameString] = title
    // innerList['data'] = data.results
    const innerList = {
      name: title,
      data: data.results
    }
    this.dashboardLists.push(innerList)
    this.dataService.addDashboardData(innerList.data)
    this.cdr.detectChanges()
  }

  /**
   * Gets movies from library
   */
  getMoviesFromLibrary() {
    console.log('getMoviesFromLibrary dashboard.component')
    this.ipcService.getMoviesFromLibrary()
  }

  /**
   * TODO: Simplify component code. Transfer codes to the service.
   * Performs actions for selected movie.
   * @param movie the selected movie
   */
  onPreviewSelected(movie: any) {
    if (this.selectedMovie.id === movie.id) {
      return
    }
    let videoId = ''
    const results = []
    this.selectedMovie = movie
    let title = movie.title.toLowerCase()
    const query = `${movie.title} ${this.getYear(movie.release_date)}`
    title = title.replace(/[.…]+/g, '')
    this.movieService.getRandomVideoClip(query).subscribe(data => {
      data.forEach(element => {
        const snipTitle = $.parseHTML(element.snippet.title.toLowerCase())[0].textContent
        if ((snipTitle.indexOf(title) >= 0) && ((snipTitle.indexOf('scene') >= 0) || (snipTitle.indexOf('trailer') >= 0) || (snipTitle.indexOf('movie clip') >= 0)) && (snipTitle.indexOf('behind the scene') === -1)) {
          results.push({ title: snipTitle, videoId: element.id.videoId })
        }
      })
      // HiN6Ag5-DrU?VQ=HD720
      const index = Math.round(Math.random() * (results.length - 1))
      console.log('clips list length: ', results.length, ' clip index: ', index, results[index]);

      videoId = results[index].videoId
      this.clipSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?VQ=HD720&autoplay=1&rel=1&controls=0&disablekb=1&fs=0&modestbranding=1`)
      this.youtubeUrl = videoId
      // if results[index].snippet.channelTitle  === 'Movieclips' ---- cut the video by 30seconds
      if (!this.hasAlreadySelected) {
        this.generateYoutube()
        this.hasAlreadySelected = true
      }
      this.setVideo(videoId)
    })
    this.getBookmarkStatus(movie.id)
  }

  /**
   * Gets the bookmark status of the selected movie.
   * @param id tmdb id to get the bookmark status
   */
  getBookmarkStatus(id: number) {
    this.bookmarkService.getBookmark(id).then(e => {
      if (e !== null) {
        this.selectedMovieBookmarkStatus = true
      } else {
        this.selectedMovieBookmarkStatus = false
      }
      this.cdr.detectChanges();
    })
  }

  /**
   * Converts genre code into its genre name equivalent.
   * @param genreCode genre code origin
   * @returns genre name
   */
  getGenre(genreCode: number) {
    return GenreCodes[genreCode]
  }

  /**
   * Goes to detail of the selected movie.
   * @param movie the movie selected
   */
  goToMovie(id: any) {
    const highlightedId = id;
    this.dataService.updateHighlightedMovie(highlightedId);
    this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });
  }

  toggleBookmark(id: number) {
    // if (this.selectedMovieBookmarkStatus === false) {
    this.bookmarkService.saveBookmark(id)
    // } else {
    //   this.bookmarkService.removeBookmark(id)
    // }
  }

  goToGenre(val) {
    this.dataService.updateDiscoverQuery(['genre', val])
    this.router.navigate([`/discover`], { relativeTo: this.activatedRoute });
  }

  scrollPrev() {
    const container = document.getElementById('topMoviesFromYearPanel')
    this.sideScroll(container, 'left', 25, 100, 10)
  }

  scrollNext() {
    const container = document.getElementById('topMoviesFromYearPanel')
    this.sideScroll(container, 'right', 25, 100, 10)
  }

  /**
   * The side scroll by button.
   * @param element the element
   * @param direction left or right
   * @param speed how fast
   * @param distance how far
   * @param step step
   */
  sideScroll(element, direction, speed, distance, step) {
    let scrollAmount = 0
    const slideTimer = setInterval(() => {
      if (direction === 'left') {
        element.scrollLeft -= step
      } else {
        element.scrollLeft += step
      }
      scrollAmount += step
      if (scrollAmount >= distance) {
        window.clearInterval(Number(slideTimer))
      }
    }, speed)
  }

  /**
   * Gets the year.
   * @param releaseDate release date with format YYYY-MM-DD
   */
  getYear(releaseDate: string) {
    return this.utilsService.getYear(releaseDate)
  }
}
