import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent<unknown>;
  let fixture: ComponentFixture<DropdownComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DropdownComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DropdownComponent<unknown>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
