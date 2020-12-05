import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-horizontal-card-list',
  templateUrl: './horizontal-card-list.component.html',
  styleUrls: ['./horizontal-card-list.component.scss']
})
export class HorizontalCardListComponent implements OnInit {

  @Input()
  moviesList: any
  @Input()
  title: string
  @Input()
  totalCount: number
  @Input()
  seeAllLink: string
  @Input()
  queryParams: any

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
  }

  seeAll() {
    this.router.navigate([this.seeAllLink], {
      relativeTo: this.activatedRoute, queryParams: this.queryParams,
    });
  }
}
