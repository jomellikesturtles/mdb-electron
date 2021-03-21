import { AfterViewInit, Component, ElementRef, OnInit, Pipe, PipeTransform, Renderer2, ViewChild } from '@angular/core';
import { GENRES, SORT_BY } from '@shared/constants';
import { MatSelect } from "@angular/material/select";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ISearchQuery } from '@components/top-navigation/top-navigation.component';
import { MovieService } from '@services/movie.service';
import { IGenre, TmdbParameters } from 'app/interfaces';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'advanced-find',
  templateUrl: './advanced-find.component.html',
  styleUrls: ['./advanced-find.component.scss']
})
export class AdvancedFindComponent implements OnInit, AfterViewInit {

  @ViewChild('testClass', { static: false }) testClass: ElementRef
  @ViewChild('releaseYearStart', { static: false }) releaseYearStartRef: MatSelect

  constructor(
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private movieService: MovieService) { }


  genresList = GENRES
  sortByList = SORT_BY
  browseLists = []
  Arr = Array; //Array type captured in a variable
  num: number = 20;
  searchForm: FormGroup
  DEFAULT_SEARCH_QUERY: ISearchQuery = {
    query: '',
    fromYear: 1901,
    isAvailable: '',
    toYear: (new Date()).getFullYear(),
    genres: [],
    type: '',
    availability: 'all',
    sortBy: 'popularity.asc'
  }

  releaseYearsFromList = [null]
  releaseYearsToList = [null]

  ngOnInit() {
    const d = new Date()
    d.getFullYear()
    let academyWinnersList = {
      name: 'Academy Winners',
      contents: []
    }
    this.browseLists.push(academyWinnersList)

    this.searchForm = this.formBuilder.group({
      query: ['', []],
      genres: this.formBuilder.array([]),
      fromYear: [this.DEFAULT_SEARCH_QUERY.fromYear, [Validators.required]],
      toYear: [this.DEFAULT_SEARCH_QUERY.toYear, [Validators.required]],
      availability: [this.DEFAULT_SEARCH_QUERY.availability, [Validators.required]],
      sortBy: [this.DEFAULT_SEARCH_QUERY.sortBy]
    }, {})
  }


  ngAfterViewInit(): void {
    setTimeout(() => {


      for (let index = 1901; index < 2021; index++) {
        try {
          console.log('b41')
          const contactOTP2 = this.renderer.selectRootElement('#test-class');
          const contactResp2 = this.renderer.createText('TESTING');
          this.renderer.appendChild(this.testClass.nativeElement, contactResp2);
          // this.renderer.setAttribute(contactOTP2, '[value]', 'g')
          console.log('b4')
          // const contactOTP = this.releaseYearStartRef.nativeElement
          // const contactOTP = this.renderer.selectRootElement('.releaseYearStart');
          // const contactResp = this.renderer.createText(index.toString());

          const matOption = this.renderer.createElement('mat-option');
          const text = this.renderer.createText('Hello world!');
          // this.renderer.createElement()
          this.renderer.setValue(matOption, 'g')
          console.log('after1')
          this.renderer.appendChild(matOption, text);
          console.log('after2')
          this.releaseYearStartRef._elementRef.nativeElement
          // this.renderer.appendChild(this.releaseYearStartRef._elementRef.nativeElement, matOption);

        } catch (e) {
          console.log('NOTFOUND', e)
          // element not found, do nothing
        }
      }
    }, 1000);
    this.generateReleaseYears();

  }

  // get queryField() { return this.searchForm.get('query'); }
  // get genresField() { return this.searchForm.get('genres'); }
  // get startYearField() { return this.searchForm.get('fromYear'); }
  // get endYearField() { return this.searchForm.get('toYear'); }
  // get availabilityField() { return this.searchForm.get('availability'); }
  // get sortByField() { return this.searchForm.get('sortBy'); }

  generateReleaseYears() {
    for (let index = (new Date).getUTCFullYear(); index >= 1901; index--) {
      this.releaseYearsFromList.push(index)
    }

    for (let index = (new Date).getUTCFullYear(); index >= 1901; index--) {
      this.releaseYearsToList.push(index)
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

  myEvent(eventName, event) {
    console.log(eventName, event)
  }

  onYearChange(source: string, event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      if (source === 'from') {
        this.releaseYearsToList = []
        for (let index = this.DEFAULT_SEARCH_QUERY.toYear; index >= event.source.value; index--) {
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

  goAdvancedSearch() {
    console.log(this.searchForm.controls)

    const paramMap = new Map<TmdbParameters, any>();
    paramMap.set(TmdbParameters.WithKeywords, this.searchForm.get('query').value)
    paramMap.set(TmdbParameters.WithGenres, this.searchForm.get('genres').value.toString())
    paramMap.set(TmdbParameters.PrimaryReleaseDateGreater, this.searchForm.get('fromYear').value)
    paramMap.set(TmdbParameters.PrimaryReleaseDateLess, this.searchForm.get('toYear').value)
    paramMap.set(TmdbParameters.SortBy, this.searchForm.get('sortBy').value)
    this.movieService.getMoviesDiscover(paramMap)
  }

  clearAdvancedSearch() {
    this.searchForm.reset()
    this.searchForm.controls.genres.setValue(null);
    const genresFormArray = <FormArray>this.searchForm.controls.genres;
    // if (isChecked) {
    // genresFormArray.push(new FormControl(genre));
    // } else {
    // let index = genresFormArray.controls.findIndex(x => x.value == genre)
    genresFormArray.controls.forEach(element => {
      element.setValue(false)
    });
    // genresFormArray.removeAt(index);
  }

}


export enum BROWSE_TITLES {
  COMPLETED_WATCHED,
  INCOMPLETE_WATCHED,
  BOOKMARKED,
  FAVORITES,
}

@Pipe({
  name: 'range',
  pure: false
})

export class RangePipe implements PipeTransform {
  transform(items: any[], quantity: number): any {
    items.length = 0;
    for (let i = 0; i < quantity; i++) {
      items.push(i);
    }
    return items;
  }
}
