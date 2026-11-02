import { Component, OnInit, ChangeDetectionStrategy, input } from '@angular/core';
import { PreloaderLogoComponent } from './components/preloader-logo/preloader-logo.component';

@Component({
    selector: 'app-preloader',
    templateUrl: './preloader.component.html',
    styleUrls: ['./preloader.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [PreloaderLogoComponent]
})
export class PreloaderComponent implements OnInit {
  constructor() {}

  readonly caption = input('Loading...');

  ngOnInit(): void {}
}
