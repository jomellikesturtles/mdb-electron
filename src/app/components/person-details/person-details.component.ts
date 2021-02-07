import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../../services/data.service';
import { PersonService } from '../../services/person.service';
import { UtilsService } from '../../services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PERSON_DETAILS, PERSON_DETAILS_FULL, PERSON_COMBINED_CREDITS } from '../../mock-data-person-details';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit, OnDestroy {
  @Input() data: Observable<any>;
  hasData = false;
  person: any;
  creditsCast
  creditsCrew

  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private personService: PersonService,
    private utilsService: UtilsService,
    private router: Router) { }

  ngOnInit(): void {
    if (environment.runConfig.useTestData === true) {
      this.person = PERSON_DETAILS
      this.creditsCast = PERSON_COMBINED_CREDITS.cast
      this.creditsCrew = PERSON_COMBINED_CREDITS.crew
      this.hasData = true
    } else {

      const id = this.activatedRoute.snapshot.paramMap.get('id')
      this.getPersonDetails(id)
      // this.activatedRoute.params.subscribe(params => {
      //   console.log('activatedRoute.params', params);
      //   if (params.id) {
      //     this.getPersonDetails(params.id)
      //   } else {
      //     this.hasData = false
      //   }
      // });
    }
  }

  ngOnDestroy(): void {

  }

  getPersonDetails(val: number | string): void {
    console.log('getting person details');
    this.personService.getPersonDetails(val).subscribe(data => {
      console.log('got from getMovieOnline ', data)
      this.person = data;
      this.creditsCast = data.movie_credits.cast
      this.creditsCrew = data.movie_credits.crew
      this.hasData = true
    });
  }

  goToMovie(val): void {
    const highlightedId = val
    this.dataService.updateHighlightedMovie(highlightedId);
    this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });
  }
}
