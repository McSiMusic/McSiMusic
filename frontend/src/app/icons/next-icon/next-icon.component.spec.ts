import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextIconComponent } from './next-icon.component';

describe('NextIconComponent', () => {
  let component: NextIconComponent;
  let fixture: ComponentFixture<NextIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
