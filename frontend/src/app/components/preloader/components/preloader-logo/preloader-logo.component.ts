import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
    selector: 'app-preloader-logo',
    templateUrl: 'preloader.svg',
    changeDetection: ChangeDetectionStrategy.Eager
})
export class PreloaderLogoComponent {
  readonly size = input(50);
}
