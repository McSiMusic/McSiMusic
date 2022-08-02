import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownIconComponent } from './dropdown-icon.component';

describe('DropdownIconComponent', () => {
  let component: DropdownIconComponent;
  let fixture: ComponentFixture<DropdownIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
