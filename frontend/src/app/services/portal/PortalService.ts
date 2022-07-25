import {
  ComponentFactory,
  ComponentRef,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { Type } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PortalService {
  root: ViewContainerRef | null = null;
  init(root: ViewContainerRef) {
    this.root = root;
  }

  add<T>(type: Type<T>, setParams?: (component: ComponentRef<T>) => void) {
    const component = this.root?.createComponent(type);
    setParams && component && setParams(component);
  }

  clear() {
    this.root?.clear();
  }
}
