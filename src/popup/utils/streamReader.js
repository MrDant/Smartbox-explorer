import { switchMap, map } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { throwError } from "rxjs/index";

export default class StreamReader {
  constructor(url) {
    this.url = url;
    this.reader = null;
  }
  extractData() {
    return fromFetch(this.url).pipe(
      switchMap(async (response) => {
        if (response.redirected) {
          return throwError({
            status: 301,
            url: response.url,
          }).toPromise();
        }
        this.reader = response.body.getReader();
        return await this.loopReader(this.reader.read());
      })
    );
  }

  extractDataToJson() {
    return this.extractData().pipe(map((raw) => JSON.parse(raw)));
  }

  async loopReader(streamResult, oldData = "") {
    if (!streamResult instanceof Promise) {
      console.error("streamResult is not a instance of : Promise");
    }
    let result = await streamResult;
    if (result.done) {
      return oldData;
    } else {
      return this.loopReader(
        this.reader.read(),
        oldData + new TextDecoder("utf-8").decode(result.value)
      );
    }
  }

  getElement(selector) {
    return this.extractData().pipe(
      map((data) => {
        var el = document.createElement("html");
        el.innerHTML = data;
        return el.querySelector(selector);
      })
    );
  }

  getElements(selector) {
    return this.extractData().pipe(
      map((data) => {
        var el = document.createElement("html");
        el.innerHTML = data;
        return el.querySelectorAll(selector);
      })
    );
  }
}
