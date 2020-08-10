import { Observable } from "rxjs";

export default class Storage {
  static get(key) {
    return Observable.create((observer) => {
<<<<<<< HEAD
      chrome.storage.local.get(key, (data) => {
=======
      chrome.storage.sync.get(key, (data) => {
>>>>>>> 2efe523... update structure
        if (data[key]) observer.next(data[key]);
        else observer.next([]);
        observer.complete();
      });
    });
  }

  static set(val) {
<<<<<<< HEAD
    chrome.storage.local.set(val);
=======
    chrome.storage.sync.set(val);
>>>>>>> 2efe523... update structure
  }
}
