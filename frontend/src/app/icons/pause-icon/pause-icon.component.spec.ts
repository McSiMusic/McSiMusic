import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PauseIconComponent } from './pause-icon.component';

describe('PauseIconComponent', () => {
  let component: PauseIconComponent;
  let fixture: ComponentFixture<PauseIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PauseIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PauseIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
