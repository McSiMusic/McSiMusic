import { combineLatest, fromEvent, map, Observable, of, tap } from "rxjs";

export const createImageFromBlob = (image: Blob): Observable<string> => {
  let reader = new FileReader();

  return combineLatest([fromEvent(reader, "load", { capture: false }), of(reader.readAsDataURL(image))]).pipe(
    map(() => reader.result as string)
  )
  .pipe(tap(() => reader.readAsDataURL(image)))
};
