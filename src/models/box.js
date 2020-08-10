import StreamReader from "../common/utils/streamReader.js";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

export default class Box {
  constructor(htmlElement) {
    this.img = htmlElement.querySelector(".box-item__image").src;
    this.link = htmlElement.querySelector(".qa-box-title").href;
    this.validate = htmlElement.querySelector(".qa-voucher-status").innerText;
  }

  getInfo() {
    return new StreamReader(this.link).extractData().pipe(
      catchError((error) => {
        if (error.status == 301) {
          this.url = error.url;
          return new StreamReader(error.url).extractData();
        }
        return throwError(error);
      }),
      map((str) => {
        const match = str.match(/dataLayer.*\}\)\;/g)[0];
        const obj = JSON.parse(match.substring(15, match.length - 2));
        console.log(obj);
        this.info = obj.redemption_products[0];
        return this;
      })
    );
  }
}
