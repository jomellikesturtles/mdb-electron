import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAndResultsComponent } from './search-and-results.component';

describe('SearchAndResultsComponent', () => {
  let component: SearchAndResultsComponent;
  let fixture: ComponentFixture<SearchAndResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAndResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAndResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
