import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoominIconComponent } from './zoomin-icon.component';

describe('ZoominIconComponent', () => {
  let component: ZoominIconComponent;
  let fixture: ComponentFixture<ZoominIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoominIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoominIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
