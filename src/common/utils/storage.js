import { Observable } from "rxjs";

export default class Storage {
  static get(key) {
    return Observable.create((observer) => {
      chrome.storage.sync.get(key, (data) => {
        if (data[key]) observer.next(data[key]);
        else observer.next([]);
        observer.complete();
      });
    });
  }

  static set(val) {
    chrome.storage.sync.set(val);
  }
}
