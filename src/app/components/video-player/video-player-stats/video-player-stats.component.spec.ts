import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPlayerStatsComponent } from './video-player-stats.component';

describe('VideoPlayerStatsComponent', () => {
  let component: VideoPlayerStatsComponent;
  let fixture: ComponentFixture<VideoPlayerStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoPlayerStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPlayerStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
