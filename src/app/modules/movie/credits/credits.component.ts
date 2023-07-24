import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit, OnDestroy {

  castList = {};
  crewList = {};

  @Input()
  set credits(val: any) {
    this.castList = val.cast;
    this.crewList = val.crew;
  }

  constructor() { }

  ngOnInit() {
  }
  ngOnDestroy() {

  }
  goToPerson(id) {
    console.log(id);
  }
}
