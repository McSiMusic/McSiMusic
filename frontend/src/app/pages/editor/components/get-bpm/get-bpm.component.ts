import { Component, ChangeDetectionStrategy, effect, input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActionsService } from 'src/app/services/ActionsService';
import { ButtonComponent } from '../../../../ui-components/button/button.component';
import { PreloaderComponent } from '../../../../components/preloader/preloader.component';

@Component({
    selector: 'app-get-bpm',
    templateUrl: './get-bpm.component.html',
    styleUrls: ['./get-bpm.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ButtonComponent, PreloaderComponent]
})
export class GetBpmComponent {
  constructor(private _actionsService: ActionsService) {
    effect(() => {
      this.trackId();
      this.bpm = undefined;
    });
  }

  readonly trackId = input<string>();
  loading = false;
  bpm?: number;

  getBpm = () => {
    const trackId = this.trackId();
    if (trackId === undefined) return;

    this.loading = true;
    this._actionsService.getBpm(trackId).subscribe((result) => {
      this.loading = false;
      this.bpm = result;
    });
  };
}
