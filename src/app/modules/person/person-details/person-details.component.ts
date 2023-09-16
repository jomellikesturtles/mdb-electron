import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '@services/data.service';
import { PersonService } from '@services/person.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit {
  @Input() data: Observable<any>;
  hasData = false;
  person: any;
  creditsCast;
  creditsCrew;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private personService: PersonService,
    private router: Router) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getPersonDetails(id);
  }

  getPersonDetails(val: number | string): void {
    console.log('getting person details');
    this.personService.getPersonDetails(val).subscribe(data => {
      console.log('got from getMovieOnline ', data);
      this.person = data;
      this.creditsCast = data.movie_credits.cast;
      this.creditsCrew = data.movie_credits.crew;
      this.hasData = true;
    });
  }

  goToMovie(val): void {
    const highlightedId = val;
    this.dataService.updateHighlightedMovie(highlightedId);
    this.router.navigate([`/details/${highlightedId}`], { relativeTo: this.activatedRoute });
  }
}
