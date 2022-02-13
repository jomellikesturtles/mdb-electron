import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalCardListComponent } from './horizontal-card-list.component';

describe('HorizontalCardListComponent', () => {
  let component: HorizontalCardListComponent;
  let fixture: ComponentFixture<HorizontalCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
