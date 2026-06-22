import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '@services/data.service';

@Component({
  selector: 'app-horizontal-card-list',
  templateUrl: './horizontal-card-list.component.html',
  styleUrls: ['./horizontal-card-list.component.scss']
})
export class HorizontalCardListComponent implements OnInit {

  @Input()
  moviesList: any;
  @Input()
  title: string;
  @Input()
  totalCount: number;
  @Input()
  seeAllLink: string;
  @Input()
  queryParams: any;
  @Input()
  loading: boolean = false;
  @Input()
  disableHover = false;

  @ViewChild('cardListContainer') cardListContainer: ElementRef;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
  ) { }

  ngOnInit() {
  }

  scrollLeft() {
    this.cardListContainer.nativeElement.scrollBy({ left: -500, behavior: 'smooth' });
  }

  scrollRight() {
    this.cardListContainer.nativeElement.scrollBy({ left: 500, behavior: 'smooth' });
  }

  seeAll() {
    // queryParams: { type: 'year', year: year; }
    console.log('this.queryParams', this.queryParams);
    // this.dataService.updateDiscoverQuery({ type: null, value: null, name: this.title, paramMap: this.queryParams });
    this.router.navigate([this.seeAllLink], {
      relativeTo: this.activatedRoute, queryParams: this.queryParams,
    });
  }
}
