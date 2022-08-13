import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdbButtonComponent } from './mdb-button.component';

describe('MdbButtonComponent', () => {
  let component: MdbButtonComponent;
  let fixture: ComponentFixture<MdbButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdbButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdbButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
