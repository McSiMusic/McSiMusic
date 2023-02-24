import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveformTimelineComponent } from './waveform-timeline.component';

describe('WaveformTimelineComponent', () => {
  let component: WaveformTimelineComponent;
  let fixture: ComponentFixture<WaveformTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaveformTimelineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaveformTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
