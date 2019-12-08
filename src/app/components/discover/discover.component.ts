import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../services/data.service'
import { MovieService } from '../../services/movie.service'
import { TmdbParameters } from '../../interfaces';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {

  sortBy = 'popularity.desc'
  discoverResults = []
  discoverMoviesQuery = ''
  currentPage = 1

  constructor(
    private cdr: ChangeDetectorRef,
    private dataService: DataService,
    private movieService: MovieService
  ) { }

  ngOnInit() {
    this.dataService.discoverQuery.subscribe(data => {
      console.log('fromdataservice: ', data);
      this.discoverQuery(data[0])
    });
  }

  discoverQuery(type) {
    const params = []
    // cert,year,genre
    switch (type) {
      case 'certification':
        params.push([TmdbParameters.Certification, this.discoverMoviesQuery])
        break;
      case 'genre':
        params.push([TmdbParameters.WithGenres, this.discoverMoviesQuery])
        break;
      case 'year':
        params.push([TmdbParameters.PrimaryReleaseYear, this.discoverMoviesQuery])
        break;
      default:
        break;
    }
    this.movieService.getMoviesDiscover(params).subscribe(data => {
      this.discoverResults.push(...data.results)
      this.cdr.detectChanges()
    });
  }
}
