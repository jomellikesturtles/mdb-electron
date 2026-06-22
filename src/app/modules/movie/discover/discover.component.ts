import { Component, OnInit, OnDestroy } from '@angular/core';
import { TmdbParameters, GenreCodes } from '@models/interfaces';
import { takeUntil } from 'rxjs/operators';
import { MediaGridComponent } from '@components/media-grid/media-grid.component';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent extends MediaGridComponent implements OnInit, OnDestroy {

  sortByList = ['popularity.asc', 'popularity.desc', 'release_date.asc', 'release_date.desc', 'revenue.asc', 'revenue.desc', 'primary_release_date.asc', 'primary_release_date.desc', 'original_title.asc', 'original_title.desc', 'vote_average.asc', 'vote_average.desc', 'vote_count.asc', 'vote_count.desc'];
  sortByDefault = 'popularity.desc';
  sortBy = 'popularity.desc';
  discoverResults = [];
  discoverMoviesQuery = '';
  currentPage = 1;
  hasResults = false;
  loading = false;
  cardWidth = '130px';
  discoverTitle = '';
  hasMoreResults = false;
  procLoadMoreResults = false;

  ngOnInit(): void {
    console.log('queryparamsA snapshot:', this.activatedRoute.snapshot);
    console.log('queryparamsA :', this.activatedRoute);
    this.dataService.discoverQuery.pipe(takeUntil(this.ngUnsubscribe)).subscribe((discoverData) => {
      this.discoverQuery(discoverData.type, discoverData.value, discoverData.name, discoverData.paramMap, discoverData.name);
    });
  }

  /**
   * Creates query for discover movies by movie type filter (cert,genre,year).
   * @param type the filter
   * @param val type value
   * @param val1 (optional) additional context
   */
  discoverQuery(type: string, val: string | number, val2: string, paramMap: Map<TmdbParameters, any>, name: string): void {
    let tempTitle = '';
    this.loading = true;
    this.discoverResults = [];
    // cert,year,genre,person
    switch (type) {
      case 'certification':
        this.paramMap.set(TmdbParameters.Certification, val);
        tempTitle = `Top ${val} movies`;
        break;
      case 'genre':
        this.paramMap.set(TmdbParameters.WithGenres, val);
        tempTitle = `Top ${GenreCodes[val]} movies`;
        break;
      case 'person':
        this.paramMap.set(TmdbParameters.WithPeople, val);
        tempTitle = `Top movies with ${val2}`;
        break;
      case 'year':
        this.paramMap.set(TmdbParameters.PrimaryReleaseYear, val);
        tempTitle = `Top movies from ${val}`;
        break;
      default:
        this.paramMap = paramMap;
        tempTitle = name;
        break;
    }

    this.movieService.getMoviesDiscover(this.paramMap).pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      if (data.results.length > 0) {
        this.discoverResults.push(...data.results);
        this.hasResults = true;
        this.discoverTitle = tempTitle;
        if (data.totalPages > this.currentPage) {
          this.hasMoreResults = true;
        }
      }
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  changeSort(sortByVal: string) {

    this.procLoadMoreResults = true;
    this.paramMap.set(TmdbParameters.SortBy, sortByVal);
    this.hasResults = false;
    this.movieService.getMoviesDiscover(this.paramMap).pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {

      this.discoverResults = data.results;
      this.hasResults = true;
      // this.discoverResults.push(...data.results) // for some reason this doesn't work anymore
      this.procLoadMoreResults = false;
    });
  }

  getMoreResults() {
    this.procLoadMoreResults = true;
    this.paramMap.set(TmdbParameters.Page, ++this.currentPage);
    this.movieService.getMoviesDiscover(this.paramMap).pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.discoverResults = [...this.discoverResults, ...data.results];
      if (data.totalPages <= this.currentPage) {
        this.hasMoreResults = false;
      }
      this.procLoadMoreResults = false;
    });
  }

}
