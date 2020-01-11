import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../services/data.service'
import { MovieService } from '../../services/movie.service'
import { TmdbParameters, GenreCodes } from '../../interfaces';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {

  sortByList = ['popularity.asc', 'popularity.desc', 'release_date.asc', 'release_date.desc', 'revenue.asc', 'revenue.desc', 'primary_release_date.asc', 'primary_release_date.desc', 'original_title.asc', 'original_title.desc', 'vote_average.asc', 'vote_average.desc', 'vote_count.asc', 'vote_count.desc']
  sortByDefault = 'popularity.desc'
  sortBy = 'popularity.desc'
  discoverResults = []
  discoverMoviesQuery = ''
  currentPage = 1
  hasResults = false
  cardWidth = '130px'
  discoverTitle = ''

  constructor(
    private cdr: ChangeDetectorRef,
    private dataService: DataService,
    private movieService: MovieService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.dataService.discoverQuery.subscribe(data => {
      console.log('fromdataservice: ', data);
      this.discoverQuery(data[0], data[1])
    });
  }

  /**
   * Creates query for discover movies by movie type filter (cert,genre,year).
   * @param type the filter
   * @param val type value
   */
  discoverQuery(type: string, val: string | number): void {
    const params = []
    let tempTitle = ''
    // cert,year,genre
    switch (type) {
      case 'certification':
        params.push([TmdbParameters.Certification, val])
        tempTitle = `Top ${val} movies`
        break;
      case 'genre':
        params.push([TmdbParameters.WithGenres, GenreCodes[val]])
        tempTitle = `Top ${val} movies`
        break;
      case 'year':
        params.push([TmdbParameters.PrimaryReleaseYear, val])
        tempTitle = `Top movies from ${val}`
        break;
      default:
        break;
    }
    this.movieService.getMoviesDiscover(params).subscribe(data => {
      if (data.results.length > 0) {
        this.discoverResults.push(...data.results)
        this.hasResults = true
        this.discoverTitle = tempTitle
      }
      this.cdr.detectChanges()
    });
  }

  onHighlight(val): void {

  }

  onSelect(val): void {

  }

  getMoreResults() {

  }

  getYear(date) {
    return this.utilsService.getYear(date)
  }
}
