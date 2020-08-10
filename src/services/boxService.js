import { map, catchError, tap, switchMap } from "rxjs/operators";
import Storage from "../common/utils/storage";
import Box from "../models/box";
import StreamReader from "../common/utils/streamReader";
import Api from "../models/api";
import ChromeWindow from "../common/utils/chromeWindow";
import { NEVER, throwError, BehaviorSubject } from "rxjs";

export default class BoxService {
  constructor() {
    this.boxesSubject = new BehaviorSubject(null);
    this.boxes$.subscribe();
  }

  static getInstance() {
    if (this._instance == null) {
      this._instance = new BoxService();
    }
    return this._instance;
  }

  get boxes$() {
    return this.boxesSubject.pipe(
      tap((data) => {
        if (data == null) {
          Storage.get(["boxes"]).subscribe((data) => {
            this.boxesSubject.next(data);
          });
        }
      })
    );
  }

  set boxes$(val) {
    this.boxesSubject.next(val);
    Storage.set({ boxes: val });
  }

  getBoxById(id) {
    return this.boxesSubject.pipe(
      map((boxes) => {
        return boxes ? boxes[id] : null;
      })
    );
  }

  getBoxActivities(box) {
    let stream = new StreamReader(
      `${Api.activities}?pim_id=${box.id}&pagesize=200`
    );
    return stream.extractDataToJson().pipe(
      catchError((error) => {
        if (error.status == 301 && error.url == Api.login) {
          ChromeWindow.focusTo(Api.login);
        }
      }),
      map((data) => {
        return data.items;
      })
    );
  }

  syncBox(box) {
    return new StreamReader(box.link).extractData().pipe(
      catchError((error) => {
        if (error.status == 301) {
          return new StreamReader(error.url).extractData();
        }
        return throwError(error);
      }),
      map((str) => {
        console.log(box.url);
        const match = str.match(/dataLayer.*\}\)\;/g)[0];
        const obj = JSON.parse(match.substring(15, match.length - 2));
        console.log(obj);
        box.info = obj.redemption_products[0];
        box.name = box.info.name;
        box.category = box.info.category;
        let boxes = this.boxesSubject.getValue();
        boxes[box.info.id] = box;
        this.boxes$ = boxes;
        return box;
      })
    );
  }

  syncBoxes() {
    const stream = new StreamReader(Api.history);
    return stream
      .getElements(
        "body .main-container .dashboard .qa-active-vouchers-panel .box-item"
      )
      .pipe(
        catchError((error) => {
          if (error.status == 301 && error.url == Api.login) {
            ChromeWindow.focusTo(Api.login);
            return NEVER;
          }
          return throwError(error);
        }),
        map((elements) => {
          return Array.from(elements).map((element) => new Box(element));
        }),
        switchMap(async (boxes) => {
          const result = {};
          for (const box of boxes) {
            let updateBox = await box.getInfo().toPromise();
            result[updateBox.id] = updateBox;
          }
          return result;
        }),
        tap((boxes) => {
          this.boxes$ = boxes;
        })
      );
  }
}
