import { Directive, Input, ViewContainerRef, OnInit } from '@angular/core';
import { PortalService } from './PortalService';
import { PortalType } from './types';

@Directive({
  selector: '[portalRoot]',
})
export class PortalRootDirective implements OnInit {
  @Input() portalRoot?: PortalType;
  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _portalService: PortalService
  ) {}

  ngOnInit(): void {
    if (this.portalRoot === undefined) {
      throw new Error('Portal should have the type!');
    }

    this._portalService.init(this._viewContainerRef, this.portalRoot);
  }
}
