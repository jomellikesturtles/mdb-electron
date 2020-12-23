import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../../services/data.service'
import { MovieService } from '../../../services/movie.service'
import { TmdbParameters, GenreCodes } from '../../../interfaces';
import { Subject, combineLatest } from 'rxjs';
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
    this.dataService.discoverQuery.subscribe((discoverData) => {
      this.discoverQuery(discoverData.type, discoverData.value, discoverData.name, discoverData)
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
  discoverQuery(type: string, val: string | number, val2?: string, discoverData?): void {
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
        this.paramMap = discoverData.paramMap
        tempTitle = discoverData.name
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
