import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../../services/data.service'
import { MovieService } from '../../../services/movie.service'
import { TmdbParameters, GenreCodes } from '../../../interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit, OnDestroy {

  sortByList = ['popularity.asc', 'popularity.desc', 'release_date.asc', 'release_date.desc', 'revenue.asc', 'revenue.desc', 'primary_release_date.asc', 'primary_release_date.desc', 'original_title.asc', 'original_title.desc', 'vote_average.asc', 'vote_average.desc', 'vote_count.asc', 'vote_count.desc']
  sortByDefault = 'popularity.desc'
  sortBy = 'popularity.desc'
  discoverResults = []
  discoverMoviesQuery = ''
  currentPage = 1
  hasResults = false
  cardWidth = '130px'
  discoverTitle = ''
  hasMoreResults = false
  private paramMap = new Map<TmdbParameters, any>();
  private ngUnsubscribe = new Subject();

  constructor(
    private dataService: DataService,
    private movieService: MovieService,
    private activatedRoute: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    // !TODO: WIP. change to queryParams
    this.dataService.discoverQuery.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      console.log('fromdataservice: ', data);
      this.discoverQuery(data[0], data[1], data[2])
    });
    this.activatedRoute.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      console.log(data)
      this.discoverQuery(data.type, data.value, data.name)
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  /**
   * Creates query for discover movies by movie type filter (cert,genre,year).
   * @param type the filter
   * @param val type value
   * @param val1 (optional) additional context
   */
  discoverQuery(type: string, val: string | number, val2?: string): void {
    let tempTitle = ''
    // cert,year,genre,person
    switch (type) {
      case 'certification':
        this.paramMap.set(TmdbParameters.Certification, val)
        tempTitle = `Top ${val} movies`
        break;
      case 'genre':
        this.paramMap.set(TmdbParameters.WithGenres, val)
        tempTitle = `Top ${GenreCodes[val]} movies`
        break;
      case 'person':
        this.paramMap.set(TmdbParameters.WithPeople, val)
        tempTitle = `Top movies with ${val2}`
        break;
      case 'year':
        this.paramMap.set(TmdbParameters.PrimaryReleaseYear, val)
        tempTitle = `Top movies from ${val}`
        break;
        default:
          this.paramMap.set(val[0], val[1])
          tempTitle = `Top movies with ${val}`
        break;
    }
    this.movieService.getMoviesDiscover(this.paramMap).subscribe(data => {
      if (data.results.length > 0) {
        this.discoverResults.push(...data.results)
        this.hasResults = true
        this.discoverTitle = tempTitle
        if (data.total_pages > this.currentPage) {
          this.hasMoreResults = true
        }
      }
    });
  }

  getMoreResults() {
    this.paramMap.set(TmdbParameters.Page, ++this.currentPage)
    this.movieService.getMoviesDiscover(this.paramMap).subscribe(data => {
      this.discoverResults.push(...data.results)
      if (data.total_pages <= this.currentPage) {
        this.hasMoreResults = false
      }
    })
  }

}
