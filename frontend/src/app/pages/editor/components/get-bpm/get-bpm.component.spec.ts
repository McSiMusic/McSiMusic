import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetBpmComponent } from './get-bpm.component';

describe('GetBpmComponent', () => {
  let component: GetBpmComponent;
  let fixture: ComponentFixture<GetBpmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetBpmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetBpmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
