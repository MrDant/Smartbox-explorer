import { map, switchMap } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { from, of, throwError } from "rxjs";
export default class StreamReader {
  static extractDataOfStream(url) {
    return fromFetch(url).pipe(
      switchMap((response) => {
        if (response.redirected) {
          return throwError({
            status: 301,
            url: response.url,
          });
        }
        return response.body.getReader().read();
      })
    );
  }
}
