import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomoutIconComponent } from './zoomout-icon.component';

describe('ZoomoutIconComponent', () => {
  let component: ZoomoutIconComponent;
  let fixture: ComponentFixture<ZoomoutIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoomoutIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoomoutIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
