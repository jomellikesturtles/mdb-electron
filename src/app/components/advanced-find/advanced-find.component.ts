import {
  AfterViewInit, Component, OnInit
} from '@angular/core';
import { GENRES, SORT_BY } from '@shared/constants';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ISearchQuery } from '@core/components/top-navigation/top-navigation.component';
import { MovieService } from '@services/movie/movie.service';
import { IGenre, TmdbParameters } from '@models/interfaces';
import { MatOptionSelectionChange } from '@angular/material/core';
import { DataService } from '@services/data.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'advanced-find',
  templateUrl: './advanced-find.component.html',
  styleUrls: ['./advanced-find.component.scss']
})
export class AdvancedFindComponent implements OnInit, AfterViewInit {

  constructor(
    private formBuilder: FormBuilder,
    private movieService: MovieService,
    private dataService: DataService,
    private router: Router,
    ) { }

  private ngUnsubscribe = new Subject();
  genresList = GENRES
  sortByList = SORT_BY
  browseLists = []
  Arr = Array; //Array type captured in a variable
  num: number = 20;
  searchForm: FormGroup
  DEFAULT_SEARCH_QUERY: ISearchQuery = {
    query: '',
    yearFrom: 1901,
    isAvailable: '',
    yearTo: (new Date()).getFullYear(),
    genres: [],
    type: '',
    availability: 'all',
    ratingAverageFrom: 0,
    ratingAverageTo: 10,
    sortBy: 'popularity.desc'
  }
  ratingList = []
  averageRatingsFromList = []
  averageRatingsToList = []
  releaseYearsFromList = []
  releaseYearsToList = []
  genreAndOr = '|'
  genreListVal = {}
  myVal = true

  ngOnInit() {
    let academyWinnersList = {
      name: 'Academy Winners',
      contents: []
    }
    this.browseLists.push(academyWinnersList)

    this.genresList.forEach((genre: IGenre) => {
      this.genreListVal[genre.name] = false
    })
    console.log(this.genreListVal)
    this.searchForm = this.formBuilder.group({
      query: ['', []],
      genres: this.formBuilder.array([]),
      yearFrom: [this.DEFAULT_SEARCH_QUERY.yearFrom, [Validators.required]],
      yearTo: [this.DEFAULT_SEARCH_QUERY.yearTo, [Validators.required]],
      averageRatingFrom: [this.DEFAULT_SEARCH_QUERY.ratingAverageFrom, [Validators.required]],
      averageRatingTo: [this.DEFAULT_SEARCH_QUERY.ratingAverageTo, [Validators.required]],
      availability: [this.DEFAULT_SEARCH_QUERY.availability, [Validators.required]],
      sortBy: [this.DEFAULT_SEARCH_QUERY.sortBy]
    }, {})
  }

  ngAfterViewInit(): void {
    this.generateRatings();
    this.generateReleaseYears();
  }

  generateReleaseYears() {
    for (let index = (new Date).getUTCFullYear(); index >= 1901; index--) {
      this.releaseYearsFromList.push(index)
      this.releaseYearsToList.push(index)
    }
    for (let index = (new Date).getUTCFullYear(); index >= 1901; index--) {
    }
  }

  generateRatings() {
    for (let index = 0; index <= 10; index += 0.5) {
      this.averageRatingsFromList.push({ value: index, label: index })
      this.averageRatingsToList.push({ value: index, label: index })
    }
  }

  onCheckboxChange(genre: string, isChecked: boolean) {
    const genresFormArray = <FormArray>this.searchForm.controls.genres;
    if (isChecked) {
      genresFormArray.push(new FormControl(genre));
    } else {
      let index = genresFormArray.controls.findIndex(x => x.value == genre)
      genresFormArray.removeAt(index);
    }
  }

  onAverageRatingChange(source: string, event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      if (source === 'from') {
        this.averageRatingsToList = []
        for (let index = 10; index >= event.source.value; index -= 0.5) {
          this.averageRatingsToList.push({ value: index, label: index })
        }
      }
      if (source === 'to') {
        this.averageRatingsFromList = []
        for (let index = 0; index <= event.source.value; index += 0.5) {
          this.averageRatingsFromList.push({ value: index, label: index })
        }
      }
    }
  }

  onYearChange(source: string, event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      if (source === 'from') {
        this.releaseYearsToList = []
        for (let index = this.DEFAULT_SEARCH_QUERY.yearTo; index >= event.source.value; index--) {
          this.releaseYearsToList.push(index)
        }
      }
      if (source === 'to') {
        this.releaseYearsFromList = []
        for (let index = 1901; index <= event.source.value; index++) {
          this.releaseYearsFromList.push(index)
        }
      }
    }
  }

  changeGenreAndOr(isChecked: boolean) {
    this.genreAndOr = isChecked ? ',' : '|'
  }

  /**
   * TODO: add screen for results.
   */
  goAdvancedSearch() {
    console.log(this.searchForm.controls)

    const paramMap = new Map<TmdbParameters, any>();
    paramMap.set(TmdbParameters.WithKeywords, this.searchForm.get('query').value)
    paramMap.set(TmdbParameters.WithGenres, this.searchForm.get('genres').value.join(this.genreAndOr))
    paramMap.set(TmdbParameters.PrimaryReleaseDateGreater, this.searchForm.get('yearFrom').value + '-01-01')
    paramMap.set(TmdbParameters.PrimaryReleaseDateLess, this.searchForm.get('yearTo').value + '-12-31')
    paramMap.set(TmdbParameters.VoteAverageGreater, this.searchForm.get('averageRatingFrom').value)
    paramMap.set(TmdbParameters.VoteAverageLess, this.searchForm.get('averageRatingTo').value)
    paramMap.set(TmdbParameters.SortBy, this.searchForm.get('sortBy').value)
  this.dataService.updateDiscoverQuery({name:'', type:'', value:'', paramMap})
  this.router.navigate([`/discover`]);
  }

  clearAdvancedSearch() {
    this.searchForm.reset()
    this.genresList.forEach((genre: IGenre) => {
      this.genreListVal[genre.name] = false
    })
    this.searchForm.get('yearFrom').setValue(this.DEFAULT_SEARCH_QUERY.yearFrom)
    this.searchForm.get('yearTo').setValue(this.DEFAULT_SEARCH_QUERY.yearTo)
    this.searchForm.get('averageRatingFrom').setValue(this.DEFAULT_SEARCH_QUERY.ratingAverageFrom)
    this.searchForm.get('averageRatingTo').setValue(this.DEFAULT_SEARCH_QUERY.ratingAverageTo)
    this.searchForm.get('sortBy').setValue(this.DEFAULT_SEARCH_QUERY.sortBy)
  }

  closeAdvancedSearch() {

  }


  ngOnDestroy(): void {
    console.log('destroy advanced find')
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }
}

const VOTE_COUNT = [
  {
    label: '100',
    value: 100
  },
  {
    label: '+1,000',
    value: 1000
  },
  {
    label: '+10,000',
    value: 10000
  },
  {
    label: '+100,000',
    value: 100000
  },
  {
    label: '+1,000,000',
    value: 1000000
  },
  {
    label: '+10,000,000',
    value: 10000000
  },
]

export enum BROWSE_TITLES {
  COMPLETED_WATCHED,
  INCOMPLETE_WATCHED,
  BOOKMARKED,
  FAVORITES,
}
