import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISearchQuery, TmdbParameters, TmdbSearchMovieParameters } from '@models/interfaces';
import { DataService } from '@services/data.service';
import { MovieService } from '@services/movie/movie.service';
import GeneralUtil from '@utils/general.util';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  searchResults = [];
  searchQuery: ISearchQuery;
  hasSearchResults = false;
  hasMoreResults = false;
  currentSearchQuery;
  selectedMovie = null;
  selectedMovies = [];
  cardWidth = '130px';
  displayMessage = '';
  displaySnackbar = false;
  currentPage = 1;
  isProcSearching = true;
  procLoadMoreResults = false;
  private ngUnsubscribe = new Subject();

  constructor(
    private dataService: DataService,
    private movieService: MovieService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    GeneralUtil.DEBUG.log('inResutlts');
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      const query = params['q'];
      if (query) {
        this.currentSearchQuery = query;
        this.isProcSearching = true;
        this.searchResults = [];
        this.currentPage = 1;
        this.searchQuery = { ...this.searchQuery, query: query };
        this.getSearchResults();
      } else {
        this.getData();
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  /**
   * Subscribes to list of highlighted movies.
   */
  getData() {
    this.dataService.searchQuery.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      if (data && data.query && data.query !== this.currentSearchQuery) {
        GeneralUtil.DEBUG.log('fromdataservice searchQuery: ', data);
        this.isProcSearching = true;
        this.searchResults = []; // clear for new search
        this.currentPage = 1;
        this.searchQuery = data;
        this.getSearchResults();
        this.currentSearchQuery = this.searchQuery.query;
      }
    });
  }

  getSearchResults() {
    const paramMap = new Map<TmdbParameters | TmdbSearchMovieParameters, any>();
    paramMap.set(TmdbSearchMovieParameters.Query, this.searchQuery.query);
    this.movieService.searchMovie(paramMap).subscribe(data => {
      this.searchResults = [...this.searchResults, ...data.results];
      if (data.totalPages > this.currentPage) {
        this.hasMoreResults = true;
      } else {
        this.hasMoreResults = false;
      }
      this.isProcSearching = false;
    });
  }

  /**
   * Increments the currentPage by 1 to get more results.
   */
  getMoreResults() {
    const paramMap = new Map<TmdbParameters | TmdbSearchMovieParameters, any>();
    paramMap.set(TmdbSearchMovieParameters.Query, this.searchQuery.query);
    paramMap.set(TmdbParameters.Page, ++this.currentPage);
    this.procLoadMoreResults = true;
    this.movieService.searchMovie(paramMap).subscribe(data => {
      this.searchResults = [...this.searchResults, ...data.results];
      if (data.totalPages <= this.currentPage) {
        this.hasMoreResults = false;
      }
      this.procLoadMoreResults = false;
    });
  }

}
