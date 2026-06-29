import {
  Component, OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { MovieService } from '@services/movie/movie.service';
import { TmdbParameters } from '@models/interfaces';
import { DataService } from '@services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { MediaUserDataService } from '@services/media';


@Component({
  selector: 'media-grid',
  templateUrl: './media-grid.component.html',
  styleUrls: ['./media-grid.component.scss']
})
export class MediaGridComponent implements OnDestroy {

  sortByList = ['popularity.asc', 'popularity.desc', 'release_date.asc', 'release_date.desc', 'revenue.asc', 'revenue.desc', 'primary_release_date.asc', 'primary_release_date.desc', 'original_title.asc', 'original_title.desc', 'vote_average.asc', 'vote_average.desc', 'vote_count.asc', 'vote_count.desc'];
  sortByDefault = 'popularity.desc';
  sortBy = 'popularity.desc';
  discoverResults = [];
  discoverMoviesQuery = '';
  currentPage = 0;
  hasResults = false;
  loading = false;
  cardWidth = '130px';
  discoverTitle = '';
  @Input() hasMoreResults = false;
  @Input() procLoadMoreResults = false;
  protected paramMap = new Map<TmdbParameters, any>();
  protected ngUnsubscribe = new Subject();

  constructor(
    protected dataService: DataService,
    protected movieService: MovieService,
    protected activatedRoute: ActivatedRoute,
    protected mediaUserDataService: MediaUserDataService,
  ) { }


  @Output() onLoadMore = new EventEmitter<void>();
  @Input()
  mediaList = [];
  hasMediaList = false;
  @Input()
  gridTitle;
  selectedMovie = null;
  selectedMovies = [];
  displayMessage = '';
  displaySnackbar = false;
  @Input() isProccessing = true;


  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }


  /**
   * Increments the currentPage by 1 to get more results.
   */
  getMoreResults() {
    this.onLoadMore.emit();
  }


}
