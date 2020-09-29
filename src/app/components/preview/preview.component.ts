/**
 * TODO: Compatibility for details component.
 */
import { Component, OnInit, OnDestroy, Pipe, PipeTransform, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UtilsService } from 'src/app/services/utils.service';
import { GenreCodes, ITmdbResult } from 'src/app/interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { MovieService } from 'src/app/services/movie.service';
import { UserDataService } from 'src/app/services/user-data.service';
declare var $: any

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit, OnDestroy {

  constructor(
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userDataService: UserDataService,
    private cdr: ChangeDetectorRef,
    private movieService: MovieService,
    private utilsService: UtilsService,
    private domSanitizer: DomSanitizer,
  ) { }

  previewMovie: { [key: string]: any } = {
    id: 0,
    title: null,
  }
  clipSrc = null
  youtubeUrl = ''
  tag
  player;
  done = false;
  globalPlayerApiScript
  selectedMovieBookmarkStatus = false
  hasAlreadySelected
  selectedMovie
  isYTReady = false
  hasInitialSelected = false
  isHide = true
  playedTmdbId = 0
  hasQuotaExceeded = false
  isMute = false
  isYTPlaying = false
  hasTrailerClip = false
  isAvailable = false
  procBookmark = false
  procWatched = false
  procHighlight = false
  showPreviewOverlayContext = false

  ngOnInit() {
    this.frameReady()
    this.dataService.previewMovie.subscribe(e => {
      console.log('PREVIEWMOVIE:', e)
      this.getVideoClip(e)
      this.showPreviewOverlayContext = this.router.url.includes('/details/') ? false : true
      this.cdr.detectChanges()
    })
  }

  ngOnDestroy() {
    this.removeYoutube()
  }

  frameReady() {
    (window as any).onYouTubeIframeAPIReady = () => {
      this.player = new (window as any).YT.Player('player', {
        height: '100%',
        width: '100%',
        events: {
          onReady: (event: any) => this.onPlayerReady(event),
          onStateChange: (event: any) => this.onPlayerStateChange(event)
        },
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 1,
          showInfo: 0,
          disablekb: 1
        }
      });
    }
  }

  onPlayerReady(event) {
    event.target.cueVideoById({
      videoId: this.youtubeUrl
    });
    event.target.playVideo();
  }

  /**
   * Detects the state change of trailer player (YouTube)
   * @param event
   */
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
      this.isYTPlaying = true
    }
    if (event.data === -1 || event.data === 5 || event.data === 0) {
      this.isYTReady = false
      this.isYTPlaying = false
    }
    if (event.data === 2) {
      const root = this
      console.log('paused')
      // setTimeout(() => {
      //   root.player.playVideo()
      //   console.log('settoplay')
      // }, 3000);
    }
    this.cdr.detectChanges()

  }

  /**
   * TODO: Simplify component code. Transfer codes to the service.
   * Performs actions for selected movie.
   * @param movie the selected movie
   */
  async getVideoClip(movie) {
    this.previewMovie = movie
    this.isHide = false
    if (movie.id === this.playedTmdbId) {
      return
    }
    console.log('PREVIEW MOVIE: ', movie)
    this.playedTmdbId = this.previewMovie.id
    this.hasInitialSelected = true
    let videoId = ''
    const results = []
    // this.selectedMovie = this.previe1wMovie
    let title = this.previewMovie.title.toLowerCase()
    const query = `${this.previewMovie.title} ${this.getYear(this.previewMovie.release_date)}`
    title = title.replace(/[.…]+/g, '')

    let theRes = await this.movieService.getTmdbVideos(this.previewMovie.id).toPromise()

    if (theRes.results.length === 0) {
      this.clipSrc = null
      return
    }

    theRes = theRes.results.find(e => e.type.toLowerCase() === 'trailer')
    if (theRes) {
      this.hasTrailerClip = true
      theRes = theRes.key
    } else {
      this.clipSrc = null
      this.hasTrailerClip = false
      return
    }
    // const index = Math.round(Math.random() * (theRes.results.length - 1))
    // theRes = theRes.results[index].key
    // this.movieService.getRandomVideoClip(query).subscribe(data => {
    // data.forEach(element => {
    //   const snipTitle = $.parseHTML(element.snippet.title.toLowerCase())[0].textContent
    //   if ((snipTitle.indexOf(title) >= 0) && ((snipTitle.indexOf('scene') >= 0) || (snipTitle.indexOf('trailer') >= 0) || (snipTitle.indexOf('movie clip') >= 0)) && (snipTitle.indexOf('behind the scene') === -1)) {
    //     results.push({ title: snipTitle, videoId: element.id.videoId })
    //   }
    // })
    // // HiN6Ag5-DrU?VQ=HD720
    // const index = Math.round(Math.random() * (results.length - 1))
    // console.log('clips list length: ', results.length, ' clip index: ', index, results[index]);

    videoId = theRes
    // videoId = results[index].videoId
    this.clipSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?VQ=HD720&autoplay=1&rel=1&controls=0&disablekb=1&fs=0&modestbranding=1`)
    this.clipSrc = `https://www.youtube.com/embed/${videoId}?VQ=HD720&autoplay=1&rel=1&controls=0&disablekb=1&fs=0&modestbranding=1`
    this.youtubeUrl = videoId
    console.log('CLIPSRC', this.clipSrc)
    // if results[index].snippet.channelTitle  === 'Movieclips' ---- cut the video by 30seconds
    if (!this.hasAlreadySelected) {
      this.generateYoutube()
      this.hasAlreadySelected = true
    }

    const root = this
    // setTimeout(() => {
    root.setVideo(videoId)
    this.cdr.detectChanges()
    // }, 5000
    // )
    // })
  }

  setVideo(videoId: string) {
    this.player.loadVideoById(videoId);
    // this.player.cueVideoByUrl(videoId);
  }

  /**
   * Creates youtube html script.
   */
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

  async toggleBookmark(): Promise<any> {
    this.procBookmark = true
    let bmDoc
    bmDoc = await this.userDataService.toggleBookmark(this.previewMovie)
    console.log('BOOKMARKADD/remove:', bmDoc)
    this.procBookmark = false
    // this.cdr.detectChanges()
  }

  async toggleWatched() {
    this.procWatched = true
    let wDocId
    wDocId = await this.userDataService.toggleWatched(this.previewMovie)
    console.log('WATCHEDADD/remove:', wDocId)
    this.procBookmark = false
    // this.cdr.detectChanges()
  }

  toggleMute() {
    if (this.isMute) {
      this.player.setVolume(100)
      this.isMute = false
    } else {
      this.player.setVolume(0)
      this.isMute = true
    }
  }
  /**
   * Goes to detail of the selected movie.
   * @param movie the movie selected
   */
  goToMovie(id: any) {
    const highlightedId = id;
    this.dataService.updateHighlightedMovie(highlightedId);
    this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });
    this.isHide = true
    this.onHidePlayer()
  }

  /**
   * Gets the year.
   * @param releaseDate release date with format YYYY-MM-DD
   */
  getYear(releaseDate: string) {
    return this.utilsService.getYear(releaseDate)
  }

  /**
   * Discovers movies based from criteria.
   * @param type type of discovery. (year, certification, genre)
   * @param id value to discover
   */
  goToDiscover(type: string, id: string, name?: string) {
    this.dataService.updateDiscoverQuery([type, id, name])
    this.router.navigate([`/discover`], { relativeTo: this.activatedRoute });
    this.isHide = true
    this.onHidePlayer()
  }

  playTrailer() {
    this.player.playVideo()
  }

  stopVideo() {
    if (this.player) {
      this.player.stopVideo()
    }
  }

  onHidePlayer() {
    console.log(this.player)
    this.isHide = true
    this.clipSrc = null
    this.stopVideo()
  }

  playMovie() {

  }

}

/**
 * Converts genre code into its genre name equivalent.
 * @param genreCode genre code origin
 * @returns genre name
 */
@Pipe({ name: 'genre' })
export class GenrePipe implements PipeTransform {
  constructor() { }
  transform(genreCode: number): string {
    return GenreCodes[genreCode]
  }
}
