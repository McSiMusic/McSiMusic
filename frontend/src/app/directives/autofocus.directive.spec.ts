import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AutofocusDirective } from './autofocus.directive';

@Component({
  template: '<input [appAutofocus]="true">',
  imports: [AutofocusDirective],
})
class TestHostComponent {}

describe('AutofocusDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement
      .query(By.directive(AutofocusDirective))
      .injector.get(AutofocusDirective);
    expect(directive).toBeTruthy();
  });
});
