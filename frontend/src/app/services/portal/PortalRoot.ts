import { Directive, ViewContainerRef } from '@angular/core';
import { PortalService } from './PortalService';

@Directive({
  selector: '[portalRoot]',
})
export class PortalRootDirective {
  constructor(
    viewContainerRef: ViewContainerRef,
    portalService: PortalService
  ) {
    portalService.init(viewContainerRef);
  }
}
