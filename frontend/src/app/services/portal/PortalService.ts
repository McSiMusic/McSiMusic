import {
  ComponentRef,
  Injectable,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { PortalType } from './types';

@Injectable({ providedIn: 'root' })
export class PortalService {
  roots = new Map<PortalType, ViewContainerRef>();

  init(root: ViewContainerRef, type: PortalType) {
    this.roots.set(type, root);
  }

  add<T>(
    type: Type<T>,
    portalType: PortalType,
    setParams?: (component: ComponentRef<T>) => void,
    projectableNodes?: Node[][]
  ) {
    const root = this.roots.get(portalType);
    if (root === undefined) {
      throw new Error(`Portal ${type} is undefined`);
    }

    const component = root.createComponent(type, { projectableNodes });
    setParams && component && setParams(component);
  }

  clear(type: PortalType) {
    this.roots.get(type)?.clear();
  }

  clearAll() {
    Object.values(this.roots).forEach((r) => r.clear());
  }
}
