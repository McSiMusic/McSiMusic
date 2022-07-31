import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-preloader-logo',
  templateUrl: 'preloader.svg',
})
export class PreloaderLogoComponent {
  @Input() size = 50;
}
