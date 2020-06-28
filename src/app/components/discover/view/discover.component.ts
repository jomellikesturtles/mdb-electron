import { environment } from './../../../../environments/environment';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../../services/data.service'
import { MovieService } from '../../../services/movie.service'
import { TmdbParameters, GenreCodes, TmdbSearchMovieParameters } from '../../../interfaces';
import { TMDB_SEARCH_RESULTS } from '../../../mock-data';

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
  hasMoreResults = false
  currentParams = []

  constructor(
    private dataService: DataService,
    private movieService: MovieService,
  ) { }

  ngOnInit(): void {
      this.dataService.discoverQuery.subscribe(data => {
        console.log('fromdataservice: ', data);
        this.discoverQuery(data[0], data[1], data[2])
      });
  }

  /**
   * Creates query for discover movies by movie type filter (cert,genre,year).
   * @param type the filter
   * @param val type value
   * @param val1 (optional) additional context
   */
  discoverQuery(type: string, val: string | number, val2?: string): void {
    // commented for TESTING
    const params = []
    let tempTitle = ''
    // cert,year,genre,person
    switch (type) {
      case 'certification':
        params.push([TmdbParameters.Certification, val])
        tempTitle = `Top ${val} movies`
        break;
      case 'genre':
        params.push([TmdbParameters.WithGenres, val])
        tempTitle = `Top ${GenreCodes[val]} movies`
        break;
      case 'person':
        params.push([TmdbParameters.WithPeople, val])
        tempTitle = `Top movies with ${val2}`
        break;
      case 'year':
        params.push([TmdbParameters.PrimaryReleaseYear, val])
        tempTitle = `Top movies from ${val}`
        break;
      default:
        break;
    }
    this.currentParams = params
    this.movieService.getMoviesDiscover(params).subscribe(data => {
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
    const params = this.currentParams

    // [TmdbSearchMovieParameters.Query, this.searchQuery.query],
    params.push([TmdbParameters.Page, ++this.currentPage])
    // ]
    // this.currentParams.push([TmdbParameters.Page, ++this.currentPage])
    this.movieService.getMoviesDiscover(params).subscribe(data => {
      this.discoverResults.push(...data.results)
      if (data.total_pages <= this.currentPage) {
        this.hasMoreResults = false
      }
      // this.setHighlights()
    })
  }

}
