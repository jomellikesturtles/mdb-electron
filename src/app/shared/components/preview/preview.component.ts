/**
 * Preview for movie details.
 */
import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '@services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MovieService } from '@services/movie/movie.service';
import { YoutubeService } from '@services/movie/youtube.service';
import { MDBMovie } from '@models/mdb-movie.model';
import GeneralUtil from '@utils/general.util';
import { MediaUserDataService } from '@services/media/media-user-data.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit, OnDestroy, AfterViewInit {

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.onHidePlayer();
    }
  }

  constructor(
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mediaUserDataService: MediaUserDataService,
    private cdr: ChangeDetectorRef,
    private movieService: MovieService,
    private youtubeService: YoutubeService,
    private domSanitizer: DomSanitizer,
  ) { }

  previewMovie: MDBMovie;
  clipSrc = null;
  youtubeUrl = '';
  player;
  globalPlayerApiScript;
  hasAlreadySelected: boolean;
  isYTReady = false;
  hasInitialSelected = false;
  isHide = true;
  playedTmdbId = '0';
  isMute = false;
  isYTPlaying = false;
  hasTrailerClip = false;
  isAvailable = false;
  procBookmark = false;
  procWatched = false;
  procHighlight = false;
  showPreviewOverlayContext = false;
  isTrailerOnly = false;
  playerState = -1;

  ngOnInit() {
    this.frameReady();
  }

  ngAfterViewInit(): void {

    this.dataService.previewMovie.subscribe((e: MDBMovie) => {
      console.log('PREVIEWMOVIE:', e);
      this.getVideoClip(new MDBMovie(e));
      this.showPreviewOverlayContext = this.router.url.includes('/details/') ? false : true;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.removeYoutube();
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
    };
  }

  onPlayerReady(event) {
    this.isYTReady = true;
    event.target.cueVideoById({
      videoId: this.youtubeUrl
    });
    event.target.playVideo();
    this.cdr.detectChanges();
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
    this.playerState = event.data;
    if (event.data === 1) {
      this.isYTReady = true;
      this.isYTPlaying = true;
    }
    if (event.data === -1 || event.data === 5 || event.data === 0) {
      // Keep isYTReady as true once it has loaded
      this.isYTPlaying = false;
    }
    if (event.data === 2) {
      console.log('paused');
    }
    this.cdr.detectChanges();

  }

  /**
   * TODO: Simplify component code. Transfer codes to the service.
   * Performs actions for selected movie.
   * @param movie the selected movie
   */
  async getVideoClip(movie: MDBMovie) {
    if (!movie || !movie.tmdbId) {
      return;
    }
    this.previewMovie = movie;
    this.isHide = false;
    // if (movie.tmdbId === this.playedTmdbId) {
    //   return;
    // }
    this.playedTmdbId = this.previewMovie.tmdbId;
    this.hasInitialSelected = true;
    let videoId = '';
    const query = `${this.previewMovie.title} ${this.getYear(this.previewMovie.releaseDate)} trailer`;

    try {
      const theRes = await this.movieService.getRelatedClips(this.previewMovie.tmdbId).toPromise();

      if (theRes && theRes.results && theRes.results.length > 0) {
        // const trailer = theRes.results[Math.floor(Math.random() * (theRes.results.length - 0 + 1) + 0)];
        // TODO: add checking for "status": "UNPLAYABLE",
        const filteredVideos = theRes.results.filter(e => e.type == 'Trailer');
        const trailer = filteredVideos[Math.floor(Math.random() * (theRes.results.length - 0 + 1) + 0)];
        if (trailer) {
          this.hasTrailerClip = true;
          videoId = trailer.key;
        }
      }
    } catch (e) {
      console.log('TMDB related clips error', e);
    }

    // Fallback only
    // if (!videoId) {
    //   try {
    //     const ytResults = await this.youtubeService.getRandomVideoClip(query).toPromise();
    //     if (ytResults && ytResults.length > 0) {
    //       this.hasTrailerClip = true;
    //       videoId = ytResults[0].id.videoId;
    //     }
    //   } catch (e) {
    //     console.log('Youtube search error', e);
    //   }
    // }

    if (!videoId) {
      this.clipSrc = null;
      this.hasTrailerClip = false;
      return;
    }

    this.clipSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?VQ=HD720&autoplay=1&rel=1&controls=0&disablekb=1&fs=0&modestbranding=1`);
    this.youtubeUrl = videoId;
    console.log('CLIPSRC', this.clipSrc);
    // if results[index].snippet.channelTitle  === 'Movieclips' ---- cut the video by 30seconds
    if (!this.hasAlreadySelected) {
      this.generateYoutube();
      this.hasAlreadySelected = true;
    } else {
      if (this.player && this.player.loadVideoById) {
        this.player.loadVideoById(videoId);
      }
    }

    const root = this;
    setTimeout(() => {
      if (root.player && root.player.loadVideoById) {
        root.setVideo(videoId);
      }
      root.cdr.detectChanges();
    }, 1000);
    // })
  }

  setVideo(videoId: string) {
    console.log(`Setting video with video id: ${videoId}.`);
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
    this.globalPlayerApiScript = playerApiScript;
    doc.body.appendChild(this.globalPlayerApiScript);
  }

  removeYoutube() {
    const doc = (window as any).document;
    if (this.globalPlayerApiScript) {
      doc.body.removeChild(this.globalPlayerApiScript);
      this.globalPlayerApiScript = null;
    }
  }

  async toggleBookmark(): Promise<any> {
    this.procBookmark = true;
    let bmDoc;
    bmDoc = await this.mediaUserDataService.putMediaFavorite(this.previewMovie); // TODO: change to bookmark
    console.log('BOOKMARKADD/remove:', bmDoc);
    this.procBookmark = false;
    // this.cdr.detectChanges()
  }

  async toggleWatched() {
    // this.procWatched = true;
    // let wDocId;
    // wDocId = await this.watchedService.toggle(this.previewMovie);
    // console.log('WATCHEDADD/remove:', wDocId);
    // this.procBookmark = false;
    // this.cdr.detectChanges()
  }

  toggleMute() {
    if (this.isMute) {
      this.player.setVolume(100);
      this.isMute = false;
    } else {
      this.player.setVolume(0);
      this.isMute = true;
    }
  }
  /**
   * Goes to detail of the selected movie.
   * @param movie the movie selected
   */
  goToMovie() {
    const id = this.previewMovie.tmdbId;

    this.dataService.updateHighlightedMovie(id);
    this.router.navigate([`/details/${id}`], { relativeTo: this.activatedRoute });
    this.isHide = true;
    this.onHidePlayer();
  }

  /**
   * Gets the year.
   * @param releaseDate release date with format YYYY-MM-DD
   */
  getYear(releaseDate: string) {
    return GeneralUtil.getYear(releaseDate);
  }

  /**
   * Discovers movies based from criteria.
   * @param type type of discovery. (year, certification, genre)
   * @param id value to discover
   */
  goToDiscover(type: string, id: string, name?: string) {
    this.dataService.updateDiscoverQuery({ type: type, value: id, name: name });
    this.router.navigate([`/discover`], { relativeTo: this.activatedRoute });
    this.isHide = true;
    this.onHidePlayer();
  }

  playPreview() {
    this.player.playVideo();
  }

  stopPreview() {
    if (this.player) {
      this.player.stopVideo();
    }
  }

  onHidePlayer() {
    this.isHide = true;
    this.stopPreview();
    // if (this.player) {
    //   try {
    //     this.player.destroy();
    //     this.player = null;
    //   } catch (e) {
    //     console.error('Error destroying player:', e);
    //   }
    // }
    this.clipSrc = null;
    // this.cdr.detectChanges();
  }

  playMovie() {

  }

}
