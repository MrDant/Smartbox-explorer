import { map, catchError, tap, switchMap } from "rxjs/operators";
import Storage from "../common/utils/storage";
import Box from "../models/box";
import Activity from "../models/activity";
import StreamReader from "../common/utils/streamReader";
import Api from "../models/api";
import ChromeWindow from "../common/utils/chromeWindow";
import { NEVER, throwError, BehaviorSubject, EMPTY } from "rxjs";

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

  saveBox(box) {
    let boxes = this.boxesSubject.getValue();
    Object.assign(boxes[box.info.id], box);
    this.boxes$ = boxes;
  }

  getBoxById(id) {
    return this.boxesSubject.pipe(
      map((boxes) => {
        return boxes ? boxes[id] : null;
      })
    );
  }

  syncBoxActivities(box, progress) {
    let stream = new StreamReader(
      `${Api.activities}?pim_id=${box.id}&pagesize=200&page=1&sortby=position`
    );
    return stream.extractDataToJson().pipe(
      catchError((error) => {
        console.log(error);
        if (error.status == 301 && error.url == Api.login) {
          ChromeWindow.focusTo(Api.login);
        }
        return EMPTY;
      }),
      switchMap(async (data) => {
        progress.next(this.progressNumber(data));
        box.total = data.total;
        box.activities = data.items.map((raw) => new Activity(raw));
        while (data.items.length == 200) {
          let stream = new StreamReader(
            `${Api.activities}?pim_id=${box.id}&pagesize=200&page=${data.page +
              1}`
          );
          data = await stream.extractDataToJson().toPromise();
          box.activities = box.activities.concat(
            data.items.map((raw) => new Activity(raw))
          );

          progress.next(this.progressNumber(data));
        }
        box.activities_name = box.activities
          .map((activity) => activity.name)
          .reduce((acc, current) => {
            if (current != "" && !acc.includes(current)) acc.push(current);
            return acc;
          }, [])
          .sort();
        this.saveBox(box);
      })
    );
  }

  syncBoxInfo(box) {
    return new StreamReader(box.link).extractData().pipe(
      catchError((error) => {
        if (error.status == 301) {
          return new StreamReader(error.url).extractData();
        }
        return throwError(error);
      }),
      map((str) => {
        const match = str.match(/dataLayer.*\}\)\;/g)[0];
        const obj = JSON.parse(match.substring(15, match.length - 2));
        if (obj.ecommerce) {
          ChromeWindow.focusTo(Api.login);
          return EMPTY;
        }
        box.info = obj.redemption_products[0];
        box.name = box.info.name;
        box.category = box.info.category;
        this.saveBox(box);
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

  progressNumber(data) {
    return Math.round(
      (data.page /
        (data.total % data.pagesize > 0
          ? Math.round(data.total / data.pagesize) + 1
          : data.total / data.pagesize)) *
        100
    );
  }
}
