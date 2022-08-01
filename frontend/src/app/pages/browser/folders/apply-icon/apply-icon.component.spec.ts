import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyIconComponent } from './apply-icon.component';

describe('ApplyIconComponent', () => {
  let component: ApplyIconComponent;
  let fixture: ComponentFixture<ApplyIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
