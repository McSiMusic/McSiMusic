import { ElementRef, Injectable } from '@angular/core';
import { Observable, mergeMap, map, distinctUntilChanged } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IntersectionService {
  createAndObserve(element: ElementRef): Observable<boolean> {
    return new Observable<IntersectionObserverEntry[]>((observer) => {
      const intersectionObserver = new IntersectionObserver((entries) => {
        observer.next(entries);
      });

      intersectionObserver.observe(element.nativeElement);

      return () => {
        intersectionObserver.disconnect();
      };
    }).pipe(
      mergeMap((entries: IntersectionObserverEntry[]) => entries),
      map((entry) => entry.isIntersecting),
      distinctUntilChanged()
    );
  }
}
