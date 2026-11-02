import { Directive, ViewContainerRef, OnInit, input } from '@angular/core';
import { PortalService } from './PortalService';
import { PortalType } from './types';

@Directive({ selector: '[portalRoot]' })
export class PortalRootDirective implements OnInit {
  readonly portalRoot = input<PortalType>();
  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _portalService: PortalService
  ) {}

  ngOnInit(): void {
    const portalRoot = this.portalRoot();
    if (portalRoot === undefined) {
      throw new Error('Portal should have the type!');
    }

    this._portalService.init(this._viewContainerRef, portalRoot);
  }
}
